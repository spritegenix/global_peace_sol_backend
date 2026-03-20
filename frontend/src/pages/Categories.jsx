import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <section className="mb-16 text-center max-w-3xl mx-auto">
                <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-xs font-black rounded-full mb-6 uppercase tracking-[0.2em]">Explore the Network</span>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight">Browse by <span className="text-primary italic">Category</span></h2>
                <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed">Discover top-rated local professionals, shops, and services tailored to your specific needs.</p>
            </section>

            {/* All Categories Grid */}
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">All Categories</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Browse our complete list of categories.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
                </div>
            ) : (
                <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={cat._id || cat.id}
                            to={`/directory?category=${encodeURIComponent(cat.name)}`}
                            className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 text-center flex flex-col items-center overflow-hidden"
                        >
                            {/* Decorative background shape */}
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-[3] transition-transform duration-700"></div>

                            <div className="relative z-10 w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                <span className="material-symbols-outlined text-primary group-hover:text-slate-900 text-4xl transition-colors">{cat.icon || 'category'}</span>
                            </div>
                            <h3 className="relative z-10 font-black text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{cat.name}</h3>
                            <div className="relative z-10 mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{cat.count || '0'} Listings</p>
                            </div>
                        </Link>
                    ))}
                </section>
            )}

            {/* Ad Banner */}
            <section className="mt-20">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                    <AdBanner page="Categories" />
                </div>
            </section>

            {/* Promotion Section */}
            <section className="mt-24 bg-slate-900 dark:bg-slate-800 rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4"></div>
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 text-[10px] font-black rounded-full mb-8">
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        FOR AMBITIOUS BUSINESS OWNERS
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Grow your business with <span className="text-primary italic">YellowPages</span></h3>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">Become part of our premium directory network. Reach thousands of potential customers in your area and skyrocket your local visibility today.</p>
                    <Link to="/add-business" className="inline-flex items-center gap-3 bg-primary text-slate-900 font-black px-10 py-5 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                        Get Started For Free
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>
                <div className="w-full md:w-[400px] aspect-square bg-gradient-to-br from-primary to-primary-600 rounded-[3rem] flex items-center justify-center relative shadow-2xl group-hover:rotate-3 transition-transform duration-700">
                    <span className="material-symbols-outlined text-slate-900 text-[10rem] animate-pulse">storefront</span>
                    {/* Abstract decorative elements */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 border-8 border-white/10 rounded-full"></div>
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </section>
        </div>
    );
};

export default Categories;
