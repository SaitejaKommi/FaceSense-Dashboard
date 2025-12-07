import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate();
  const { username, logout } = useAuth()
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout()
      navigate('/login');
    }, 700);
  };

  return (
  <nav className="h-16 bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50 w-full">
    <div className="max-w-6xl mx-auto h-full px-6 flex items-center">
     

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 ml-auto">
        <span className="text-xl font-bold text-white tracking-wide drop-shadow-md capitalize">
          {username || 'User'}
        </span>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-red-200 border-t-transparent animate-spin rounded-full"></span>
          ) : (
            <LogOut size={18} />
          )}
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  </nav>
);

}