const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    website: { type: String },
    address: { type: String },
    phone: { type: String },
    city: { type: String },
    pincode: { type: String },
    description: { type: String },
    image: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    status: { type: String, default: 'Newly Added' },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
