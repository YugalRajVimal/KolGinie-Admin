
import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmModal from "./DeleteConfirmModal";
import AttributeModal from "./AttributesModal";
import AttributeTable from "./AttributesTable";

// Types for attributes (no status, includes terms)
type Attribute = {
  _id: string;
  customId: string;
  name: string;
  terms: string[];
  createdAt?: string;
  updatedAt?: string;
};

type AttributeForm = {
  customId: string;
  name: string;
  terms: string[];
};

export default function ManageAttributes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAttribute, setEditAttribute] = useState<Attribute | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAttribute, setDeleteAttribute] = useState<Attribute | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleAttributeSubmit = async (form: AttributeForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/add-attribute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customId: form.customId,
            name: form.name,
            terms: form.terms,
          }),
        }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Attribute created successfully!");
        setModalOpen(false);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to create attribute.");
      }
    } catch (error) {
      toast.error("Error creating attribute.");
      console.error(error);
    }
  };

  // Handler for editing attribute
  const handleEditAttributeSubmit = async (form: AttributeForm) => {
    if (!editAttribute) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/update-attribute/${editAttribute._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customId: form.customId,
            name: form.name,
            terms: form.terms,
          }),
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Attribute updated successfully!");
        setEditModalOpen(false);
        setEditAttribute(null);
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to update attribute.");
      }
    } catch (error) {
      toast.error("Error updating attribute.");
      console.error(error);
    }
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditAttribute(attribute);
    setEditModalOpen(true);
  };

  const handleDeleteAttributeRequest = (attribute: Attribute) => {
    setDeleteAttribute(attribute);
    setDeleteModalOpen(true);
  };

  const handleDeleteAttributeConfirm = async () => {
    if (!deleteAttribute) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-attribute/${deleteAttribute._id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (response.status === 200 && result.success) {
        toast.success(result.message || "Attribute deleted successfully!");
        setReloadFlag((prev) => !prev);
      } else {
        toast.error(result.error || result.message || "Failed to delete attribute.");
      }
    } catch (error) {
      toast.error("Error deleting attribute.");
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteAttribute(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Attributes" description="Manage your product attributes." />
      <PageBreadcrumb pageTitle="Attributes" />
      <div className="flex justify-end">
        <button
          className="mb-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
          onClick={handleModalOpen}
        >
          Add Attribute
        </button>
      </div>

      <AttributeModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleAttributeSubmit}
        editMode={false}
      />

      <AttributeModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditAttributeSubmit}
        editMode={true}
        initialData={
          editAttribute
            ? {
                customId: editAttribute.customId,
                name: editAttribute.name,
                terms: editAttribute.terms,
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteAttribute(null);
          }
        }}
        onConfirm={handleDeleteAttributeConfirm}
        deleting={deleting}
        // category={deleteAttribute}
      />

      <ComponentCard title="Attributes Table">
        <AttributeTable
          key={String(reloadFlag)}
          onEditCategory={handleEditAttribute}
          onDeleteCategoryRequest={handleDeleteAttributeRequest}
        />
      </ComponentCard>
    </>
  );
}

