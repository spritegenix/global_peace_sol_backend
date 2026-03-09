import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import AdBanner from '../components/AdBanner';

const BusinessDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setError('No business ID provided.');
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`http://localhost:5000/api/businesses/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Business not found');
                return res.json();
            })
            .then(data => {
                setBusiness(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load business details.');
                setLoading(false);
            });
    }, [id]);

    const isAuthorized = user && business && (user.id === business.owner?.toString() || user.role === 'admin');

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this business?')) return;
        try {
            const res = await fetchApi(`/api/businesses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                navigate('/directory');
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Business Not Found</h2>
                <p className="text-slate-500 mb-6">{error || 'The business you are looking for does not exist.'}</p>
                <Link to="/directory" className="bg-primary hover:bg-primary/90 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors">
                    Back to Directory
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <Link to="/directory" className="hover:text-primary">Directory</Link>
                    {business.category && (
                        <>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary font-semibold">{business.category}</span>
                        </>
                    )}
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-[180px]">{business.name}</span>
                </div>
                {isAuthorized && (
                    <div className="flex gap-2">
                        <Link
                            to={`/edit-business/${business._id}`}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${business.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                    {business.category && (
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{business.category}</span>
                    )}
                    <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{business.name}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        {business.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <div className="flex text-primary">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s} className={`material-symbols-outlined text-sm ${s <= Math.round(business.rating) ? 'filled-icon' : ''}`}>star</span>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">{business.rating} ({business.reviews} reviews)</span>
                            </div>
                        )}
                        {business.city && (
                            <span className="flex items-center gap-1 text-sm text-slate-200">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {business.city}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-sm text-green-400 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                            {business.status || 'Active'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Business Information */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Business Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            {business.address && (
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Address</p>
                                        <p className="text-slate-900 dark:text-slate-200 mt-1">
                                            {business.address}
                                            {business.city && <>, {business.city}</>}
                                            {business.pincode && <> — {business.pincode}</>}
                                        </p>
                                        <a
                                            href={`https://maps.google.com?q=${encodeURIComponent(`${business.address} ${business.city || ''}`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                                        >
                                            Get Directions <span className="material-symbols-outlined text-xs">open_in_new</span>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Phone */}
                            {business.phone && (
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                                        <span className="material-symbols-outlined text-primary">call</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Phone</p>
                                        <a href={`tel:${business.phone}`} className="text-slate-900 dark:text-slate-200 mt-1 hover:text-primary font-medium block">{business.phone}</a>
                                    </div>
                                </div>
                            )}

                            {/* Website — only shown if present */}
                            {business.website && (
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                                        <span className="material-symbols-outlined text-primary">public</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Website</p>
                                        <a
                                            href={business.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary hover:underline font-medium mt-1 block truncate max-w-[200px]"
                                        >
                                            {business.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Category */}
                            {business.category && (
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                                        <span className="material-symbols-outlined text-primary">category</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Category</p>
                                        <p className="text-slate-900 dark:text-slate-200 mt-1 font-medium">{business.category}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Description */}
                    {business.description && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span>
                                About This Business
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{business.description}</p>
                        </section>
                    )}

                    {/* Reviews Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Reviews & Ratings</h3>
                            <button className="bg-primary hover:bg-primary/90 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold">Write a Review</button>
                        </div>
                        {business.reviews > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                                <div className="text-center md:border-r border-slate-100 dark:border-slate-800">
                                    <p className="text-5xl font-black text-slate-900 dark:text-white">{business.rating?.toFixed(1) || '—'}</p>
                                    <div className="flex justify-center text-primary my-2">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined filled-icon">star</span>)}
                                    </div>
                                    <p className="text-sm text-slate-500">{business.reviews} global ratings</p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    {[5, 4, 3, 2, 1].map(s => (
                                        <div key={s} className="flex items-center gap-4">
                                            <span className="text-xs font-medium w-4">{s}</span>
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: s === 5 ? '70%' : s === 4 ? '20%' : s === 3 ? '7%' : '3%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-500">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">rate_review</span>
                                <p className="text-sm">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 space-y-4">
                        {/* Action Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold mb-4">Contact Business</h4>
                            <div className="space-y-3">
                                {business.phone ? (
                                    <a
                                        href={`tel:${business.phone}`}
                                        className="w-full bg-primary hover:bg-primary/90 text-slate-900 h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">call</span>
                                        Call {business.phone}
                                    </a>
                                ) : (
                                    <button disabled className="w-full bg-slate-100 text-slate-400 h-12 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                        <span className="material-symbols-outlined">call</span>
                                        No Phone Listed
                                    </button>
                                )}
                                {business.address && (
                                    <a
                                        href={`https://maps.google.com?q=${encodeURIComponent(`${business.address} ${business.city || ''}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-slate-100"
                                    >
                                        <span className="material-symbols-outlined">directions</span>
                                        Get Directions
                                    </a>
                                )}
                                {business.website && (
                                    <a
                                        href={business.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full border border-slate-200 dark:border-slate-700 h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">public</span>
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Ad Banner — Sidebar */}
                        <AdBanner variant="sidebar" />
                    </div>
                </div>
            </div>

            {/* Mobile Floating Actions */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 pb-8">
                <div className="flex gap-3 max-w-lg mx-auto">
                    {business.phone ? (
                        <a href={`tel:${business.phone}`} className="flex-1 bg-primary hover:bg-primary/90 text-slate-900 h-12 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">call</span>
                            Call Now
                        </a>
                    ) : (
                        <button disabled className="flex-1 bg-slate-200 text-slate-400 h-12 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                            No Phone
                        </button>
                    )}
                    {business.address ? (
                        <a
                            href={`https://maps.google.com?q=${encodeURIComponent(`${business.address} ${business.city || ''}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-12 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
                        >
                            <span className="material-symbols-outlined">near_me</span>
                            Directions
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
