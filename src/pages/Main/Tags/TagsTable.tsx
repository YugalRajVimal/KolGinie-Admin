import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Tag = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

interface TagTableProps {
  onEditCategory: (tag: Tag) => void;
  onDeleteCategoryRequest: (tag: Tag) => void;
}

// Table to display all tags (no image column)
export default function TagTable({
  onEditCategory,
  onDeleteCategoryRequest,
}: TagTableProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-tags`
        );
        const data = await response.json();
        if (data.success) {
          setTags(data.tags);
        } else {
          toast.error(data.error || "Failed to load tags");
        }
      } catch (err: any) {
        toast.error(
          "Error fetching tags: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
      setLoading(false);
    };
    fetchTags();
  }, []);

  if (loading) {
    return <div className="px-4 py-8 text-lg">Loading...</div>;
  }

  if (!tags.length) {
    return <div className="px-4 py-8 text-lg">No tags found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-white/[0.05]">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
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
            {tags.map((tag) => (
              <tr key={tag._id}>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {tag.customId}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {tag.name}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  <span
                    className={
                      tag.status === "active"
                        ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                        : "px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    }
                  >
                    {tag.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {tag.createdAt ? new Date(tag.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {tag.updatedAt ? new Date(tag.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  <div className="flex space-x-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="Edit Tag"
                      onClick={() => onEditCategory(tag)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete Tag"
                      onClick={() => onDeleteCategoryRequest(tag)}
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
