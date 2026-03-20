import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import AdBanner from '../components/AdBanner';

const Directory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
    const [searchName, setSearchName] = useState(searchParams.get('name') || '');
    const [searchPincode, setSearchPincode] = useState(searchParams.get('pincode') || '');
    const [nameInput, setNameInput] = useState(searchParams.get('name') || '');
    const [pincodeInput, setPincodeInput] = useState(searchParams.get('pincode') || '');

    const [categories, setCategories] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);
    }, []);

    // Fetch businesses whenever filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (searchName) params.set('name', searchName);
        if (searchPincode) params.set('pincode', searchPincode);

        const url = `/api/businesses${params.toString() ? '?' + params.toString() : ''}`;

        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setBusinesses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching businesses:', err);
                setLoading(false);
            });
    }, [activeCategory, searchName, searchPincode]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchName(nameInput);
        setSearchPincode(pincodeInput);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this business?')) return;
        try {
            const res = await fetchApi(`/api/businesses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBusinesses(businesses.filter(b => b._id !== id));
            } else {
                alert('Failed to delete business');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting business');
        }
    };

    const clearFilters = () => {
        setActiveCategory('');
        setSearchName('');
        setSearchPincode('');
        setNameInput('');
        setPincodeInput('');
    };

    const hasActiveFilters = activeCategory || searchName || searchPincode;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Bar at Top with Create Option */}
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-10">
                <form onSubmit={handleSearch} className="flex-1 w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-3 flex flex-col sm:flex-row gap-2">
                    {/* Name Search */}
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">search</span>
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 border-none bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                    {/* Pincode Filter */}
                    <div className="relative sm:w-48">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">distance</span>
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={pincodeInput}
                            onChange={e => setPincodeInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 border-none bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-600 text-slate-900 font-black px-8 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 shrink-0"
                    >
                        Search Now
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black px-5 py-3.5 rounded-2xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm font-black">restart_alt</span>
                            Reset
                        </button>
                    )}
                </form>

                <Link to="/add-business" className="w-full lg:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-8 py-4 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl group">
                    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">add_circle</span>
                    Add Your Business
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">filter_list</span>
                            Categories
                        </h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/5 cursor-pointer group transition-colors">
                                <input
                                    type="radio"
                                    name="category"
                                    className="w-4 h-4 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                                    checked={activeCategory === ''}
                                    onChange={() => setActiveCategory('')}
                                />
                                <span className={`text-sm font-bold transition-colors ${activeCategory === '' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>All Listings</span>
                            </label>
                            {categories.map((cat) => (
                                <label key={cat._id || cat.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/5 cursor-pointer group transition-colors">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="w-4 h-4 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0"
                                        checked={activeCategory === cat.name}
                                        onChange={() => setActiveCategory(cat.name)}
                                    />
                                    <span className={`text-sm font-bold transition-colors ${activeCategory === cat.name ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stats or Info Card */}
                    <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[2rem] text-white overflow-hidden relative group">
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors"></div>
                        <h4 className="text-xl font-black mb-4 relative z-10">Trusted Results</h4>
                        <p className="text-sm text-slate-400 leading-relaxed relative z-10">We verify every business to ensure you get the best quality service in your area.</p>
                        <div className="mt-6 flex items-center gap-4 relative z-10">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>)}
                            </div>
                            <span className="text-xs font-bold text-primary">100k+ Users</span>
                        </div>
                    </div>
                </aside>

                {/* Business Listings */}
                <section className="flex-1 space-y-6">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            {loading ? (
                                <span className="flex items-center gap-3 italic text-slate-400">
                                    Finding results...
                                </span>
                            ) : (
                                <>
                                    <span className="text-primary italic">{businesses.length}</span> Results Found
                                </>
                            )}
                        </h2>
                        {!loading && hasActiveFilters && (
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Filters:</span>
                                {activeCategory && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">{activeCategory}</span>}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Curating the best for you</p>
                        </div>
                    ) : businesses.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No matching businesses</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">We couldn't find exactly what you're looking for. Try a different category or search term.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-primary hover:bg-primary-600 text-slate-900 font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {businesses.map((biz, idx) => {
                                const isAuthorized = user && (user.id === biz.owner || user.role === 'admin');
                                return (
                                    <div key={biz._id || idx}>
                                        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row relative">
                                            {/* Featured Badge */}
                                            {biz.isFeatured && (
                                                <div className="absolute top-4 left-4 z-10 bg-primary text-slate-900 text-[10px] font-black px-3 py-1 rounded-full shadow-xl flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">workspace_premium</span>
                                                    FEATURED
                                                </div>
                                            )}

                                            <div className="w-full sm:w-64 h-56 sm:h-auto bg-slate-100 dark:bg-slate-800 relative shrink-0 overflow-hidden">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                    style={{ backgroundImage: `url('${biz.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60'}')` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            </div>

                                            <div className="flex-1 p-8 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{biz.category}</span>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{biz.city || 'Local'}</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{biz.name}</h3>
                                                        </div>
                                                        {biz.rating > 0 && (
                                                            <div className="flex items-center bg-primary text-slate-900 px-3 py-1.5 rounded-2xl shadow-lg shadow-primary/20 shrink-0 ml-4 scale-110">
                                                                <span className="material-symbols-outlined text-sm font-black fill-1">star</span>
                                                                <span className="text-sm font-black ml-1">{biz.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 leading-relaxed font-medium">
                                                        {biz.description || "Connecting you with quality services and local expertise in your community. Visit us to experience the best we have to offer."}
                                                    </p>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {biz.address && (
                                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent hover:border-primary/20 transition-colors">
                                                                <span className="material-symbols-outlined text-primary">location_on</span>
                                                                <span className="truncate font-medium">{biz.address}</span>
                                                            </div>
                                                        )}
                                                        {biz.phone && (
                                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-transparent hover:border-primary/20 transition-colors">
                                                                <span className="material-symbols-outlined text-primary">call</span>
                                                                <span className="font-bold">{biz.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                                                    <div className="flex gap-6">
                                                        {isAuthorized && (
                                                            <>
                                                                <Link to={`/edit-business/${biz._id}`} className="text-xs text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest flex items-center gap-2 transition-colors group/edit">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/edit:bg-blue-50 dark:group-hover/edit:bg-blue-900/20">
                                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                                    </div>
                                                                    Edit
                                                                </Link>
                                                                <button onClick={() => handleDelete(biz._id)} className="text-xs text-slate-400 hover:text-red-600 font-black uppercase tracking-widest flex items-center gap-2 transition-colors group/del">
                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/del:bg-red-50 dark:group-hover/del:bg-red-900/20">
                                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                                    </div>
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {biz.website && (
                                                            <a href={biz.website} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-slate-900 transition-all shadow-lg shadow-primary/5">
                                                                <span className="material-symbols-outlined">public</span>
                                                            </a>
                                                        )}
                                                        <Link
                                                            to={`/business/${biz._id}`}
                                                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 px-10 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-slate-900/20 text-sm"
                                                        >
                                                            View Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic "Add your business" CTA in the middle of listings */}
                                        {idx === 1 && businesses.length > 2 && (
                                            <div className="my-8 bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-dashed border-primary/20 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center gap-6 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform"></div>
                                                <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-transform">
                                                    <span className="material-symbols-outlined text-slate-900 text-4xl font-black">add_business</span>
                                                </div>
                                                <div className="relative z-10">
                                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Grow your local reach?</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">Join hundreds of successful businesses on our platform and reach your neighborhood customers instantly.</p>
                                                </div>
                                                <Link to="/add-business" className="relative z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 px-10 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl">
                                                    Get Your Business Listed
                                                </Link>
                                            </div>
                                        )}

                                        {/* Ad banner after every 3 businesses */}
                                        {(idx + 1) % 3 === 0 && idx + 1 < businesses.length && (
                                            <div key={`ad-${idx}`} className="my-8">
                                                <AdBanner page="Directory" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {businesses.length > 0 && (
                        <nav className="flex items-center justify-center pt-12 gap-2">
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-slate-900 transition-all font-black">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-primary text-slate-900 font-black shadow-lg shadow-primary/20">1</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-slate-900 transition-all font-black">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </nav>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Directory;
