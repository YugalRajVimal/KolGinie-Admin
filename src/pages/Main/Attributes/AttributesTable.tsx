import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Attribute = {
  _id: string;
  customId: string;
  name: string;
  terms: string[]; // array of terms
  createdAt?: string;
  updatedAt?: string;
};

interface AttributeTableProps {
  onEditCategory: (attribute: Attribute) => void;
  onDeleteCategoryRequest: (attribute: Attribute) => void;
}

// Table to display all attributes (terms as array, no status)
export default function AttributeTable({
  onEditCategory,
  onDeleteCategoryRequest,
}: AttributeTableProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttributes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-attributes`
        );
        const data = await response.json();
        if (data.success) {
          setAttributes(data.attributes);
        } else {
          toast.error(data.error || "Failed to load attributes");
        }
      } catch (err: any) {
        toast.error(
          "Error fetching attributes: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
      setLoading(false);
    };
    fetchAttributes();
  }, []);

  if (loading) {
    return <div className="px-4 py-8 text-lg">Loading...</div>;
  }

  if (!attributes.length) {
    return <div className="px-4 py-8 text-lg">No attributes found.</div>;
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
                Terms
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
            {attributes.map((attribute) => (
              <tr key={attribute._id}>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {attribute.customId}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {attribute.name}
                </td>
                <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                  {attribute.terms && attribute.terms.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {attribute.terms.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {attribute.createdAt ? new Date(attribute.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {attribute.updatedAt ? new Date(attribute.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  <div className="flex space-x-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="Edit Attribute"
                      onClick={() => onEditCategory(attribute)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="Delete Attribute"
                      onClick={() => onDeleteCategoryRequest(attribute)}
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
