// components/Navbar.jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/api/me').then((res) => res.ok && res.json()).then((data) => setEmail(data?.email || ''));
  }, []);

  const logout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
      <div className="text-2xl font-bold text-rose-600 tracking-tight">🍳 FridgeAI</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{email}</span>
        <button
          onClick={logout}
          className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
