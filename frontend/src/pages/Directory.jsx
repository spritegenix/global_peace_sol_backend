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
        fetch('http://localhost:5000/api/categories')
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

        const url = `http://localhost:5000/api/businesses${params.toString() ? '?' + params.toString() : ''}`;

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
            {/* Search Bar at Top */}
            <form onSubmit={handleSearch} className="mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                {/* Name Search */}
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                    <input
                        type="text"
                        placeholder="Search by business name..."
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                    />
                </div>
                {/* Pincode Filter */}
                <div className="relative sm:w-44">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">pin_drop</span>
                    <input
                        type="text"
                        placeholder="Pincode / ZIP"
                        value={pincodeInput}
                        onChange={e => setPincodeInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-slate-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-all hover:scale-[1.02] shrink-0"
                >
                    Search
                </button>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Clear
                    </button>
                )}
            </form>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-60 shrink-0 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Categories</h3>
                        <div className="space-y-1">
                            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    className="rounded-full border-slate-300 text-primary focus:ring-primary"
                                    checked={activeCategory === ''}
                                    onChange={() => setActiveCategory('')}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">All Categories</span>
                            </label>
                            {categories.map((cat) => (
                                <label key={cat._id || cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="rounded-full border-slate-300 text-primary focus:ring-primary"
                                        checked={activeCategory === cat.name}
                                        onChange={() => setActiveCategory(cat.name)}
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Minimum Rating</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1 text-primary">
                                {[1, 2, 3, 4].map(star => <span key={star} className="material-symbols-outlined fill-1">star</span>)}
                                <span className="material-symbols-outlined text-slate-300">star</span>
                                <span className="ml-2 text-xs text-slate-500">4.0 & up</span>
                            </div>
                            <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" max="5" min="1" type="range" defaultValue="4" />
                        </div>
                    </div>
                </aside>

                {/* Business Listings */}
                <section className="flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">
                            {loading ? 'Searching...' : `${businesses.length} Result${businesses.length !== 1 ? 's' : ''} found`}
                            {searchName && <span className="text-slate-500 font-normal text-base ml-2">for "<span className="text-primary">{searchName}</span>"</span>}
                            {activeCategory && <span className="text-slate-500 font-normal text-base ml-2">in <span className="text-primary">{activeCategory}</span></span>}
                            {searchPincode && <span className="text-slate-500 font-normal text-base ml-2">· PIN: <span className="text-primary">{searchPincode}</span></span>}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Sort by:</span>
                            <select className="text-sm border-none bg-transparent font-semibold focus:ring-0 cursor-pointer text-slate-900 dark:text-white">
                                <option>Most Relevant</option>
                                <option>Highest Rated</option>
                                <option>Newest</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : businesses.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No businesses found</h3>
                            <p className="text-slate-500 mt-2 mb-6">Try adjusting your search or filters to see more results.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            {businesses.map((biz, idx) => {
                                const isAuthorized = user && (user.id === biz.owner || user.role === 'admin');
                                return (
                                    <>
                                        <div key={biz._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                                            <div className="w-full sm:w-44 h-44 sm:h-auto bg-slate-100 dark:bg-slate-800 relative shrink-0">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{ backgroundImage: `url('${biz.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60'}')` }}
                                                />
                                            </div>
                                            <div className="flex-1 p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{biz.category}</p>
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{biz.name}</h3>
                                                        </div>
                                                        {biz.rating > 0 && (
                                                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0 ml-2">
                                                                <span className="material-symbols-outlined text-primary text-sm fill-1">star</span>
                                                                <span className="text-sm font-bold ml-1">{biz.rating}</span>
                                                                {biz.reviews > 0 && <span className="text-xs text-slate-500 ml-1">({biz.reviews})</span>}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 space-y-1">
                                                        {biz.address && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                                {biz.address}{biz.city ? `, ${biz.city}` : ''}{biz.pincode ? ` — ${biz.pincode}` : ''}
                                                            </div>
                                                        )}
                                                        {biz.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <span className="material-symbols-outlined text-sm">call</span>
                                                                {biz.phone}
                                                            </div>
                                                        )}
                                                        {biz.website && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <span className="material-symbols-outlined text-sm">public</span>
                                                                <a href={biz.website} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                                                                    {biz.website.replace(/^https?:\/\//, '')}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex gap-2">
                                                        {isAuthorized && (
                                                            <>
                                                                <Link to={`/edit-business/${biz._id}`} className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-sm">edit</span>Edit
                                                                </Link>
                                                                <button onClick={() => handleDelete(biz._id)} className="text-sm text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-sm">delete</span>Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                            {biz.status || 'Active'}
                                                        </span>
                                                        <Link
                                                            to={`/business/${biz._id}`}
                                                            className="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors text-sm"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ad banner after every 3 businesses */}
                                        {(idx + 1) % 3 === 0 && idx + 1 < businesses.length && (
                                            <div key={`ad-${idx}`} className="my-2">
                                                <AdBanner variant="inline" />
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </>
                    )}

                    {/* Pagination */}
                    {businesses.length > 0 && (
                        <nav className="flex items-center justify-center pt-8 gap-1">
                            <button className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 rounded bg-primary text-slate-900 font-bold">1</button>
                            <button className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800">
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
