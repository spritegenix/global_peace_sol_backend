import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/categories')
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
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <section className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-2">Browse Categories</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Connecting you with the best local businesses in your neighborhood.</p>
            </section>

            {/* Category Filters */}
            <section className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {['All Categories', 'Most Popular', 'Home Services', 'Health & Beauty', 'Dining', 'Automotive'].map((filter, i) => (
                    <button key={i} className={`px-5 py-2 font-semibold rounded-full text-sm whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-slate-900 font-bold' : 'bg-slate-100 dark:bg-slate-800 hover:bg-primary/20'}`}>
                        {filter}
                    </button>
                ))}
            </section>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                </div>
            ) : (
                <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link key={cat.id} to="/directory" className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all shadow-sm hover:shadow-md text-center">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-primary group-hover:text-slate-900 text-3xl">{cat.icon}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{cat.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                        </Link>
                    ))}
                </section>
            )}

            {/* Ad Banner */}
            <section className="mt-12">
                <AdBanner />
            </section>

            {/* Promotion Section */}
            <section className="mt-16 bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 max-w-lg">
                    <span className="inline-block px-3 py-1 bg-primary text-slate-900 text-xs font-bold rounded-full mb-4">FOR BUSINESS OWNERS</span>
                    <h3 className="text-3xl font-black text-white mb-4">List your business for free today!</h3>
                    <p className="text-slate-400 mb-6">Reach thousands of potential customers in your area and grow your local visibility.</p>
                    <Link to="/add-business" className="inline-block bg-primary text-slate-900 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">Get Started Now</Link>
                </div>
                <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-primary/20 rounded-2xl flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-primary text-9xl">storefront</span>
                    {/* Abstract decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full"></div>
                </div>
            </section>
        </div>
    );
};

export default Categories;
