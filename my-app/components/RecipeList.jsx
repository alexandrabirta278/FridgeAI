// components/RecipeList.jsx
export default function RecipeList({ recipes = [], onDelete }) {
  if (!recipes.length) {
    return <p className="text-center text-gray-500 mt-4">No recipes saved yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      {recipes.map((r) => (
        <div
          key={r._id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-rose-600 mb-2">{r.title || 'Recipe'}</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {r.result}
          </pre>
          <button
            onClick={() => onDelete(r._id)}
            className="mt-4 text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
