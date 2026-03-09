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
        fetch('http://localhost:5000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);

        // Fetch existing business data by ID
        fetch(`http://localhost:5000/api/businesses/${id}`)
            .then(res => res.json())
            .then(business => {
                if (business) {
                    setFormData({
                        name: business.name || '',
                        category: business.category || '',
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
            const response = await fetchApi(`/api/businesses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
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
                {/* Progress Header */}
                <div className="mb-10">
                    <div className="flex items-end justify-between pb-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Edit Business</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Update {formData.name || 'Your Business'}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">65% Complete</span>
                        </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-primary/10">
                        <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                    </div>
                </div>

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

                        <form className="space-y-10" onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    <h3 className="text-xl font-bold">General Information</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Business Name *</label>
                                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="e.g. Golden Gate Coffee Roasters" type="text" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Category *</label>
                                        <select name="category" value={formData.category} onChange={handleChange} required className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white">
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Website</label>
                                        <input name="website" value={formData.website} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="https://www.example.com" type="url" />
                                    </div>
                                </div>
                            </section>

                            {/* Contact & Location */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <h3 className="text-xl font-bold">Contact & Location</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Street Address</label>
                                        <input name="address" value={formData.address} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="123 Business Way, Suite 100" type="text" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Phone Number</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="+1 (555) 000-0000" type="tel" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">City</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="San Francisco" type="text" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Pincode / ZIP Code</label>
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="e.g. 400001" type="text" />
                                    </div>
                                </div>
                            </section>

                            {/* Details */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    <h3 className="text-xl font-bold">Business Description</h3>
                                </div>
                                <div>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded-lg border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white" placeholder="Tell customers what makes your business special..." rows="5"></textarea>
                                </div>
                            </section>

                            {/* Media */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    <h3 className="text-xl font-bold">Photos & Media</h3>
                                </div>
                                <div className="flex w-full items-center justify-center">
                                    <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                            <span className="material-symbols-outlined mb-3 text-4xl text-primary">cloud_upload</span>
                                            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input className="hidden" type="file" />
                                    </label>
                                </div>
                            </section>

                            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button type="button" onClick={() => navigate('/directory')} className="rounded-lg border border-slate-300 dark:border-slate-700 px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={status.type === 'loading'} className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                    {status.type === 'loading' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="rounded-xl border border-primary/20 bg-white p-6 dark:bg-slate-800 shadow-sm">
                            <h4 className="mb-4 font-bold">Editing Tips</h4>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Make sure your contact information is up to date so customers can always reach you.</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Regularly updating your description helps with search rankings.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EditBusiness;
