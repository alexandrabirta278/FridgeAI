import { useState } from 'react';

export default function RecipeList({ recipes = [], onDelete }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
          <h3 className="text-lg font-semibold text-rose-600 mb-2">
            {r.title || 'Recipe'}
          </h3>

          <div className="flex gap-4 text-sm mb-2">
            <button
              onClick={() => toggleExpand(r._id)}
              className="text-blue-600 hover:underline"
            >
              {expanded[r._id] ? 'Hide' : 'View'}
            </button>
            <button
              onClick={() => onDelete(r._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>

          {expanded[r._id] && (
            <div
              className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap text-gray-700"
              dangerouslySetInnerHTML={{ __html: r.result || 'No recipe content found.' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
