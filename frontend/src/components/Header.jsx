import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-slate-900">
                        <span className="material-symbols-outlined text-2xl font-bold">search_insights</span>
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">YellowPages</h2>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/">Home</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/categories">Categories</Link>
                    <Link className="text-sm font-semibold hover:text-primary transition-colors" to="/directory">Directory</Link>
                </nav>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/add-business" className="hidden sm:block text-sm font-semibold hover:text-primary">
                                List a Business
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold text-rose-500 hover:text-rose-600">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
