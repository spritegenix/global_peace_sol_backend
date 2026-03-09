const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Category = require('./models/Category');
const Business = require('./models/Business');
const { categories, businesses } = require('./data');

dotenv.config();

const seedDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        let mongoServer;

        if (!uri) {
            console.log('Starting local memory server for seeding...');
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        await mongoose.connect(uri);
        console.log(`Connected to MongoDB for seeding at ${uri}`);

        await Category.deleteMany({});
        await Business.deleteMany({});
        console.log('Cleared existing data.');

        const cleanCategories = categories.map(({ id, ...rest }) => rest);
        const cleanBusinesses = businesses.map(({ id, ...rest }) => rest);

        await Category.insertMany(cleanCategories);
        await Business.insertMany(cleanBusinesses);

        console.log('Database seeded successfully!');

        if (mongoServer) {
            console.log('Seed memory server will spin down. Use the main server to access the data.');
            process.exit(0);
        } else {
            process.exit(0);
        }
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
