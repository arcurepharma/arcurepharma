"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Tags } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Enter a category name");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Category "${data.name}" created`);
        setNewName("");
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    }
    setCreating(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) {
      toast.error("Enter a category name");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Category updated");
        cancelEdit();
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to update category");
      }
    } catch {
      toast.error("Failed to update category");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will keep their label.`))
      return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create, edit and manage product categories
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Add New Category</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g., Diabetes Care"
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Tags className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No categories yet. Add your first category!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Created
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 max-w-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          disabled={saving}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 text-sm">
                        {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === cat.id ? (
                      <span className="text-gray-300 text-sm">Editing...</span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
