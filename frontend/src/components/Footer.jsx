import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900 mt-auto">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-slate-900">
                                <span className="material-symbols-outlined text-xl">search_insights</span>
                            </div>
                            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">YellowPages</h2>
                        </Link>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Connecting communities with local experts since 1995. The most trusted business directory.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">For Users</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link className="hover:text-primary" to="/categories">Search Categories</Link></li>
                            <li><Link className="hover:text-primary" to="#">Download App</Link></li>
                            <li><Link className="hover:text-primary" to="#">User Reviews</Link></li>
                            <li><Link className="hover:text-primary" to="#">Help Center</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">For Businesses</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link className="hover:text-primary" to="/add-business">Add Listing</Link></li>
                            <li><Link className="hover:text-primary" to="#">Advertise with Us</Link></li>
                            <li><Link className="hover:text-primary" to="#">Success Stories</Link></li>
                            <li><Link className="hover:text-primary" to="#">Merchant Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Connect</h3>
                        <div className="mt-4 flex gap-4">
                            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-primary hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400" href="#">
                                <span className="material-symbols-outlined">social_leaderboard</span>
                            </a>
                            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-primary hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400" href="#">
                                <span className="material-symbols-outlined">share_reviews</span>
                            </a>
                            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-primary hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400" href="#">
                                <span className="material-symbols-outlined">alternate_email</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-slate-500">© 2026 YellowPages Directory Services. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-slate-500">
                            <Link className="hover:text-primary" to="#">Privacy Policy</Link>
                            <Link className="hover:text-primary" to="#">Terms of Service</Link>
                            <Link className="hover:text-primary" to="#">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
