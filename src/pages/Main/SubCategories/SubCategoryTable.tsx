import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type SubCategory = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface SubCategoryTableProps {
  onEditSubCategory: (subcat: SubCategory) => void;
  onDeleteSubCategoryRequest: (subcat: SubCategory) => void;
}

// Table to display all subcategories
export default function SubCategoryTable({
  onEditSubCategory,
  onDeleteSubCategoryRequest,
}: SubCategoryTableProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-categories`
        );
        const data = await response.json();
        if (data.success) {
          setSubCategories(data.subcategories || []);
        } else {
          toast.error(data.error || "Failed to load subcategories");
        }
      } catch (err: any) {
        toast.error(
          "Error fetching subcategories: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
      setLoading(false);
    };
    fetchSubCategories();
  }, []);

  if (loading) {
    return <div className="px-4 py-8 text-lg">Loading...</div>;
  }

  if (!subCategories.length) {
    return <div className="px-4 py-8 text-lg">No subcategories found.</div>;
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
            {subCategories.map((subcat) => (
              <tr key={subcat._id}>
                <td className="px-5 py-4 sm:px-6 text-start">
                  {subcat.image ? (
                    <img
                      src={
                        subcat.image.startsWith("http")
                          ? subcat.image
                          : `${import.meta.env.VITE_API_URL || ""}/${subcat.image}`
                      }
                      alt={subcat.name}
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
                  {subcat.customId}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {subcat.name}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  <span
                    className={
                      subcat.status === "active"
                        ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                        : "px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    }
                  >
                    {subcat.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {subcat.createdAt ? new Date(subcat.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {subcat.updatedAt ? new Date(subcat.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  <div className="flex space-x-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="Edit SubCategory"
                      onClick={() => onEditSubCategory(subcat)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete SubCategory"
                      onClick={() => onDeleteSubCategoryRequest(subcat)}
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
