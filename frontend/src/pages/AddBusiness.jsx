import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';

// Fields that count towards progress
const PROGRESS_FIELDS = ['name', 'category', 'address', 'phone', 'city', 'pincode', 'description', 'website'];
const REQUIRED_FIELDS = ['name', 'category']; // only these are truly required

const AddBusiness = () => {
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
        fetch('http://localhost:5000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Dynamic progress: count how many of the tracked fields are filled
    const progressPercent = useMemo(() => {
        const filled = PROGRESS_FIELDS.filter(f => formData[f]?.trim()).length;
        return Math.round((filled / PROGRESS_FIELDS.length) * 100);
    }, [formData]);

    const completionLabel = progressPercent < 30
        ? 'Just getting started...'
        : progressPercent < 60
            ? 'Looking good, keep going!'
            : progressPercent < 90
                ? 'Almost there!'
                : 'Profile complete! 🎉';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Saving your business...' });

        try {
            const response = await fetchApi('/api/businesses', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Failed to save business');
            }

            setStatus({ type: 'success', message: 'Business successfully listed! Redirecting to directory...' });
            setTimeout(() => navigate('/directory'), 2000);
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to save business. Please try again.' });
        }
    };

    return (
        <div className="flex-grow">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Dynamic Progress Header */}
                <div className="mb-10">
                    <div className="flex items-end justify-between pb-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">List Your Business</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Add Your Business</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-primary">{progressPercent}%</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{completionLabel}</p>
                        </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-primary/10">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    {/* Field completion badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {PROGRESS_FIELDS.map(f => {
                            const filled = !!formData[f]?.trim();
                            const isRequired = REQUIRED_FIELDS.includes(f);
                            const label = f.charAt(0).toUpperCase() + f.slice(1);
                            return (
                                <span
                                    key={f}
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all duration-300 ${filled
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : isRequired
                                                ? 'bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-400'
                                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[10px]">
                                        {filled ? 'check_circle' : 'radio_button_unchecked'}
                                    </span>
                                    {label}
                                    {isRequired && !filled && <span className="text-red-400">*</span>}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-2">

                        {status.message && (
                            <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-100 text-green-800' :
                                    status.type === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-primary/20 text-slate-800'
                                }`}>
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
                                        <label className="mb-2 block text-sm font-semibold">
                                            Business Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            placeholder="e.g. Golden Gate Coffee Roasters"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">
                                            Website
                                            <span className="ml-2 text-xs font-normal text-slate-400">(Optional – enter only if you have a website)</span>
                                        </label>
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

                            {/* Contact & Location */}
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
                                            placeholder="123 Business Way, Suite 100"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            placeholder="+1 (555) 000-0000"
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
                                            placeholder="San Francisco"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Pincode / ZIP Code</label>
                                        <input
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                            placeholder="e.g. 400001"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Business Description */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    <h3 className="text-xl font-bold">Business Description</h3>
                                </div>
                                <div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-primary/20 bg-white p-4 text-slate-900 focus:border-primary focus:ring-primary dark:bg-slate-800 dark:text-white"
                                        placeholder="Tell customers what makes your business special..."
                                        rows="5"
                                    />
                                </div>
                            </section>

                            {/* Media */}
                            <section>
                                <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    <h3 className="text-xl font-bold">Photos & Media</h3>
                                </div>
                                <div className="flex w-full items-center justify-center">
                                    <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
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
                                <button
                                    type="button"
                                    onClick={() => navigate('/directory')}
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={status.type === 'loading'}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                                >
                                    {status.type === 'loading' ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Save & List Business
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Boost Card */}
                        <div className="rounded-xl bg-primary p-6 text-slate-900 shadow-xl shadow-primary/10">
                            <span className="material-symbols-outlined mb-4 text-3xl">rocket_launch</span>
                            <h4 className="mb-2 text-xl font-black">Boost Your Visibility</h4>
                            <p className="mb-4 text-sm font-medium leading-relaxed opacity-80">
                                Businesses with complete profiles receive up to 5x more clicks and engagement from potential customers.
                            </p>
                            <ul className="space-y-3">
                                {['Professional Trust Badge', 'Priority Search Ranking', 'Direct Customer Messaging'].map((perk, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-bold">
                                        <span className="material-symbols-outlined text-base">check_circle</span>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Live Progress Summary */}
                        <div className="rounded-xl border border-primary/20 bg-white p-6 dark:bg-slate-800 shadow-sm">
                            <h4 className="mb-1 font-bold text-slate-900 dark:text-white">Profile Strength</h4>
                            <p className="text-xs text-slate-500 mb-4">Fill in more details to reach 100%</p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 shrink-0">
                                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-700" />
                                        <circle
                                            cx="18" cy="18" r="15.9155" fill="none"
                                            stroke="currentColor" strokeWidth="3"
                                            strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                                            strokeLinecap="round"
                                            className="text-primary transition-all duration-500"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-primary">{progressPercent}%</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{completionLabel}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {PROGRESS_FIELDS.filter(f => formData[f]?.trim()).length} of {PROGRESS_FIELDS.length} fields filled
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {PROGRESS_FIELDS.map(f => {
                                    const filled = !!formData[f]?.trim();
                                    return (
                                        <div key={f} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400 capitalize">{f}</span>
                                            <span className={`material-symbols-outlined text-base ${filled ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`}>
                                                {filled ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="rounded-xl bg-slate-900 p-6 text-white dark:bg-slate-800 shadow-sm border border-slate-800 dark:border-slate-700">
                            <p className="text-sm italic text-slate-300">"Joining YellowPages helped our bakery grow its customer base by 40% in just three months. Highly recommended!"</p>
                            <p className="mt-4 text-xs font-bold uppercase text-primary">— Sarah J., Flourish Bakery</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default AddBusiness;
