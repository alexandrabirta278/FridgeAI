import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RecipeList from '../components/RecipeList';

export default function NewPage() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const fetchRecipes = async () => {
    const res = await fetch('/api/recipes');
    const data = await res.json();
    setRecipes(data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

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
      setResult(data.result.replace(/\n/g, '<br/>'));
      setTitle(data.title);
    } catch (err) {
      setResult('Error generating recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content: result, imageUrl: '' }),
    });
    fetchRecipes();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/recipes?id=${id}`, {
      method: 'DELETE',
    });
    fetchRecipes();
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-green-600">🥗 Generate Recipe</h1>

          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g. eggs, tomatoes, pasta)"
            rows={4}
            className="w-full rounded-lg p-4 bg-green-100 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition text-white text-lg font-semibold py-3 rounded-full shadow disabled:opacity-50"
          >
            {loading ? 'Generating...' : '✨ Generate Recipe'}
          </button>

          {result && (
            <div className="bg-white border border-green-300 rounded-xl p-6 shadow space-y-4">
              <h2 className="text-2xl font-bold text-green-600 text-center">{title}</h2>
              <div
                className="prose prose-green max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: result }}
              />
              <button
                onClick={handleSave}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                💾 Save Recipe
              </button>
            </div>
          )}

          <div className="pt-2">
            <h2 className="text-xl font-semibold text-green-600 mb-3">Saved Recipes</h2>
            <RecipeList recipes={recipes} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  );
}
