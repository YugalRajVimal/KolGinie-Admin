// import { useState, useEffect } from "react";
// import ComponentCard from "../../../components/common/ComponentCard";
// import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import PageMeta from "../../../components/common/PageMeta";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Interface for Category type including image field
// type Category = {
//   _id: string;
//   customId: string;
//   name: string;
//   status: string;
//   image?: string | null;
//   createdAt?: string;
//   updatedAt?: string;
// };

// interface CategoryModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (form: CategoryForm) => void;
//   initialData?: Partial<CategoryForm & { customId?: string }>;
//   editMode?: boolean;
// }

// type CategoryForm = {
//   customId: string;
//   name: string;
//   status: string;
//   image: File | null;
// };

// interface DeleteConfirmModalProps {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   deleting: boolean;
//   category?: Category | null;
// }
// function DeleteConfirmModal({
//   open,
//   onClose,
//   onConfirm,
//   deleting,
//   category,
// }: DeleteConfirmModalProps) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Category</h2>
//         <p className="mb-5">
//           Are you sure you want to delete the category{" "}
//           <span className="font-bold">{category?.name}</span>? This action cannot be undone.
//         </p>
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             disabled={deleting}
//             onClick={onClose}
//             className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             disabled={deleting}
//             onClick={onConfirm}
//             className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
//           >
//             {deleting ? "Deleting..." : "Delete"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CategoryModal({ open, onClose, onSubmit, initialData, editMode }: CategoryModalProps) {
//   const [form, setForm] = useState<CategoryForm>({
//     customId: initialData?.customId || "",
//     name: initialData?.name || "",
//     status: initialData?.status || "active",
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(
//     initialData && typeof initialData.image === "string" ? initialData.image : null
//   );

//   // Set initial data when edit is triggered
//   useEffect(() => {
//     if (open) {
//       setForm({
//         customId: initialData?.customId || "",
//         name: initialData?.name || "",
//         status: initialData?.status || "active",
//         image: null,
//       });
//       if (initialData && typeof initialData.image === "string" && initialData.image) {
//         setImagePreview(initialData.image
//           ? initialData.image
//           : `${import.meta.env.VITE_API_URL || ""}/${initialData.image}`);
//       } else {
//         setImagePreview(null);
//       }
//     }
//   }, [open, initialData]);

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) {
//     const { name, value, type } = e.target;
//     if (type === "file") {
//       const fileInput = e.target as HTMLInputElement;
//       const file = fileInput.files && fileInput.files[0];
//       if (file) {
//         setForm((f) => ({ ...f, image: file }));
//         setImagePreview(URL.createObjectURL(file));
//       }
//     } else {
//       setForm((f) => ({ ...f, [name]: value }));
//     }
//   }

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     onSubmit({ ...form, customId: form.customId });
//   }

//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
//         <div className="flex justify-between mb-5">
//           <h2 className="text-lg font-semibold">
//             {editMode ? "Edit Category" : "Add Category"}
//           </h2>
//           <button
//             className="text-gray-400 hover:text-gray-600"
//             onClick={onClose}
//             aria-label="Close"
//             type="button"
//           >
//             &times;
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!editMode && (
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
//                 ID <span className="text-error-500">*</span>
//               </label>
//               <input
//                 name="customId"
//                 value={form.customId}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-brand-100 dark:bg-gray-700 dark:border-gray-600"
//                 placeholder="Enter Category ID"
//                 type="text"
//                 disabled={!!editMode}
//               />
//             </div>
//           )}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
//               Name <span className="text-error-500">*</span>
//             </label>
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-brand-100 dark:bg-gray-700 dark:border-gray-600"
//               placeholder="Enter Category Name"
//               type="text"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
//               Status
//             </label>
//             <select
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-brand-100 dark:bg-gray-700 dark:border-gray-600"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
//               Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
//             />
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="mt-2 rounded h-20 object-contain"
//               />
//             )}
//           </div>
//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600"
//             >
//               {editMode ? "Update Category" : "Create Category"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Table to display all categories with image
// function CategoryTable({
//   onEditCategory,
//   onDeleteCategoryRequest,
// }: {
//   onEditCategory: (cat: Category) => void;
//   onDeleteCategoryRequest: (cat: Category) => void;
// }) {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`
//         );
//         const data = await response.json();
//         if (data.success) {
//           setCategories(data.categories);
//         } else {
//           toast.error(data.error || "Failed to load categories");
//         }
//       } catch (err: any) {
//         toast.error("Error fetching categories: " + (err?.message || ""));
//       }
//       setLoading(false);
//     };
//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <div className="px-4 py-8 text-lg">Loading...</div>;
//   }

//   if (!categories.length) {
//     return <div className="px-4 py-8 text-lg">No categories found.</div>;
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-100 dark:divide-white/[0.05]">
//           <thead className="border-b border-gray-100 dark:border-white/[0.05]">
//             <tr>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Image
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Custom ID
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Name
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Status
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Created At
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Updated At
//               </th>
//               <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {categories.map((cat) => (
//               <tr key={cat._id}>
//                 <td className="px-5 py-4 sm:px-6 text-start">
//                   {cat.image ? (
//                     <img
//                       src={
//                         cat.image.startsWith("http")
//                           ? cat.image
//                           : `${import.meta.env.VITE_API_URL || ""}/${cat.image}`
//                       }
//                       alt={cat.name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xl">
//                       <span role="img" aria-label="No image">🖼️</span>
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
//                   {cat.customId}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
//                   {cat.name}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
//                   <span
//                     className={
//                       cat.status === "active"
//                         ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
//                         : "px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
//                     }
//                   >
//                     {cat.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                   {cat.createdAt ? new Date(cat.createdAt).toLocaleString() : "-"}
//                 </td>
//                 <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                   {cat.updatedAt ? new Date(cat.updatedAt).toLocaleString() : "-"}
//                 </td>
//                 <td className="px-4 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
//                   <div className="flex space-x-2">
//                     <button
//                       className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none"
//                       title="Edit Category"
//                       onClick={() => onEditCategory(cat)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none"
//                       title="Delete Category"
//                       onClick={() => onDeleteCategoryRequest(cat)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default function ManageCategory() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editCategory, setEditCategory] = useState<Category | null>(null);

//   // use this to reload table after add/edit/delete
//   const [reloadFlag, setReloadFlag] = useState(false);

//   // For Delete Confirm Modal
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
//   const [deleting, setDeleting] = useState(false);

//   const handleModalOpen = () => {
//     setEditCategory(null);
//     setModalOpen(true);
//   };
//   const handleModalClose = () => setModalOpen(false);

//   const handleEditModalClose = () => {
//     setEditCategory(null);
//     setEditModalOpen(false);
//   };

//   const handleCategorySubmit = async (form: CategoryForm) => {
//     try {
//       const formData = new FormData();
//       formData.append('customId', form.customId);
//       formData.append('name', form.name);
//       formData.append('status', form.status);
//       if (form.image) {
//         formData.append('category', form.image);
//       }

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-category`, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.status === 200 && result.success) {
//         toast.success(result.message || "Category created successfully!");
//         setModalOpen(false);
//         setReloadFlag((flag) => !flag); // Reload table
//       } else if (response.status === 400 && result.errors) {
//         const messages = Object.values(result.errors).join(" ");
//         toast.error(messages || "Validation Error. Please check your input.");
//       } else if (response.status === 409 && result.error) {
//         toast.error(result.error || "Category with this custom ID already exists.");
//       } else if (response.status === 500 && result.error) {
//         toast.error(result.error || "Internal Server Error.");
//       } else {
//         toast.error(result.message || result.error || "Failed to create category.");
//       }
//     } catch (error: any) {
//       toast.error('Error creating category: ' + (error?.message || 'Unknown error'));
//       console.error('Error creating category:', error);
//     }
//   };

//   const handleEditCategory = (cat: Category) => {
//     setEditCategory(cat);
//     setEditModalOpen(true);
//   };

//   const handleDeleteCategoryRequest = (cat: Category) => {
//     setDeleteCategory(cat);
//     setDeleteModalOpen(true);
//   };

//   const handleDeleteCategoryConfirm = async () => {
//     if (!deleteCategory) return;
//     setDeleting(true);
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/admin/delete-category/${deleteCategory._id}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const result = await response.json();

//       if (response.status === 200 && result.success) {
//         toast.success(result.message || "Category deleted successfully!");
//         setReloadFlag((flag) => !flag); // Refresh table
//       } else if (response.status === 404 && result.error) {
//         toast.error(result.error || "Category not found.");
//       } else if (response.status === 500 && result.error) {
//         toast.error(result.error || "Internal Server Error.");
//       } else {
//         toast.error(result.message || result.error || "Failed to delete category.");
//       }
//     } catch (error: any) {
//       toast.error("Error deleting category: " + (error?.message || "Unknown error"));
//       console.error("Error deleting category:", error);
//     } finally {
//       setDeleting(false);
//       setDeleteModalOpen(false);
//       setDeleteCategory(null);
//     }
//   };

//   // Updated to match the prompt's requirements
//   const handleEditCategorySubmit = async (form: CategoryForm) => {
//     if (!editCategory) return;

//     let uploadedImagePath = null;
//     try {
//       const formData = new FormData();
//       formData.append('id', editCategory._id);

//       // Only send fields if they have values (just like backend update logic)
//       if (typeof form.name === "string" && form.name.trim() !== "") {
//         formData.append('name', form.name.trim());
//       }
//       if (typeof form.status === "string" && form.status.trim() !== "") {
//         formData.append('status', form.status.trim());
//       }
//       if (form.image) {
//         formData.append('category', form.image);
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/admin/update-category`,
//         {
//           method: 'PUT',
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (response.status === 200 && result.success) {
//         toast.success(result.message || "Category updated successfully!");
//         setEditModalOpen(false);
//         setReloadFlag((flag) => !flag); // Reload table
//         setEditCategory(null);
//       } else if (response.status === 400 && result.errors) {
//         const messages = Object.values(result.errors).join(" ");
//         toast.error(messages || "Validation Error. Please check your input.");
//       } else if (response.status === 404 && result.error) {
//         toast.error(result.error || "Category not found.");
//       } else if (response.status === 409 && result.error) {
//         toast.error(result.error || "Category with this custom ID already exists.");
//       } else if (response.status === 500 && result.error) {
//         toast.error(result.error || "Internal Server Error.");
//       } else {
//         toast.error(result.message || result.error || "Failed to update category.");
//       }
//     } catch (error: any) {
//       toast.error('Error updating category: ' + (error?.message || 'Unknown error'));
//       console.error('Error updating category:', error);
//     }
//   };

//   // A wrapper for table to force reload on flag change (key will remount table)
//   function ReloadableTable() {
//     return (
//       <CategoryTable
//         key={String(reloadFlag)}
//         onEditCategory={handleEditCategory}
//         onDeleteCategoryRequest={handleDeleteCategoryRequest}
//       />
//     );
//   }

//   return (
//     <>
//       <PageMeta
//         title="Manage Categories"
//         description="Manage your product categories on the site."
//       />
//       <PageBreadcrumb pageTitle="Categories" />
//       <div className="flex justify-end">
//         <button
//           className="mb-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 transition"
//           onClick={handleModalOpen}
//         >
//           Add Category
//         </button>
//       </div>
//       <CategoryModal
//         open={modalOpen}
//         onClose={handleModalClose}
//         onSubmit={handleCategorySubmit}
//         editMode={false}
//       />

//       <CategoryModal
//         open={editModalOpen}
//         onClose={handleEditModalClose}
//         onSubmit={handleEditCategorySubmit}
//         editMode={true}
//         initialData={
//           editCategory
//             ? {
//                 customId: editCategory.customId,
//                 name: editCategory.name,
//                 status: editCategory.status,
//                 // Ensure TypeScript accepts: image must be File | null | undefined, not string
//                 image: null,
//               }
//             : undefined
//         }
//       />

//       <DeleteConfirmModal
//         open={deleteModalOpen}
//         onClose={() => {
//           if (!deleting) { setDeleteModalOpen(false); setDeleteCategory(null); }
//         }}
//         onConfirm={handleDeleteCategoryConfirm}
//         deleting={deleting}
//         category={deleteCategory}
//       />

//       <div className="space-y-6">
//         <ComponentCard title="Category Table">
//           <ReloadableTable />
//         </ComponentCard>
//       </div>
//     </>
//   );
// }


import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CategoryTable from "./CategoryTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CategoryModal from "./CategoryModal";


// Types
type Category = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CategoryForm = {
  customId: string;
  name: string;
  status: string;
  image: File | null;
};

// Main component that wraps the entire Category Management UI
export default function ManageCategory() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleCategorySubmit = async (form: CategoryForm) => {
    try {
      const formData = new FormData();
      formData.append("customId", form.customId);
      formData.append("name", form.name);
      formData.append("status", form.status);

      if (form.image) {
        formData.append("category", form.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-category`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Category created successfully!");
        setModalOpen(false);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.message || "Failed to create category.");
      }
    } catch (error) {
      toast.error("Error creating category.");
      console.error(error);
    }
  };

  // Separate handler for editing category
  const handleEditCategorySubmit = async (form: CategoryForm) => {
    if (!editCategory) return;
    try {
      const formData = new FormData();
      formData.append("id", editCategory._id);
      formData.append("name", form.name);
      formData.append("status", form.status);
      if (form.image) {
        formData.append("category", form.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/update-category`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Category updated successfully!");
        setEditModalOpen(false);
        setEditCategory(null);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to update category.");
      }
    } catch (error) {
      toast.error("Error updating category.");
      console.error(error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setEditModalOpen(true);
  };

  const handleDeleteCategoryRequest = (category: Category) => {
    setDeleteCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCategory) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-category/${deleteCategory._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Category deleted successfully!");
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error("Error deleting category.");
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteCategory(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Categories" description="Manage your product categories." />
      <PageBreadcrumb pageTitle="Categories" />
      <div className="flex justify-end">
        <button
          className="mb-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
          onClick={handleModalOpen}
        >
          Add Category
        </button>
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleCategorySubmit}
        editMode={false}
      />

      <CategoryModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditCategorySubmit}
        editMode={true}
        initialData={
          editCategory
            ? {
                customId: editCategory.customId,
                name: editCategory.name,
                status: editCategory.status,
                image: null, // Set image to null, as the form expects a File | null
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteCategory(null);
          }
        }}
        onConfirm={handleDeleteCategoryConfirm}
        deleting={deleting}
        category={deleteCategory}
      />

      <ComponentCard title="Category Table">
        <CategoryTable
          key={String(reloadFlag)}
          onEditCategory={handleEditCategory}
          onDeleteCategoryRequest={handleDeleteCategoryRequest}
        />
      </ComponentCard>
    </>
  );
}

