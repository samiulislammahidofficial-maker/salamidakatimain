import React, { useState, useEffect } from 'react';
import { db, auth, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from '../firebase';
import { MapPin, Clock, User, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Drop {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  authorId: string;
  authorName?: string;
  authorPhoto?: string;
  createdAt: Timestamp;
}

export default function GeoDrop() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newDropContent, setNewDropContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location permissions to see nearby drops.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }

    // Subscribe to drops
    const q = query(collection(db, 'drops'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dropsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Drop[];
      setDrops(dropsData);
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Failed to load drops. Please check your connection.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation) {
      setError("Waiting for your location...");
      return;
    }
    if (!newDropContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'drops'), {
        content: newDropContent,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        authorName: 'Anonymous User',
        authorPhoto: `https://ui-avatars.com/api/?name=A&background=random`,
        createdAt: serverTimestamp(),
      });
      setNewDropContent('');
      setError(null);
    } catch (err) {
      console.error("Error creating drop:", err);
      setError("Failed to create drop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8" />
          GeoDrop
        </h1>
        <p className="text-slate-500">Share what's happening at your spot.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Create Drop Form */}
      <form onSubmit={handleCreateDrop} className="bg-white p-4 rounded-3xl shadow-sm border border-blue-100 space-y-4">
        <div className="flex items-start gap-3">
          <img 
            src={`https://ui-avatars.com/api/?name=A&background=random`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-blue-100"
            referrerPolicy="no-referrer"
          />
          <textarea
            value={newDropContent}
            onChange={(e) => setNewDropContent(e.target.value)}
            placeholder="What's happening here?"
            className="w-full p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px] text-slate-900"
            maxLength={500}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-blue-500" />
            {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Locating...'}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newDropContent.trim() || !userLocation}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Drop It
          </button>
        </div>
      </form>

      {/* Drops List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading nearby drops...</p>
          </div>
        ) : drops.length === 0 ? (
          <div className="text-center py-20 bg-blue-50/50 rounded-3xl border border-dashed border-blue-200">
            <MapPin className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No drops yet. Be the first to drop something here!</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {drops.map((drop) => {
              const distance = userLocation 
                ? calculateDistance(userLocation.lat, userLocation.lng, drop.latitude, drop.longitude)
                : null;
              
              return (
                <motion.div
                  key={drop.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={drop.authorPhoto || `https://ui-avatars.com/api/?name=${drop.authorName || 'User'}`} 
                        alt={drop.authorName} 
                        className="w-10 h-10 rounded-full border border-blue-50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900">{drop.authorName || 'Anonymous'}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {drop.createdAt?.toDate().toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {distance !== null && (
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`}
                      </div>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {drop.content}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
