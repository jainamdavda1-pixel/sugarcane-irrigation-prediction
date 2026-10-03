import React from 'react';
import { NavLink } from 'react-router-dom';
import { Droplets, CloudSun, BrainCircuit, FileText, History } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Assistant', icon: Droplets },
    { to: '/farm-weather', label: 'Weather', icon: CloudSun },
    { to: '/model-lab', label: 'ML Lab', icon: BrainCircuit },
    { to: '/methodology', label: 'Dataset', icon: FileText },
    { to: '/history', label: 'History', icon: History },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F8F7EF]/95 backdrop-blur-md border-t border-[#D8E4D0] px-2 py-1.5 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
                  isActive
                    ? 'text-[#245C3A] font-extrabold scale-105'
                    : 'text-[#536B5C] hover:text-[#26352B]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition-colors ${
                      isActive ? 'bg-[#EDF4E7] text-[#245C3A]' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
