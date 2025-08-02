"use client";

import React, { useState } from 'react';
import { Menu, FileText, HelpCircle, Bell, MapPin, LogOut, ChevronDown, Shield, X } from 'lucide-react';

const StudentPortalSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpdatesSubmenu, setShowUpdatesSubmenu] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowUpdatesSubmenu(false);
    }
  };

  const toggleUpdatesSubmenu = () => {
    setShowUpdatesSubmenu(!showUpdatesSubmenu);
  };

  const handleVerificationClick = () => {
    console.log('Verification of Accounts clicked');
  };

  const handleSubmenuClick = (item: string) => {
    console.log(`${item} clicked`);
  };

  return (
    <div className="min-h-screen flex items-start pt-24">
      <div className={`${isOpen ? 'w-80' : 'w-16'} transition-all duration-700 ease-out ${isOpen ? 'h-[70vh]' : 'h-[70vh]'} flex flex-col overflow-hidden ml-4 rounded-2xl shadow-2xl border border-white/20`} 
           style={{ 
             background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)'
           }}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100/50">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className={`p-2.5 hover:bg-gray-100/60 rounded-xl transition-all duration-300 group ${!isOpen ? 'mx-auto' : ''}`}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
              )}
            </button>
            {isOpen && (
              <div className="flex items-center gap-2 opacity-0 animate-fadeIn">
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                <span className="text-xs font-medium text-gray-500 tracking-wide">STUDENT UPDATES</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className={`flex-1 flex flex-col transition-all duration-700 ease-out ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <div className={`transition-all duration-500 ${isOpen ? 'visible' : 'invisible'} flex-1 flex flex-col`}>
            
            {/* Navigation Section */}
            <div className="p-6 flex-1">
              
              {/* Updates Section */}
              <div className="mb-6">
                <button
                  onClick={toggleUpdatesSubmenu}
                  className="w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-500 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold text-sm">Updates</h3>
                        <p className="text-white/70 text-xs">4 new notifications</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/80 transition-transform duration-500 ${
                      showUpdatesSubmenu ? 'rotate-180' : 'rotate-0'
                    }`} />
                  </div>
                </button>

                {/* Submenu Items */}
                <div className={`mt-3 overflow-hidden transition-all duration-500 ease-out ${
                  showUpdatesSubmenu ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-1 pl-4">
                    {[
                      { icon: FileText, label: 'Contract Renewals', count: '2' },
                      { icon: HelpCircle, label: 'Student Queries', count: '5' },
                      { icon: Bell, label: 'General Updates', count: '1' },
                      { icon: MapPin, label: 'Port Elizabeth Trip', count: '3' }
                    ].map((item, index) => (
                      <button 
                        key={item.label}
                        onClick={() => handleSubmenuClick(item.label)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-purple-100 hover:border-purple-300 rounded-lg transition-all duration-300 group border border-transparent transform hover:scale-[1.02] hover:shadow-sm"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all duration-300">
                          <item.icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-purple-700 transition-colors duration-300" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium flex-1 text-left group-hover:text-purple-900 transition-colors duration-300">{item.label}</span>
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300">
                          {item.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="mb-6">
                <button
                  onClick={handleVerificationClick}
                  className="w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-500 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-sm">Account Verification</h3>
                      <p className="text-white/70 text-xs">Secure your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default StudentPortalSidebar;