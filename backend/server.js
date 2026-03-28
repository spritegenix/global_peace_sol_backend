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
        let uri = process.env.MONGO_URI;
        if (!uri) {
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log(`Using in-memory MongoDB at ${uri}`);
        } else {
            console.log(`Connecting to provided MongoDB URI`);
        }

        await mongoose.connect(uri);
        console.log(`Successfully connected to MongoDB`);

        // --- DB MIGRATION: Replace Old Category Names ---
        const categoryMap = {
            "Mental Health & Therapys": "Mental Health & Therapy",
            "Automotive": "Relationship & Family Support",
            "Home Repair": "Career & Life Stress Support",
            "Beauty & Spa": "NGO & Social Support Services",
            "Health": "Conflict Resolution & Mediation",
            "Shopping": "Cyber Safety & Crisis Help",
            "Nightlife": "Mindfulness & Inner Growth"
        };
        
        console.log("Running category migrations on businesses...");
        for (const [oldName, newName] of Object.entries(categoryMap)) {
            // Update businesses using the old category name
            const updateRes = await Business.updateMany(
                { category: new RegExp(`^${oldName}$`, 'i') }, 
                { $set: { category: newName } }
            );
            if (updateRes.modifiedCount > 0) {
                console.log(`Migrated ${updateRes.modifiedCount} businesses from '${oldName}' to '${newName}'`);
            }
        }

        // Always synchronize categories with the core list in data.js
        console.log("Synchronizing categories...");
        await Category.deleteMany({});
        const cleanCategories = categories.map(({ id, ...rest }) => rest);
        await Category.insertMany(cleanCategories);
        console.log('Categories synchronized.');

        const businessCount = await Business.countDocuments();
        if (businessCount === 0) {
            console.log("Seeding default businesses...");
            // Create a default admin user if it doesn't exist
            let adminUser = await User.findOne({ email: 'admin@yellowwebsite.com' });
            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                adminUser = new User({
                    name: 'Admin User',
                    email: 'admin@yellowwebsite.com',
                    password: hashedPassword,
                    role: 'admin'
                });
                await adminUser.save();
                console.log('Default admin user created.');
            }

            const cleanBusinesses = businesses.map(({ id, ...rest }) => {
                rest.owner = adminUser._id;
                return rest;
            });
            await Business.insertMany(cleanBusinesses);
            console.log('Default businesses seeded.');
        }

            // Seed default Ads
            await Ad.insertMany([
                {
                    page: 'Home',
                    title: 'Home Page Ad — Boost Your Visibility',
                    description: 'Get your business featured on the Home Page and reach thousands of local customers.',
                    media: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
                    redirectLink: '/add-business'
                },
                {
                    page: 'Categories',
                    title: 'Categories Page Ad — Target the Right Users',
                    description: 'Reach customers who are actively browsing categories looking for your services.',
                    media: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60',
                    redirectLink: '/add-business'
                },
                {
                    page: 'Directory',
                    title: 'Directory Page Ad — Free Business Listing',
                    description: 'Join 50,000+ businesses already listed. Setup takes under 5 minutes.',
                    media: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
                    redirectLink: '/add-business'
                },
                {
                    page: 'BusinessDetails',
                    title: 'Business Details Ad — Reach Local Customers',
                    description: 'Advertise right next to business profiles and capture high-intent users.',
                    media: 'https://images.unsplash.com/photo-1620714223084-8fcacc2dfd4d?w=800&auto=format&fit=crop&q=60',
                    redirectLink: '/add-business'
                }
            ]);

            console.log('In-memory database successfully seeded!');
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
        const { category, featured, name, pincode, location, owner } = req.query;
        let filter = {};

        if (category) {
            filter.category = { $regex: category, $options: 'i' };
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

        if (owner) {
            filter.owner = owner;
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

        // Check and auto-create category if doesn't exist
        const existingCat = await Category.findOne({ name: { $regex: new RegExp(`^${businessReq.category}$`, 'i') } });
        if (!existingCat) {
            const newCat = new Category({
                name: businessReq.category,
                icon: 'category',
                count: '1 Listing'
            });
            await newCat.save();
        }

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

        // Check and auto-create category if updated to a new one
        if (req.body.category) {
            const existingCat = await Category.findOne({ name: { $regex: new RegExp(`^${req.body.category}$`, 'i') } });
            if (!existingCat) {
                const newCat = new Category({
                    name: req.body.category,
                    icon: 'category',
                    count: '1 Listing'
                });
                await newCat.save();
            }
        }

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

// --- Ads Routes ---
app.get('/api/ads', async (req, res) => {
    try {
        const { page } = req.query;
        const filter = page ? { page } : {};
        const ads = await Ad.find(filter).sort({ createdAt: -1 });
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching ads' });
    }
});

app.post('/api/ads', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const ad = new Ad(req.body);
        await ad.save();
        res.status(201).json(ad);
    } catch (err) {
        res.status(500).json({ error: 'Server error creating ad' });
    }
});

app.put('/api/ads/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const ad = await Ad.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: 'Server error updating ad' });
    }
});

app.delete('/api/ads/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ad removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error deleting ad' });
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

app.post('/api/users', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role: role || 'user' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send('Server error creating user');
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
