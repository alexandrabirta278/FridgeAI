// /pages/new.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import RecipeList from '@/components/RecipeList';

export default function NewRecipePage() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then(data => setEmail(data.email))
      .catch(() => router.push('/login'));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('ingredients', ingredients);
    if (image) formData.append('image', image);

    const res = await fetch('/api/generate-recipe', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const cleaned = data?.result
      ?.replace(/[*_`]/g, '')
      .replace(/^#+\s/gm, '')
      .replace(/\n{2,}/g, '\n\n') || 'No recipe found.';
    setResult(cleaned);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar email={email} />
      <div className="max-w-5xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-rose-600">🍳 FridgeAI Recipe Generator</h1>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List your ingredients (e.g. eggs, bread)"
            rows={4}
            className="w-full rounded-md p-4 text-base bg-gray-100 border border-gray-300"
          />
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Upload or take a picture</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
          </label>

          {preview && (
            <img src={preview} alt="Preview" className="max-h-64 rounded border" />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-white rounded shadow border border-gray-200 whitespace-pre-wrap">
              <h2 className="text-xl font-semibold text-rose-600 mb-2">📜 Recipe Result:</h2>
              {result}
            </div>
          )}
        </div>

        <RecipeList />
      </div>
    </div>
  );
}
