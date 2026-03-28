// ✅ Updated Categories (Mental Health Based)
const categories = [
    { id: 1, icon: 'psychology', name: 'Mental Health & Therapy', count: '1,420 businesses' },
    { id: 2, icon: 'family_restroom', name: 'Relationship & Family Support', count: '840 businesses' },
    { id: 3, icon: 'self_improvement', name: 'Mindfulness & Inner Growth', count: '620 businesses' },
    { id: 4, icon: 'work', name: 'Career & Life Stress Support', count: '510 businesses' },
    { id: 5, icon: 'groups', name: 'NGO & Social Support Services', count: '300 businesses' },
    { id: 6, icon: 'handshake', name: 'Conflict Resolution & Mediation', count: '210 businesses' },
    { id: 7, icon: 'security', name: 'Cyber Safety & Crisis Help', count: '150 businesses' }
];

// ✅ Businesses Data (Fixed category names)
let businesses = [
    {
        id: 1,
        name: 'Elite Flow Plumbing Solutions',
        category: 'Career & Life Stress Support',
        rating: 4.9,
        reviews: 128,
        address: '123 Industrial Way, Springfield, IL',
        phone: '(555) 123-4567',
        status: 'Open until 8:00 PM',
        isVerified: true,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
    },
    {
        id: 2,
        name: 'MindCare Therapy Center',
        category: 'Mental Health & Therapy',
        rating: 4.7,
        reviews: 342,
        address: '892 Wellness Blvd',
        phone: '(555) 987-6543',
        status: 'Open Now',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1588776814546-ec7e7c3d55b2'
    },
    {
        id: 3,
        name: 'Family Support Hub',
        category: 'Relationship & Family Support',
        rating: 4.5,
        reviews: 89,
        address: '44 Harmony Street',
        phone: '(555) 444-2222',
        status: '15+ years experience',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb'
    },
    {
        id: 4,
        name: 'Peace Mind Meditation Center',
        category: 'Mindfulness & Inner Growth',
        rating: 4.9,
        reviews: 1200,
        address: '245 Calm Street',
        phone: '(555) 111-2345',
        status: 'Open until 9 PM',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
    },
    {
        id: 5,
        name: 'Career Balance Coaching',
        category: 'Career & Life Stress Support',
        rating: 4.7,
        reviews: 850,
        address: '89 Success Road',
        phone: '(555) 222-3456',
        status: 'Online Sessions Available',
        isVerified: true,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978'
    },
    {
        id: 6,
        name: 'SafeNet Cyber Help',
        category: 'Cyber Safety & Crisis Help',
        rating: 5.0,
        reviews: 520,
        address: '52 Security Lane',
        phone: '(555) 333-4567',
        status: '24/7 Support',
        isVerified: true,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87'
    }
];

// ✅ Add Business Function
const addBusiness = (business) => {
    const newBusiness = {
        ...business,
        id: businesses.length > 0 ? Math.max(...businesses.map(b => b.id)) + 1 : 1,
        rating: 0,
        reviews: 0,
        status: 'Newly Added',
        isVerified: false,
        isFeatured: false,
        image: business.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c'
    };

    businesses.push(newBusiness);
    return newBusiness;
};

// ✅ Export
module.exports = {
    categories,
    businesses,
    addBusiness
};