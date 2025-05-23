import { useEffect, useState } from 'react';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    setRecipes(recipes.filter(r => r._id !== id));
  };

  return (
    <div className="bg-white border p-4 rounded shadow-sm w-full max-w-sm">
      <h2 className="font-semibold text-lg mb-2">Saved Recipes</h2>
      <ul className="space-y-2">
        {recipes.map(r => (
          <li key={r._id} className="flex justify-between items-center">
            <span className="text-sm">{r.ingredients?.slice(0, 20)}...</span>
            <button onClick={() => handleDelete(r._id)} className="text-red-500 text-xs">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
