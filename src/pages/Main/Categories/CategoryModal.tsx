import { useState, useEffect } from "react";

type CategoryForm = {
  customId: string;
  name: string;
  status: string;
  image: File | null;
};

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CategoryForm) => void;
  initialData?: CategoryForm & { image?: string | null }; // allow backend image url for preview
  editMode?: boolean;
}

export default function CategoryModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editMode,
}: CategoryModalProps) {
  // If editing, allow previewing an existing image url (string), but form.image must remain File | null
  const [form, setForm] = useState<CategoryForm>({
    customId: initialData?.customId || "",
    name: initialData?.name || "",
    status: initialData?.status || "active",
    image: null,
  });

  // imagePreview is the url, either string (existing image url) or local file URL, or null
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.image === "string" ? initialData.image : null
  );

  useEffect(() => {
    if (open && initialData) {
      setForm({
        customId: initialData.customId,
        name: initialData.name,
        status: initialData.status,
        image: null, // File always reset on modal open
      });
      setImagePreview(
        typeof initialData.image === "string" ? initialData.image : null
      );
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setForm((f) => ({ ...f, image: file }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        // if no file selected, remove preview and file
        setForm((f) => ({ ...f, image: null }));
        setImagePreview(
          typeof initialData?.image === "string" ? initialData.image : null
        );
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold">{editMode ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} aria-label="Close" type="button" className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
    Custom ID <span className="text-error-500">*</span>
  </label>
  <input
    name="customId"
    value={form.customId}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
    placeholder="Enter Category ID"
    type="text"
    disabled={!!editMode}
  />
</div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Enter Category Name"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 rounded h-20 object-contain"
                style={{ maxWidth: "100%" }}
              />
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600">
              {editMode ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
