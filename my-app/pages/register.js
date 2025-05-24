import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-600">Register</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-green-300 rounded-lg bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-green-300 rounded-lg bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
