import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchApi('/api/businesses')
            .then(res => res.json())
            .then(data => setBusinesses(data))
            .catch(console.error);

        fetchApi('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(console.error);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteBusiness = async (id) => {
        if (!confirm('Are you sure you want to delete this business?')) return;
        try {
            const res = await fetchApi(`/api/businesses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBusinesses(businesses.filter(b => b._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetchApi(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-slate-100 font-display">

            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 flex-shrink-0 flex flex-col hidden md:flex text-slate-300">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-slate-900">
                            <span className="material-symbols-outlined">search_insights</span>
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-white">YP Admin</h2>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Main Menu</p>
                    <button onClick={() => setActiveTab('dashboard')} className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-bold ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-800 hover:text-white transition-colors'}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab('businesses')} className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-bold ${activeTab === 'businesses' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-800 hover:text-white transition-colors'}`}>
                        <span className="material-symbols-outlined">apartment</span>
                        Businesses
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-800 hover:text-white transition-colors'}`}>
                        <span className="material-symbols-outlined">group</span>
                        Users
                    </button>

                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mt-8 mb-2">Monitoring</p>
                    <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined">rate_review</span>
                            Reviews
                        </div>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
                    </a>
                    <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined">verified_user</span>
                            Approvals
                        </div>
                        <span className="bg-primary text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">5</span>
                    </a>

                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mt-8 mb-2">Settings</p>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        Platform Settings
                    </a>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500">{user?.email || 'admin@admin.com'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-400 py-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-500">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="text-xl font-bold">Dashboard Summary</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input type="text" placeholder="Search anything..." className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary w-64" />
                        </div>
                        <button className="relative text-slate-500 hover:text-slate-900 dark:hover:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Businesses', value: businesses.length, inc: 'All listed', icon: 'storefront', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Total Users', value: users.length, inc: 'Registered across platform', icon: 'group', color: 'text-green-500', bg: 'bg-green-500/10' },
                            { label: 'Categories', value: '12', inc: 'Active categories', icon: 'category', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                            { label: 'System Health', value: '100%', inc: 'All systems operational', icon: 'health_and_safety', color: 'text-primary', bg: 'bg-primary/10' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
                                    <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-400 mt-1">{stat.inc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Dynamic Content Tab */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">

                            {activeTab === 'dashboard' || activeTab === 'businesses' ? (
                                <>
                                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <h2 className="text-lg font-bold">All Businesses</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Business Name</th>
                                                    <th className="px-6 py-4 font-semibold">Category</th>
                                                    <th className="px-6 py-4 font-semibold">City</th>
                                                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {businesses.map((business, i) => (
                                                    <tr key={business._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{business.name}</td>
                                                        <td className="px-6 py-4 text-slate-500">{business.category}</td>
                                                        <td className="px-6 py-4 text-slate-500">{business.city || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-right space-x-2">
                                                            <Link to={`/edit-business/${business._id}`} className="text-blue-500 hover:text-blue-700">Edit</Link>
                                                            <button onClick={() => handleDeleteBusiness(business._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : null}

                            {activeTab === 'users' ? (
                                <>
                                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <h2 className="text-lg font-bold">Platform Users</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Name</th>
                                                    <th className="px-6 py-4 font-semibold">Email</th>
                                                    <th className="px-6 py-4 font-semibold">Role</th>
                                                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {users.map((u, i) => (
                                                    <tr key={u._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                                                        <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                                        <td className="px-6 py-4 text-slate-500">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${u.role === 'admin' ? 'bg-primary/20 text-slate-900 dark:text-primary' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {user.id !== u._id && (
                                                                <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Platform Notifications/Activity */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-bold">Recent Activity</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {[
                                    { icon: 'star', color: 'text-primary bg-primary/20', text: 'New 5-star review left for "Golden Gate Coffee Roasters"', time: '10 min ago' },
                                    { icon: 'report', color: 'text-red-500 bg-red-500/20', text: 'User reported listing "Cheap Auto Fix" for false information.', time: '1 hour ago' },
                                    { icon: 'add_business', color: 'text-green-500 bg-green-500/20', text: 'New business registration: "Sunshine Daycare Center". Needs approval.', time: '3 hours ago' },
                                    { icon: 'payments', color: 'text-blue-500 bg-blue-500/20', text: '"Tech Solutions Inc." upgraded to Premium Listing.', time: 'Yesterday' }
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.color}`}>
                                            <span className="material-symbols-outlined text-sm">{act.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{act.text}</p>
                                            <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full py-2.5 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mt-4">
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
