import { useState, useEffect } from 'react';

const AdBanner = ({ page = 'Home' }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/ads?page=${page}`)
            .then(res => res.json())
            .then(data => {
                setAds(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page]);

    if (loading || ads.length === 0) return null;

    // Pick one random ad if there are multiple, guaranteeing we only display one
    const displayAd = ads[Math.floor(Math.random() * ads.length)];
    const isVideo = displayAd.media && /\.(mp4|webm|ogg)$/i.test(displayAd.media);

    return (
        <div className="space-y-4">
            <a
                href={displayAd.redirectLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block group rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300"
            >
                {/* Media */}
                {displayAd.media && (
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {isVideo ? (
                            <video
                                src={displayAd.media}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={displayAd.media}
                                alt={displayAd.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5">
                            <span className="inline-block px-2 py-0.5 bg-primary text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest mb-2">
                                Sponsored
                            </span>
                            <h3 className="text-white font-black text-lg leading-tight">{displayAd.title}</h3>
                        </div>
                    </div>
                )}

                {/* Text only if no media */}
                {!displayAd.media && (
                    <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6">
                        <span className="inline-block px-2 py-0.5 bg-white/30 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-2">
                            Sponsored
                        </span>
                        <h3 className="text-white font-black text-xl">{displayAd.title}</h3>
                    </div>
                )}

                {/* Description */}
                {displayAd.description && (
                    <div className="bg-white dark:bg-slate-900 px-5 py-4 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                            {displayAd.description}
                        </p>
                        <span className="shrink-0 bg-primary text-slate-900 text-xs font-black px-4 py-2 rounded-xl group-hover:scale-105 transition-transform whitespace-nowrap">
                            Learn More →
                        </span>
                    </div>
                )}
            </a>
        </div>
    );
};

export default AdBanner;
