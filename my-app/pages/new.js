// pages/new.js
import { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';
import ReactMarkdown from 'react-markdown';

export default function NewPage() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async () => {
    if (!ingredients && !image) return;

    const formData = new FormData();
    if (ingredients) formData.append('ingredients', ingredients);
    if (image) formData.append('image', image);

    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult('Error generating recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-rose-600">🍳 Generate Recipe</h1>

          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g. eggs, tomatoes, pasta)"
            rows={4}
            className="w-full rounded-lg p-4 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder-gray-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 cursor-pointer"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 transition text-white text-lg font-semibold py-3 rounded-full shadow disabled:opacity-50"
          >
            {loading ? 'Generating...' : '✨ Generate Recipe'}
          </button>

          {result && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow space-y-4">
              <h2 className="text-2xl font-bold text-rose-600 text-center">Your Recipe</h2>
              <div className="prose prose-p:my-2 prose-headings:text-rose-700 prose-ul:ml-6 prose-li:marker:text-rose-400 prose-strong:text-rose-600 max-w-none text-gray-800">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="pt-2">
            <h2 className="text-xl font-semibold text-rose-600 mb-3">Saved Recipes</h2>
            <RecipeList />
          </div>
        </div>
      </main>
    </div>
  );
}
