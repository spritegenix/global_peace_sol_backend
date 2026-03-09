const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');
const User = require('./models/User');
const Category = require('./models/Category');
const Business = require('./models/Business');
const { categories, businesses } = require('./data');

let mongoServer;
const connectDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log(`Connected to in-memory MongoDB at ${uri}`);

        const count = await Category.countDocuments();
        if (count === 0) {
            console.log("Database empty. Auto-seeding default data into memory...");

            // Create a default admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@yellowwebsite.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Default admin user created: admin@yellowwebsite.com / admin123');

            const cleanCategories = categories.map(({ id, ...rest }) => rest);
            const cleanBusinesses = businesses.map(({ id, ...rest }) => {
                rest.owner = adminUser._id; // Assign to admin by default
                return rest;
            });
            await Category.insertMany(cleanCategories);
            await Business.insertMany(cleanBusinesses);
            console.log('In-memory database successfully seeded!');
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return JWT
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categoriesList = await Category.find();
        res.json(categoriesList);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching categories' });
    }
});

app.get('/api/businesses', async (req, res) => {
    try {
        const { category, featured, name, pincode, location } = req.query;
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (featured === 'true') {
            filter.isFeatured = true;
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (pincode) {
            filter.pincode = pincode;
        }

        if (location) {
            filter.address = { $regex: location, $options: 'i' };
        }

        const businessesList = await Business.find(filter);
        res.json(businessesList);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching businesses' });
    }
});

app.get('/api/businesses/:id', async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });
        res.json(business);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching business' });
    }
});

app.post('/api/businesses', authMiddleware, async (req, res) => {
    try {
        const businessReq = req.body;

        if (!businessReq.name || !businessReq.category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }

        if (!businessReq.image) {
            businessReq.image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
        }

        businessReq.owner = req.user.id;

        const newBusiness = new Business(businessReq);
        await newBusiness.save();

        res.status(201).json(newBusiness);
    } catch (err) {
        res.status(500).json({ error: 'Server error saving business' });
    }
});

app.put('/api/businesses/:id', authMiddleware, async (req, res) => {
    try {
        let business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });

        // Check user ownership or admin explicitly
        if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to edit this business' });
        }

        business = await Business.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(business);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating business' });
    }
});

app.delete('/api/businesses/:id', authMiddleware, async (req, res) => {
    try {
        let business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });

        if (business.owner?.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this business' });
        }

        await Business.findByIdAndDelete(req.params.id);
        res.json({ message: 'Business removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error deleting business' });
    }
});

// --- Admin Routes ---
app.get('/api/users', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error fetching users');
    }
});

app.delete('/api/users/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Cascade delete businesses owned by user (optional, doing it for cleanup)
        await Business.deleteMany({ owner: req.params.id });
        res.json({ message: 'User and their businesses removed' });
    } catch (err) {
        res.status(500).send('Server error deleting user');
    }
});

app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
