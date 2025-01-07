import React from 'react';
import { Home, Link, Search, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router';

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = React.useState('home');
  const navigate = useNavigate();

  const handleClick = (id, url) => {
    setActiveTab(id);
    console.log(`Navigating to ${url}`);
    navigate(url);
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, url: '/' },
    { id: 'search', label: 'Search', icon: Search, url: '/search' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, url: '/cart' },
    { id: 'profile', label: 'Profile', icon: User, url: '/account' },
  ];

  return (
    // Fixed position at bottom, only visible on small screens (max-width: 768px)
    <div className="fixed bottom-3 left-3 right-3 bg-gray-900 border-t rounded-lg border-white md:hidden">
      <nav className="flex justify-between items-center px-4 py-2">
        {navItems.map(({ id, label, icon: Icon, url }) => (
          <button
            key={id}
            onClick={() => handleClick(id, url)}
            className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
              activeTab === id ? 'text-[#ffb700]' : 'text-white'
            }`}
          >
            <Icon 
              className={`w-6 h-6 ${
                activeTab === id ? 'text-[#ffb700]' : 'text-white'
              }`} 
            />
            <span className="text-xs">{label}</span>
            
            {/* Active indicator dot */}
            {activeTab === id && (
              <div className="absolute top-2 w-1 h-1 bg-[#ffb700] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Safe area spacing for iOS devices */}
      <div className="h-safe-bottom bg-white" />
    </div>
  );
};

export default BottomNavBar;