import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, Info } from 'lucide-react';

export default function GeoDrop() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <MapPin size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">GeoDrop</h1>
            <p className="text-slate-500 italic">Location-based Salami tracking</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex gap-4">
          <Info className="text-amber-500 shrink-0" />
          <p className="text-amber-800">
            This feature is currently under development. Soon you'll be able to see real-time "Salami Drops" 
            happening near your campus location!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="text-blue-500" />
              <h3 className="font-semibold text-slate-800">Recent Drops</h3>
            </div>
            <p className="text-slate-500 text-sm">
              No recent drops in your area. Be the first to report a Salami sighting!
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 opacity-60">
            <h3 className="font-semibold text-slate-800 mb-2">Heat Map</h3>
            <div className="h-32 bg-slate-200 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-slate-400 text-xs">Map Loading...</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
