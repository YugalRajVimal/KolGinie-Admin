// Define Category type for use in this file (minimal typing based on usage)
type Category = {
  name?: string;
  [key: string]: any;
};

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  category?: Category | null;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  deleting,
  category,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Category</h2>
        <p className="mb-5">
          Are you sure you want to delete the category{" "}
          <span className="font-bold">{category?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
