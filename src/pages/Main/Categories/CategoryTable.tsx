import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Category = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface CategoryTableProps {
  onEditCategory: (cat: Category) => void;
  onDeleteCategoryRequest: (cat: Category) => void;
}

// Table to display all categories
export default function CategoryTable({
  onEditCategory,
  onDeleteCategoryRequest,
}: CategoryTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          toast.error(data.error || "Failed to load categories");
        }
      } catch (err: any) {
        toast.error(
          "Error fetching categories: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="px-4 py-8 text-lg">Loading...</div>;
  }

  if (!categories.length) {
    return <div className="px-4 py-8 text-lg">No categories found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-white/[0.05]">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Image
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Custom ID
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Name
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Created At
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Updated At
              </th>
              <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-5 py-4 sm:px-6 text-start">
                  {cat.image ? (
                    <img
                      src={
                        cat.image.startsWith("http")
                          ? cat.image
                          : `${import.meta.env.VITE_API_URL || ""}/${cat.image}`
                      }
                      alt={cat.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xl">
                      <span role="img" aria-label="No image">
                        🖼️
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {cat.customId}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {cat.name}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  <span
                    className={
                      cat.status === "active"
                        ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                        : "px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    }
                  >
                    {cat.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {cat.createdAt ? new Date(cat.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {cat.updatedAt ? new Date(cat.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  <div className="flex space-x-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="Edit Category"
                      onClick={() => onEditCategory(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete Category"
                      onClick={() => onDeleteCategoryRequest(cat)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
