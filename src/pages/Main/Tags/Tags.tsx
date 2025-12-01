
import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmModal from "./DeleteConfirmModal";
import TagModal from "./TagsModal";
import TagTable from "./TagsTable";

// Types for tags (no image field)
type Tag = {
  _id: string;
  customId: string;
  name: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type TagForm = {
  customId: string;
  name: string;
  status: string;
};

// Main component for Tag Management UI (no image field)
export default function ManageTags() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleTagSubmit = async (form: TagForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-tag`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customId: form.customId,
            name: form.name,
            status: form.status,
          }),
        }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Tag created successfully!");
        setModalOpen(false);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to create tag.");
      }
    } catch (error) {
      toast.error("Error creating tag.");
      console.error(error);
    }
  };

  // Handler for editing tag
  const handleEditTagSubmit = async (form: TagForm) => {
    if (!editTag) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/update-tag/${editTag._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customId: form.customId,
            name: form.name,
            status: form.status,
          }),
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Tag updated successfully!");
        setEditModalOpen(false);
        setEditTag(null);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to update tag.");
      }
    } catch (error) {
      toast.error("Error updating tag.");
      console.error(error);
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditTag(tag);
    setEditModalOpen(true);
  };

  const handleDeleteTagRequest = (tag: Tag) => {
    setDeleteTag(tag);
    setDeleteModalOpen(true);
  };

  const handleDeleteTagConfirm = async () => {
    if (!deleteTag) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-tag/${deleteTag._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Tag deleted successfully!");
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to delete tag.");
      }
    } catch (error) {
      toast.error("Error deleting tag.");
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTag(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Tags" description="Manage your product tags." />
      <PageBreadcrumb pageTitle="Tags" />
      <div className="flex justify-end">
        <button
          className="mb-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
          onClick={handleModalOpen}
        >
          Add Tag
        </button>
      </div>

      <TagModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleTagSubmit}
        editMode={false}
      />

      <TagModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditTagSubmit}
        editMode={true}
        initialData={
          editTag
            ? {
                customId: editTag.customId,
                name: editTag.name,
                status: editTag.status,
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteTag(null);
          }
        }}
        onConfirm={handleDeleteTagConfirm}
        deleting={deleting}
        // category={deleteTag}
      />

      <ComponentCard title="Tags Table">
        <TagTable
          key={String(reloadFlag)}
          onEditCategory={handleEditTag}
          onDeleteCategoryRequest={handleDeleteTagRequest}
        />
      </ComponentCard>
    </>
  );
}

