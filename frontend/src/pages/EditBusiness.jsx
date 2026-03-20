import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../utils/api';

const EditBusiness = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        website: '',
        address: '',
        phone: '',
        city: '',
        pincode: '',
        description: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);

        // Fetch existing business data by ID
        fetch(`/api/businesses/${id}`)
            .then(res => res.json())
            .then(business => {
                if (business) {
                    setFormData({
                        name: business.name || '',
                        category: business.category || '',
                        customCategory: business.category || '',
                        website: business.website || '',
                        address: business.address || '',
                        phone: business.phone || '',
                        city: business.city || '',
                        pincode: business.pincode || '',
                        description: business.description || ''
                    });
                }
            })
            .catch(console.error);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Saving your business...' });

        try {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.category === 'Other' && formData.customCategory) {
                dataToSubmit.category = formData.customCategory;
            }
            delete dataToSubmit.customCategory;

            const response = await fetchApi(`/api/businesses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(dataToSubmit)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Failed to save business');
            }

            setStatus({ type: 'success', message: 'Business successfully listed! Redirecting to directory...' });

            // Redirect to directory after 2 seconds
            setTimeout(() => {
                navigate('/directory');
            }, 2000);

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to save business. Please try again.' });
        }
    };

    return (
        <div className="flex-grow">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-2">

                        {status.message && (
                            <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-100 text-green-800' : status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-primary/20 text-slate-800'}`}>
                                <span className="material-symbols-outlined">
                                    {status.type === 'success' ? 'check_circle' : status.type === 'error' ? 'error' : 'hourglass_empty'}
                                </span>
                                <p className="font-bold">{status.message}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Basic Info */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">store</span>
                                    <h3 className="text-xl font-bold">The Basics</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Business Name <span className="text-red-500">*</span></label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Category <span className="text-red-500">*</span></label>
                                        <div className="space-y-3">
                                            <select
                                                name="category"
                                                value={['Real Estate', 'Professional Services', 'Pets & Animals', 'Travel & Hotels', 'Events & Wedding'].includes(formData.category) || categories.find(c => c.name === formData.category) || formData.category === '' ? formData.category : 'Other'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'Other') {
                                                        setFormData(prev => ({ ...prev, category: 'Other', customCategory: '' }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, category: val, customCategory: '' }));
                                                    }
                                                }}
                                                required
                                                className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Real Estate">Real Estate</option>
                                                <option value="Professional Services">Professional Services</option>
                                                <option value="Pets & Animals">Pets & Animals</option>
                                                <option value="Travel & Hotels">Travel & Hotels</option>
                                                <option value="Events & Wedding">Events & Wedding</option>
                                                {categories.filter(cat => ![
                                                    'Real Estate',
                                                    'Professional Services',
                                                    'Pets & Animals',
                                                    'Travel & Hotels',
                                                    'Events & Wedding'
                                                ].includes(cat.name)).map(cat => (
                                                    <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                                <option value="Other">Other (Type your own)</option>
                                            </select>

                                            {formData.category === 'Other' && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <label className="mb-2 block text-xs font-bold text-primary uppercase">Specify Your Category</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Handmade Jewelry"
                                                        value={formData.customCategory || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                                                        className="w-full rounded-lg border border-primary bg-primary/5 p-4 text-slate-900 focus:ring-2 focus:ring-primary dark:text-white"
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Website</label>
                                        <input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            placeholder="https://www.example.com"
                                            type="url"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Contact */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <h3 className="text-xl font-bold">Contact & Location</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Street Address</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            type="tel"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">City</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Pincode / ZIP Code</label>
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="e.g. 400001" type="text" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    <h3 className="text-xl font-bold">Description</h3>
                                </div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                    rows="5"
                                />
                            </section>

                            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-8 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={status.type === 'loading'}
                                    className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-3 text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {status.type === 'loading' ? 'Saving...' : 'Update Listing'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                            <h4 className="text-xl font-black mb-4">Editing Tip</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Ensure your contact details are up to date! Consistent information across the web improves your SEO ranking.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EditBusiness;
