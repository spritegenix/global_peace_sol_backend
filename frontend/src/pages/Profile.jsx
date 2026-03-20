import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const [myBusinesses, setMyBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        // Fetch businesses owned by this user
        fetchApi(`/api/businesses?owner=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setMyBusinesses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching user businesses:', err);
                setLoading(false);
            });
    }, [user]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            const res = await fetchApi(`/api/businesses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMyBusinesses(myBusinesses.filter(b => b._id !== id));
            } else {
                alert('Failed to delete business');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting business');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-slate-900 shadow-2xl shadow-primary/30">
                        <span className="material-symbols-outlined text-5xl font-black">person</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Hey, {user?.name || 'User'}!</h1>
                        <p className="text-slate-500 font-medium">{user?.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {user?.role || 'Member'}
                            </span>
                            <span className="px-4 py-1.5 bg-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary border border-primary/20">
                                {myBusinesses.length} Listings
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* User Stats/Actions Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link to="/add-business" className="flex items-center gap-3 p-4 bg-primary text-slate-900 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">add_business</span>
                                Add New Business
                            </Link>
                            <Link to="/directory" className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                <span className="material-symbols-outlined">search</span>
                                Browse Directory
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors"></div>
                        <h4 className="text-xl font-black mb-2 relative z-10">Account Status</h4>
                        <p className="text-slate-400 text-sm leading-relaxed relative z-10">Your account is active and verified. You can list up to 50 businesses on the standard plan.</p>
                    </div>
                </aside>

                {/* My Businesses List */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                        My Listings
                        {!loading && <span className="text-primary text-sm bg-primary/10 px-3 py-1 rounded-full">{myBusinesses.length}</span>}
                    </h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading your hard work...</p>
                        </div>
                    ) : myBusinesses.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm px-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl text-slate-300">add_business</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No businesses listed yet</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Ready to put your business on the map? Start by creating your first listing today!</p>
                            <Link to="/add-business" className="inline-block bg-primary text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-110 transition-all">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {myBusinesses.map((biz) => (
                                <div key={biz._id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-all group">
                                    <div className="w-full md:w-40 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                                        <div 
                                            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                            style={{ backgroundImage: `url('${biz.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60'}')` }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{biz.category}</span>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{biz.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 group-hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-sm font-black fill-1">star</span>
                                                <span className="text-sm font-black">{biz.rating || 0}</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 mb-6">{biz.address || 'No address provided'}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 lg:gap-8 pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <Link to={`/edit-business/${biz._id}`} className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                                Edit
                                            </Link>
                                            {user?.role === 'admin' && (
                                                <button 
                                                    onClick={() => handleDelete(biz._id)}
                                                    className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors ml-auto"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
