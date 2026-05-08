/**
 * @file Sidebar.jsx
 * @description The persistent side navigation bar.
 * Uses CSS custom properties from the BharatPath theme system.
 */

import { NavLink } from 'react-router-dom';
import {
  Home,
  MapPin,
  Ticket,
  BellRing,
  AlertTriangle,
  RefreshCcw,
  Route,
  X,
  Menu
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navItems = [
    { name: 'Dashboard',           path: '/',                    icon: Home },
    { name: 'Live Tracking',       path: '/live-tracking',       icon: MapPin },
    { name: 'PNR Status',          path: '/pnr-status',          icon: Ticket },
    { name: 'Proximity Alerts',    path: '/proximity-alerts',    icon: BellRing },
    { name: 'Seat Exchange',       path: '/seat-exchange',       icon: RefreshCcw },
    { name: 'Connecting Journeys', path: '/connecting-journeys', icon: Route },
    { name: 'SOS Emergency',       path: '/sos',                 icon: AlertTriangle, isDanger: true },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'w-64' : 'w-[80px]'} bp-glass`}
      style={{
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col h-full relative">
        
        {/* Logo Section */}
        <div className="h-[72px] flex items-center px-5 border-b border-[var(--border)] overflow-hidden">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20"
            style={{ background: 'linear-gradient(135deg, var(--primary), #FF8C42)' }}
          >
            <Route size={22} color="white" />
          </div>
          {isOpen && (
            <span className="ml-3 font-extrabold text-lg tracking-tight anim-fade-in" style={{ color: 'var(--text-heading)' }}>
              BHARAT<span style={{ color: 'var(--primary)' }}>PATH</span>
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-[var(--primary-light)] text-[var(--primary)]' 
                  : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                }`
              }
            >
              <item.icon 
                size={22} 
                className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.isDanger ? 'text-red-500' : ''}`}
              />
              {isOpen && (
                <span className="font-semibold text-[14px] whitespace-nowrap anim-slide-right">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-6 text-[10px] text-center border-t border-[var(--border)]">
          {isOpen ? (
            <div className="anim-fade-in">
              <p style={{ color: 'var(--text-secondary)' }} className="font-semibold mb-1">
                BharatPath App
              </p>
              <p>&copy; {new Date().getFullYear()} All rights reserved</p>
            </div>
          ) : (
            <div className="flex justify-center anim-scale-in">
              <span className="font-bold" style={{ color: 'var(--primary)' }}>BP</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
