import { useState, useEffect } from "react";

type TagForm = {
  customId: string;
  name: string;
  status: string;
};

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: TagForm) => void;
  initialData?: TagForm;
  editMode?: boolean;
}

export default function TagModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editMode,
}: TagModalProps) {
  const [form, setForm] = useState<TagForm>({
    customId: initialData?.customId || "",
    name: initialData?.name || "",
    status: initialData?.status || "active",
  });

  useEffect(() => {
    if (open && initialData) {
      setForm({
        customId: initialData.customId,
        name: initialData.name,
        status: initialData.status,
      });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
          <h2 className="text-lg font-semibold">{editMode ? "Edit Tag" : "Add Tag"}</h2>
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
              placeholder="Enter Tag ID"
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
              placeholder="Enter Tag Name"
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

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600">
              {editMode ? "Update Tag" : "Create Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
