import { useRouter } from 'next/router';

export default function Navbar({ email }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  return (
    <div className="w-full flex justify-between items-center p-4 bg-gray-100 border-b">
      <span className="text-sm text-gray-700">👤 {email}</span>
      <button onClick={handleLogout} className="text-red-600 underline">Logout</button>
    </div>
  );
}
