// pages/new.js
import { useState } from "react";

export default function NewRecipe() {
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
    formData.append("ingredients", ingredients);
    if (image) formData.append("image", image);

    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data?.result || "No recipe found.");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Generate Recipe</h1>

      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter ingredients (e.g., eggs, tomatoes)"
        rows={4}
        className="w-full border rounded p-2 mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Image Preview:</p>
          <img src={preview} alt="Preview" className="max-h-64 rounded" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Result:</h2>
          {result}
        </div>
      )}
    </div>
  );
}
