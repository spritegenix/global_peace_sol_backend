import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdBanner from '../components/AdBanner';

const Home = () => {
    const { user } = useAuth();
    const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null); // null = not searched yet
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/businesses?featured=true')
            .then(res => res.json())
            .then(data => {
                setFeaturedBusinesses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching featured businesses:", err);
                setLoading(false);
            });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!locationQuery.trim() && !searchQuery.trim()) return;

        setSearchLoading(true);
        setHasSearched(true);

        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('name', searchQuery.trim());
            if (locationQuery.trim()) params.append('location', locationQuery.trim());

            const res = await fetch(`/api/businesses?${params.toString()}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error("Search error:", err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults(null);
        setHasSearched(false);
        setSearchQuery('');
        setLocationQuery('');
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden bg-slate-900 px-6 py-20">
                <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAY-3pR_aRtDoMULNa2xR-Q01S_0oIaTYbjxgv78JT_HD_SFyVpy22Zt7RmzuM_Gb8w7BjbpBBiduh90iseOvaWymnJSXFRqymU_p-Df9Cp1UkhkF08ivIvE8Seg5Vq8wutq441pkD-QNDmT9b_yX7SCdT09p0QfK-jhZCy5YbllczwPKq3l-M0dl_Onx2xdemlm7qTtsHpBBnAw6iJ9ld9dNZNFe54vIHQJEwwCzV-bZX2kVRnqItfGlEcnhzdRV_rFZu_mgkbecA')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
                <div className="relative z-10 w-full max-w-4xl text-center">
                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                        {user ? (
                            <>Welcome Back, <span className="text-primary italic">{user.name.split(' ')[0]}</span></>
                        ) : (
                            <>Find the Best <span className="text-primary">Local Services</span></>
                        )}
                    </h1>
                    <p className="mt-4 text-lg text-slate-300 sm:text-xl">
                        {user
                            ? "Good to see you again! Continue managing your listings or explore new services."
                            : "Discover top-rated businesses and services near you in seconds."
                        }
                    </p>

                    {user && (
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/directory" className="bg-primary text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                Explore Directory
                            </Link>
                            <Link to="/profile" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-white/20 transition-all">
                                Go to My Profile
                            </Link>
                        </div>
                    )}
                    <form onSubmit={handleSearch} className="mt-10 flex flex-col gap-4 rounded-xl bg-white p-2 shadow-2xl dark:bg-slate-800 md:flex-row">
                        {/* What field */}
                        <div className="flex flex-1 items-center gap-3 border-slate-200 px-4 py-2 dark:border-slate-700 md:border-r">
                            <span className="material-symbols-outlined text-primary">search</span>
                            <input
                                className="w-full border-none bg-transparent p-0 text-slate-900 placeholder-slate-500 focus:ring-0 dark:text-white"
                                placeholder="What are you looking for?"
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Location field — manual input */}
                        <div className="flex flex-1 items-center gap-3 border-slate-200 px-4 py-2 dark:border-slate-700 md:border-r">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <input
                                className="w-full border-none bg-transparent p-0 text-slate-900 placeholder-slate-500 focus:ring-0 dark:text-white"
                                placeholder="Enter city, area or address…"
                                type="text"
                                value={locationQuery}
                                onChange={e => setLocationQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex items-center justify-center h-14 rounded-lg bg-primary px-10 text-lg font-bold text-slate-900 transition-all hover:bg-primary/90 md:h-auto"
                        >
                            Search Now
                        </button>
                    </form>
                </div>
            </section>

            {/* ===== SEARCH RESULTS SECTION ===== */}
            {hasSearched && (
                <section className="mx-auto max-w-7xl px-6 py-16">
                    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                Search Results
                                {locationQuery && (
                                    <span className="ml-2 text-primary">near "{locationQuery}"</span>
                                )}
                            </h2>
                            {!searchLoading && searchResults !== null && (
                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    {searchResults.length > 0
                                        ? `${searchResults.length} business${searchResults.length !== 1 ? 'es' : ''} found`
                                        : 'No businesses found for your search'}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={clearSearch}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                            Clear Search
                        </button>
                    </div>

                    {/* Loading Spinner */}
                    {searchLoading && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
                            <p className="text-slate-500 dark:text-slate-400">Searching businesses…</p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!searchLoading && searchResults !== null && searchResults.length > 0 && (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {searchResults.map((biz) => (
                                <div key={biz._id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl dark:bg-slate-900">
                                    <div className="relative h-56 w-full">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${biz.image}')` }}></div>
                                        <div className="absolute right-4 top-4 flex h-8 items-center rounded-full bg-white px-3 text-xs font-bold text-slate-900 shadow-sm">
                                            <span className="material-symbols-outlined mr-1 text-sm text-primary">star</span>
                                            {biz.rating || 'New'}
                                        </div>
                                        {biz.isFeatured && (
                                            <div className="absolute left-4 top-4 flex h-7 items-center rounded-full bg-primary px-3 text-xs font-bold text-slate-900">
                                                ⭐ Featured
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{biz.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{biz.category}</p>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                            {biz.address}
                                        </div>
                                        {biz.status && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-semibold">
                                                <span className="material-symbols-outlined">check_circle</span>
                                                {biz.status}
                                            </div>
                                        )}
                                        <Link to={`/business/${biz._id}`} className="mt-6 flex items-center justify-center w-full rounded-lg border-2 border-primary bg-transparent py-3 text-sm font-bold text-slate-900 transition-all hover:bg-primary dark:text-white dark:hover:text-slate-900">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ===== NO RESULTS FOUND ===== */}
                    {!searchLoading && searchResults !== null && searchResults.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                            {/* Illustration */}
                            <div className="relative mb-8">
                                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600">location_off</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-900">
                                    <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Businesses Found</h3>

                            <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
                                We couldn't find any businesses
                                {locationQuery && <> in <span className="font-semibold text-slate-700 dark:text-slate-300">"{locationQuery}"</span></>}
                                {searchQuery && <> matching <span className="font-semibold text-slate-700 dark:text-slate-300">"{searchQuery}"</span></>}.
                                Try a different location or broaden your search.
                            </p>

                            {/* Suggestions */}
                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 w-full max-w-lg">
                                {[
                                    { icon: 'tune', text: 'Try a broader search term' },
                                    { icon: 'map', text: 'Check the spelling of your location' },
                                    { icon: 'add_business', text: 'List your business here' },
                                ].map((tip, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                        <span className="material-symbols-outlined text-2xl text-primary">{tip.icon}</span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{tip.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-primary/90"
                                >
                                    <span className="material-symbols-outlined text-sm">refresh</span>
                                    Try Again
                                </button>
                                <Link
                                    to="/directory"
                                    className="flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-primary dark:text-white dark:hover:text-slate-900"
                                >
                                    <span className="material-symbols-outlined text-sm">grid_view</span>
                                    Browse All Businesses
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Popular Categories (shown only when not in search mode) */}
            {!hasSearched && (
                <>
                    <section className="mx-auto max-w-7xl px-6 py-20">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Popular Categories</h2>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Quickly find what you need from our most searched categories.</p>
                            </div>
                            <Link className="hidden text-sm font-bold text-primary sm:block" to="/categories">View All Categories →</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                            {[
                                { icon: 'restaurant', name: 'Restaurants' },
                                { icon: 'local_hospital', name: 'Hospitals' },
                                { icon: 'hotel', name: 'Travel & Hotels' },
                                { icon: 'electric_bolt', name: 'Electricians' },
                                { icon: 'fitness_center', name: 'Gyms' },
                                { icon: 'content_cut', name: 'Salons' },
                                { icon: 'school', name: 'Education' },
                            ].map((cat, i) => (
                                <Link to={`/directory?category=${encodeURIComponent(cat.name)}`} key={i} className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                                    </div>
                                    <span className="text-sm font-bold">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Ad Banner */}
                    <section className="mx-auto max-w-7xl px-6 pb-6">
                        <AdBanner />
                    </section>

                    {/* Featured Businesses */}
                    <section className="bg-primary/5 py-20 dark:bg-primary/5">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mb-12">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Featured Businesses</h2>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">Hand-picked top quality services for you.</p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {featuredBusinesses.map((biz) => (
                                        <div key={biz.id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl dark:bg-slate-900">
                                            <div className="relative h-56 w-full">
                                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${biz.image}')` }}></div>
                                                <div className="absolute right-4 top-4 flex h-8 items-center rounded-full bg-white px-3 text-xs font-bold text-slate-900 shadow-sm">
                                                    <span className="material-symbols-outlined mr-1 text-sm text-primary">star</span>
                                                    {biz.rating}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold">{biz.name}</h3>
                                                <p className="mt-1 text-sm text-slate-500">{biz.category}</p>
                                                <div className="mt-4 flex items-center gap-2 text-sm">
                                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                                    {biz.address}
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-semibold">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                    {biz.status}
                                                </div>
                                                <Link to={`/business/${biz._id}`} className="mt-6 flex items-center justify-center w-full rounded-lg border-2 border-primary bg-transparent py-3 text-sm font-bold text-slate-900 transition-all hover:bg-primary dark:text-white dark:hover:text-slate-900">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="py-24">
                        <div className="mx-auto max-w-7xl px-6 text-center">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">How It Works</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">Finding and connecting with local experts has never been simpler.</p>
                            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                                {[
                                    { icon: 'search', step: 1, title: 'Search', desc: 'Tell us what you need or who you\'re looking for using our powerful search.' },
                                    { icon: 'compare_arrows', step: 2, title: 'Compare', desc: 'Read verified reviews, view photos, and compare prices of top-rated experts.' },
                                    { icon: 'call', step: 3, title: 'Connect', desc: 'Message or call the business directly to book your service instantly.' }
                                ].map((hw, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-slate-900">
                                            <span className="material-symbols-outlined text-4xl">{hw.icon}</span>
                                            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold">{hw.step}</div>
                                        </div>
                                        <h3 className="mt-6 text-xl font-bold">{hw.title}</h3>
                                        <p className="mt-3 text-slate-600 dark:text-slate-400">{hw.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default Home;
