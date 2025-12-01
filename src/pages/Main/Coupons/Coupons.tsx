import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { toast } from "react-toastify";
import CouponTable from "./CouponsTable";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CouponModal from "./CouponsModal";
import type { CouponForm } from "./CouponsModal"; // Import CouponForm type from Modal

type Coupon = {
  _id: string;
  customId: string;
  code: string;
  name: string;
  status: string;
  level: "all" | "categories" | "subcategories";
  // Removed levelIds
  categoryIds: string[];     // Made required for type compatibility with CouponForm
  subCategoryIds: string[];  // Made required for type compatibility with CouponForm

  // New fields
  discountType: "percentage" | "fixed";
  discount: number;
  expiryDate?: string;
  minimumCartValue?: number;
};

function ensureCouponFormFields(coupon: Coupon): CouponForm {
  // Guarantee that required fields are present and non-null (with empty arrays fallback)
  return {
    ...coupon,
    categoryIds: coupon.categoryIds ?? [],
    subCategoryIds: coupon.subCategoryIds ?? [],
    // All other fields as is
  };
}

export default function ManageCoupon() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reload, setReload] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCoupon, setDeleteCoupon] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditMode, setModalEditMode] = useState(false);
  const [modalData, setModalData] = useState<Coupon | null>(null);

  // Load coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-coupons`);
        const data = await res.json();
        setCoupons((data.coupons || []).map((coupon: Coupon) => ({
          ...coupon,
          categoryIds: coupon.categoryIds ?? [],
          subCategoryIds: coupon.subCategoryIds ?? []
        })));
      } catch {
        toast.error("Failed to fetch coupons.");
      }
    };

    fetchCoupons();
  }, [reload]);

  // Create Coupon
  const handleCreate = async (form: any) => {
    try {
      // Ensure numeric fields are numbers and expiryDate is formatted correctly
      // Don't use levelIds, send categoryIds and subCategoryIds directly
      let formToSend = {
        ...form,
        discount: Number(form.discount),
        minimumCartValue:
          form.minimumCartValue === undefined || form.minimumCartValue === 0
            ? undefined
            : Number(form.minimumCartValue),

        expiryDate: form.expiryDate || undefined,
        // Remove levelIds from form if present
      };

      // Only send relevant categoryIds/subCategoryIds based on level
      if (form.level === "categories") {
        formToSend = {
          ...formToSend,
          categoryIds: form.categoryIds || [],
          subCategoryIds: [],
        };
      } else if (form.level === "subcategories") {
        // When level is subcategories, send both subCategoryIds and categoryIds
        formToSend = {
          ...formToSend,
          categoryIds: form.categoryIds || [],
          subCategoryIds: form.subCategoryIds || [],
        };
      } else {
        formToSend = {
          ...formToSend,
          categoryIds: [],
          subCategoryIds: [],
        };
      }

      delete formToSend.levelIds; // safety

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToSend),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Coupon created.");
        setModalOpen(false);
        setReload((x) => !x);
      } else {
        toast.error(data.error || "Failed to create coupon.");
      }
    } catch {
      toast.error("Error creating coupon.");
    }
  };

  // Update Coupon
  const handleUpdate = async (form: any) => {
    if (!modalData) return;

    try {
      // Ensure numeric fields are numbers and expiryDate is formatted correctly
      // Don't use levelIds, send categoryIds and subCategoryIds directly
      let formToSend = {
        ...form,
        discount: Number(form.discount),
        minimumCartValue:
          form.minimumCartValue !== undefined && form.minimumCartValue !== ""
            ? Number(form.minimumCartValue)
            : undefined,
        expiryDate: form.expiryDate || undefined,
      };

      if (form.level === "categories") {
        formToSend = {
          ...formToSend,
          categoryIds: form.categoryIds || [],
          subCategoryIds: [],
        };
      } else if (form.level === "subcategories") {
        // When level is subcategories, send both subCategoryIds and categoryIds
        formToSend = {
          ...formToSend,
          categoryIds: form.categoryIds || [],
          subCategoryIds: form.subCategoryIds || [],
        };
      } else {
        formToSend = {
          ...formToSend,
          categoryIds: [],
          subCategoryIds: [],
        };
      }

      delete formToSend.levelIds; // safety

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/edit-coupon/${modalData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formToSend),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Coupon updated.");
        setModalOpen(false);
        setReload((x) => !x);
      } else {
        toast.error(data.error || "Failed to update coupon.");
      }
    } catch {
      toast.error("Error updating coupon.");
    }
  };

  // Delete Coupon
  const handleDeleteConfirm = async () => {
    if (!deleteCoupon) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-coupon/${deleteCoupon._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        setReload((x) => !x);
      } else {
        toast.error(data.message || "Failed to delete coupon.");
      }
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteCoupon(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Coupons" description="Manage your coupons." />
      <PageBreadcrumb pageTitle="Coupons" />

      <div className="flex justify-end">
        <button
          onClick={() => {
            setModalEditMode(false);
            setModalData(null);
            setModalOpen(true);
          }}
          className="mb-4 px-4 py-2 bg-brand-500 text-white rounded"
        >
          Add Coupon
        </button>
      </div>

      <CouponModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editMode={modalEditMode}
        initialData={
          // Guarantee required CouponForm fields for type safety
          modalData ? ensureCouponFormFields(modalData) : undefined
        }
        onSubmit={modalEditMode ? handleUpdate : handleCreate}
        reloadFlag={reload}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteCoupon(null);
        }}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        coupon={deleteCoupon}
      />

      <ComponentCard title="Coupons Table">
        <CouponTable
          // key={String(reload)}
          coupons={coupons}
          onEditCoupon={(coupon) => {
            setModalEditMode(true);

            // Ensure initialData for CouponModal always has required arrays
            setModalData({
              ...coupon,
              categoryIds: coupon.categoryIds ?? [],
              subCategoryIds: coupon.subCategoryIds ?? []
            });
            setModalOpen(true);
          }}
          onDeleteCouponRequest={(coupon) => {
            setDeleteCoupon(coupon);
            setDeleteModalOpen(true);
          }}
        />
      </ComponentCard>
    </>
  );
}
