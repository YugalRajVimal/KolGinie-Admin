import { useState, useEffect } from "react";

type AttributeForm = {
  customId: string;
  name: string;
  terms: string[];
};

interface AttributeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AttributeForm) => void;
  initialData?: AttributeForm;
  editMode?: boolean;
}

export default function AttributeModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editMode,
}: AttributeModalProps) {
  const [form, setForm] = useState<AttributeForm>({
    customId: initialData?.customId || "",
    name: initialData?.name || "",
    terms: initialData?.terms || [""],
  });

  useEffect(() => {
    if (open && initialData) {
      setForm({
        customId: initialData.customId,
        name: initialData.name,
        terms: initialData.terms.length > 0 ? initialData.terms : [""],
      });
    } else if (open && !initialData) {
      setForm({
        customId: "",
        name: "",
        terms: [""],
      });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleTermChange = (index: number, value: string) => {
    setForm((f) => {
      const terms = [...f.terms];
      terms[index] = value;
      return { ...f, terms };
    });
  };

  const handleAddTerm = () => {
    setForm((f) => ({ ...f, terms: [...f.terms, ""] }));
  };

  const handleRemoveTerm = (index: number) => {
    setForm((f) => {
      const terms = [...f.terms];
      terms.splice(index, 1);
      return { ...f, terms: terms.length > 0 ? terms : [""] };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...form,
      terms: form.terms.map((t) => t.trim()).filter((t) => t.length > 0),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold">{editMode ? "Edit Attribute" : "Add Attribute"}</h2>
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
              placeholder="Enter Attribute ID"
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
              placeholder="Enter Attribute Name"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Terms <span className="text-error-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {form.terms.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                    value={term}
                    onChange={(e) => handleTermChange(idx, e.target.value)}
                    placeholder="Enter term"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTerm()}
                    className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                    title="Add term"
                  >
                    +
                  </button>
                  {form.terms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(idx)}
                      className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      title="Remove term"
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Add or remove terms using "+" and "−" buttons.
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600">
              {editMode ? "Update Attribute" : "Create Attribute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
