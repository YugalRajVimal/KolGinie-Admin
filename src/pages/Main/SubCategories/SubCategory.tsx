import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CategoryTable from "./SubCategoryTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CategoryModal from "./SubCategoryModal";

// Types
type SubCategory = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type SubCategoryForm = {
  customId: string;
  name: string;
  status: string;
  category:string;
  image: File | null;
};

// Main component that wraps the entire Category Management UI
export default function ManageSubCategory() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState<SubCategory | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubCategory, setDeleteSubCategory] = useState<SubCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Store the fetched subcategories
  // const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  // const [loading, setLoading] = useState(true);

  // Fetch subcategories when the component is mounted or reloadFlag changes
  // useEffect(() => {
  //   const fetchSubCategories = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-categories`
  //       );
  //       const data = await response.json();
  //       if (data.success) {
  //         setSubCategories(data.subcategories || []);
  //       } else {
  //         toast.error(data.error || "Failed to load subcategories");
  //       }
  //     } catch (err: any) {
  //       toast.error(
  //         "Error fetching subcategories: " +
  //           (typeof err === "object" && err && "message" in err ? err.message : String(err))
  //       );
  //     }
  //     setLoading(false);
  //   };
  //   fetchSubCategories();
  // }, [reloadFlag]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleSubCategorySubmit = async (form: SubCategoryForm) => {
    try {
      const formData = new FormData();
      formData.append("customId", form.customId);
      formData.append("name", form.name);
      formData.append("status", form.status);
      formData.append("category", form.category);


      if (form.image) {
        formData.append("sub-category", form.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-sub-category`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Sub Category created successfully!");
        setModalOpen(false);
        setReloadFlag((prev) => !prev); // Trigger reload
      } else {
        toast.error(result.message || "Failed to create sub category.");
      }
    } catch (error) {
      toast.error("Error creating sub category.");
      console.error(error);
    }
  };

  const handleEditSubCategorySubmit = async (form: SubCategoryForm) => {
    if (!editSubCategory) return;
    try {
      const formData = new FormData();
      formData.append("id", editSubCategory._id);
      formData.append("name", form.name);
      formData.append("status", form.status);
      if (form.image) {
        formData.append("category", form.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/update-sub-category`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || " Sub Category updated successfully!");
        setEditModalOpen(false);
        setEditSubCategory(null);
        setReloadFlag((prev) => !prev); // Trigger reload
      } else {
        toast.error(result.error || result.message || "Failed to update Sub category.");
      }
    } catch (error) {
      toast.error("Error updating Sub category.");
      console.error(error);
    }
  };

  const handleDeleteSubCategoryConfirm = async () => {
    if (!deleteSubCategory) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-sub-category/${deleteSubCategory._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Sub Category deleted successfully!");
        setReloadFlag((prev) => !prev); // Trigger reload
      } else {
        toast.error(result.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error("Error deleting category.");
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteSubCategory(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Sub Categories" description="Manage your product Sub Categories." />
      <PageBreadcrumb pageTitle="Sub Categories" />
      <div className="flex justify-end">
        <button
          className="mb-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
          onClick={handleModalOpen}
        >
          Add Sub Category
        </button>
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubCategorySubmit}
        editMode={false}
      />

      <CategoryModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubCategorySubmit}
        editMode={true}
        initialData={
          editSubCategory
            ? {
                customId: editSubCategory.customId,
                name: editSubCategory.name,
                status: editSubCategory.status,
                image: null, // Set image to null, as the form expects a File | null
                category: (editSubCategory as any).category ?? "",
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteSubCategory(null);
          }
        }}
        onConfirm={handleDeleteSubCategoryConfirm}
        deleting={deleting}
        subCategory={deleteSubCategory}
      />

      <ComponentCard title="Sub Category Table">
        <CategoryTable
          key={String(reloadFlag)}

          // subCategories={subCategories}  // Pass subcategories as a prop
          // loading={loading}
          onEditSubCategory={(category) => {
            setEditSubCategory(category);
            setEditModalOpen(true);
          }}
          onDeleteSubCategoryRequest={(category) => {
            setDeleteSubCategory(category);
            setDeleteModalOpen(true);
          }}
        />
      </ComponentCard>
    </>
  );
}
