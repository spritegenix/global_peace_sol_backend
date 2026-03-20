const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        enum: ['Home', 'Categories', 'Directory', 'BusinessDetails']
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    media: { type: String, default: '' }, // image or video URL
    redirectLink: { type: String, default: '#' }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
