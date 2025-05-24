import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';
import ReactMarkdown from 'react-markdown';

export default function NewPage() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const res = await fetch('/api/recipes');
    if (res.ok) {
      const data = await res.json();
      setRecipes(data);
    }
  };

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
    setTitle('');

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data.result);
      setTitle(data.title);
    } catch (err) {
      setResult('Error generating recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !title) return;

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        result,
        ingredients: [ingredients],
        imageUrl: '',
      }),
    });

    if (res.ok) {
      setResult('');
      setTitle('');
      setIngredients('');
      setImage(null);
      await fetchRecipes();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    await fetchRecipes();
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
              <h2 className="text-2xl font-bold text-rose-600 text-center">{title || 'Your Recipe'}</h2>
              <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                {result}
              </div>
              <button
                onClick={handleSave}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                💾 Save Recipe
              </button>
            </div>
          )}

          <div className="pt-2">
            <h2 className="text-xl font-semibold text-rose-600 mb-3">Saved Recipes</h2>
            <RecipeList recipes={recipes} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
