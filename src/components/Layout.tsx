import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Trophy, Calculator, Smile, MapPin, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import FAB from './FAB';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'হোম' },
    { path: '/geodrop', icon: MapPin, label: 'জিও ড্রপ' },
    { path: '/submit', icon: PlusCircle, label: 'সাবমিট' },
    { path: '/leaderboard', icon: Trophy, label: 'লিডারবোর্ড' },
    { path: '/calculator', icon: Calculator, label: 'ক্যালকুলেটর' },
    { path: '/memes', icon: Smile, label: 'মিম' },
  ];

  return (
    <div className="min-h-screen bg-blue-50/30 text-slate-900 pb-20 md:pb-0 md:pt-16 font-sans">
      {/* Top Navigation (Desktop) */}
      <header className="hidden md:block fixed top-0 left-0 right-0 bg-blue-50/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span>সালামি ডাকাতি</span>
            <span className="text-3xl">💰</span>
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-medium",
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-blue-50/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="px-4 h-14 flex items-center justify-center">
          <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span>সালামি ডাকাতি</span>
            <span className="text-2xl">💰</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* FAB */}
      <FAB onClick={() => navigate('/geodrop')} />

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-50/80 backdrop-blur-md border-t border-blue-100 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-blue-100")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
