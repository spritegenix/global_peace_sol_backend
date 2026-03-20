import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/directory');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email: formData.email, password: formData.password } : formData;

        try {
            const res = await fetchApi(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (res.ok) {
                login(data.user, data.token);
                navigate(data.user.role === 'admin' ? '/admin' : '/directory');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server error, please try again.');
        }
    };
    return (
        <div className="flex-grow flex items-center justify-center p-6 relative py-20">
            {/* Minimalist Background Accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-[10%] -left-[5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-primary/10 overflow-hidden z-10">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 text-center text-sm font-bold ${isLogin ? 'border-b-2 border-primary bg-primary/5 text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'}`}>
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 text-center text-sm font-bold ${!isLogin ? 'border-b-2 border-primary bg-primary/5 text-slate-900 dark:text-slate-100' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'}`}>
                        Sign Up
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{isLogin ? 'Welcome back' : 'Create an Account'}</h2>
                        <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Access your personal directory and saved listings' : 'Join our community and list your business'}</p>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-bold tracking-widest text-[10px]">Or continue with</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                    <input name="name" value={formData.name} onChange={handleChange} required={!isLogin} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="John Doe" type="text" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                <input name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="name@company.com" type="email" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                {isLogin && <Link to="#" className="text-sm font-medium text-primary hover:underline">Forgot?</Link>}
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                <input name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="••••••••" type="password" />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center gap-2 py-1">
                                <input id="remember" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800 cursor-pointer" />
                                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">Keep me logged in</label>
                            </div>
                        )}

                        <button type="submit" className="block w-full text-center bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 mt-8">
                        By continuing, you agree to our{' '}
                        <Link to="#" className="underline hover:text-primary transition-colors">Terms of Service</Link>{' '}
                        and{' '}
                        <Link to="#" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
