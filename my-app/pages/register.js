import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.ok && router.push('/new'))
      .catch(() => {});
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setError('');

    if (!validateEmail(email)) {
      return setError('Invalid email format');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) router.push('/login');
    else setError(data.message || 'Registration failed');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-3 border rounded w-full max-w-xs"
      />
      <input
        type="password"
        placeholder="Password (min. 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-3 border rounded w-full max-w-xs"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 transition text-white font-semibold px-4 py-2 rounded w-full max-w-xs"
      >
        Register
      </button>
      <p className="mt-3 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 underline">Login</Link>
      </p>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
