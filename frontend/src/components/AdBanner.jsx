const AdBanner = ({ variant = 'horizontal' }) => {
    if (variant === 'sidebar') {
        return (
            <div className="rounded-xl overflow-hidden border border-amber-200 dark:border-amber-800 shadow-sm">
                <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Advertisement</span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
                        <span className="material-symbols-outlined text-white text-2xl">campaign</span>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-1 text-sm">Grow Your Business</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        Reach 10,000+ potential customers with a featured listing.
                    </p>
                    <a
                        href="#"
                        className="inline-block w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all hover:scale-[1.02] shadow-md shadow-orange-200 dark:shadow-none"
                    >
                        Advertise Here
                    </a>
                </div>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className="relative rounded-xl overflow-hidden">
                <div className="absolute top-2 left-3 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Sponsored
                    </span>
                </div>
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg">
                        <span className="material-symbols-outlined text-white text-3xl">storefront</span>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-white font-black text-lg leading-tight">List Your Business for Free</h4>
                        <p className="text-purple-200 text-sm mt-1">Join 50,000+ businesses already on Yellow Pages. Setup takes under 5 minutes.</p>
                    </div>
                    <a
                        href="/add-business"
                        className="shrink-0 bg-white hover:bg-slate-100 text-purple-700 font-black py-2.5 px-6 rounded-lg text-sm transition-all hover:scale-[1.02] shadow-xl whitespace-nowrap"
                    >
                        Add Your Business →
                    </a>
                </div>
            </div>
        );
    }

    // Default: horizontal full-width banner
    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            <div className="absolute top-3 left-4 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/30 px-2 py-0.5 rounded-full">
                    Advertisement
                </span>
            </div>
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-blue-500/10 pointer-events-none" />

                <div className="relative z-10 flex-1 text-center md:text-left">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">🚀 Special Offer</p>
                    <h3 className="text-white text-2xl md:text-3xl font-black leading-tight">
                        Boost Your Business Visibility
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-md">
                        Get your business featured at the top of search results and reach thousands of new customers every day.
                    </p>
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                    <a
                        href="/add-business"
                        className="bg-primary hover:bg-primary/90 text-slate-900 font-black px-8 py-3 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/25 whitespace-nowrap"
                    >
                        Get Featured Now
                    </a>
                    <a
                        href="#"
                        className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdBanner;
