import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [users, setUsers] = useState([]);
    const [ads, setAds] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); 
    
    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });

    const [showEditAdModal, setShowEditAdModal] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);

    useEffect(() => {
        fetchApi('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(console.error);

        fetchApi('/api/ads')
            .then(res => res.json())
            .then(data => setAds(data))
            .catch(console.error);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
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

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                const addedUser = await res.json();
                setUsers([...users, addedUser]);
                setShowAddModal(false);
                setNewUser({ name: '', email: '', password: '', role: 'user' });
            } else {
                const error = await res.json();
                alert(error.message || 'Error adding user');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddAd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedAd) // Reuse selectedAd state for new ad form
            });
            if (res.ok) {
                const addedAd = await res.json();
                setAds([addedAd, ...ads]);
                setShowEditAdModal(false);
                setSelectedAd(null);
            } else {
                const error = await res.json();
                alert(error.message || 'Error adding ad');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditAd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetchApi(`/api/ads/${selectedAd._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedAd)
            });
            if (res.ok) {
                const updatedAd = await res.json();
                setAds(ads.map(ad => ad._id === updatedAd._id ? updatedAd : ad));
                setShowEditAdModal(false);
                setSelectedAd(null);
            } else {
                const error = await res.json();
                alert(error.message || 'Error updating ad');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAd = async (id) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        try {
            const res = await fetchApi(`/api/ads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAds(ads.filter(ad => ad._id !== id));
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
                    <button onClick={() => setActiveTab('users')} className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-800 hover:text-white transition-colors'}`}>
                        <span className="material-symbols-outlined">group</span>
                        Users Management
                    </button>
                    <button onClick={() => setActiveTab('ads')} className={`flex w-full items-center gap-3 px-3 py-2.5 mt-1 rounded-lg font-bold ${activeTab === 'ads' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-800 hover:text-white transition-colors'}`}>
                        <span className="material-symbols-outlined">campaign</span>
                        Ad Management
                    </button>
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
                        <h1 className="text-xl font-bold">Admin Dashboard - {activeTab === 'users' ? 'Users' : 'Ads'}</h1>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                    {activeTab === 'users' && (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500 shrink-0">
                                        <span className="material-symbols-outlined text-3xl">group</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Users Table */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <h2 className="text-lg font-bold">Platform Users</h2>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="bg-primary text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">person_add</span>
                                            Add New User
                                        </button>
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
                                                            {user?.id !== u._id && (
                                                                <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'ads' && (
                        <div className="grid grid-cols-1 gap-8">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold">Ad Management</h2>
                                        <p className="text-sm text-slate-500 mt-1">Manage advertisements appearing across the site.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedAd({ page: 'Home', title: '', description: '', media: '', redirectLink: '' });
                                            setShowEditAdModal(true);
                                        }}
                                        className="bg-primary text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                                        Add New Ad
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Page Target</th>
                                                <th className="px-6 py-4 font-semibold">Title</th>
                                                <th className="px-6 py-4 font-semibold">Media Link</th>
                                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {ads.map((ad, i) => (
                                                <tr key={ad._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white capitalize">
                                                        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">{ad.page}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{ad.title}</td>
                                                    <td className="px-6 py-4 text-slate-400 truncate max-w-[150px]">{ad.media || 'None'}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedAd(ad);
                                                                    setShowEditAdModal(true);
                                                                }} 
                                                                className="text-primary hover:text-primary/80 font-bold flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAd(ad._id)} 
                                                                className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">delete</span> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {ads.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No advertisements found. Add some to get started.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Register New User</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Assign Role</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="user">Platform User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-primary text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    Register User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add/Edit Ad Modal */}
            {showEditAdModal && selectedAd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{selectedAd._id ? 'Edit Advertisement' : 'Create New Ad'}</h3>
                            <button onClick={() => setShowEditAdModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={selectedAd._id ? handleEditAd : handleAddAd} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Target Page</label>
                                <select
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={selectedAd.page}
                                    onChange={(e) => setSelectedAd({ ...selectedAd, page: e.target.value })}
                                >
                                    <option value="Home">Home Page</option>
                                    <option value="Categories">Categories Page</option>
                                    <option value="Directory">Directory Page</option>
                                    <option value="BusinessDetails">Business Details Page</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Ad Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={selectedAd.title}
                                    placeholder="e.g. Boost your local reach"
                                    onChange={(e) => setSelectedAd({ ...selectedAd, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Description (Optional)</label>
                                <textarea
                                    rows="2"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    value={selectedAd.description}
                                    placeholder="Short catchy subtitle"
                                    onChange={(e) => setSelectedAd({ ...selectedAd, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Media URL (Image / Video URL)</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={selectedAd.media}
                                    placeholder="https://..."
                                    onChange={(e) => setSelectedAd({ ...selectedAd, media: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1">Redirect Link (On Click URL)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={selectedAd.redirectLink}
                                    placeholder="/add-business or https://..."
                                    onChange={(e) => setSelectedAd({ ...selectedAd, redirectLink: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditAdModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-primary text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {selectedAd._id ? 'Save Changes' : 'Create Ad'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
