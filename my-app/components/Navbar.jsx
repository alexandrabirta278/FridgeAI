import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-green-100 border-b border-green-300 text-green-800 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link href="/">
        <span className="text-xl font-bold text-green-700">🥗 FridgeAI</span>
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-700">{user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login" className="text-green-700 hover:underline">
            Login
          </Link>
          <Link href="/register" className="text-green-700 hover:underline">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
