import { useEffect, useState } from "react";

// Remove levelIds, rely on categoryIds and subCategoryIds only
type Coupon = {
  _id: string;
  customId: string;
  name: string;
  code: string;
  status: string;
  level: "all" | "categories" | "subcategories";
  categoryIds?: string[];
  subCategoryIds?: string[];
  discountType: "percentage" | "fixed";
  discount: number;
  expiryDate?: string;
  minimumCartValue?: number;
  createdAt?: string;
  updatedAt?: string;
};

type Category = { _id: string; name: string };
type SubCategory = { _id: string; name: string };

interface CouponTableProps {
  coupons: Coupon[];
  onEditCoupon: (coupon: Coupon) => void;
  onDeleteCouponRequest: (coupon: Coupon) => void;
}

export default function CouponTable({
  coupons,
  onEditCoupon,
  onDeleteCouponRequest,
}: CouponTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Fetch categories/subcategories (only display metadata)
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`);
        const catData = await catRes.json();
        if (catData.success) setCategories(catData.categories || []);

        const subRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-categories`
        );
        const subData = await subRes.json();
        if (subData.success) setSubCategories(subData.subcategories || []);
      } catch (_) {}
    };

    fetchLists();
  }, []);

  const getLevelNames = (coupon: Coupon) => {
    if (coupon.level === "categories") {
      return (coupon.categoryIds || [])
        .map((cid) => categories.find((c) => c._id === cid)?.name || cid)
        .join(", ") || "-";
    }

    if (coupon.level === "subcategories") {
      return (coupon.subCategoryIds || [])
        .map((sid) => subCategories.find((s) => s._id === sid)?.name || sid)
        .join(", ") || "-";
    }

    return "-";
  };

  if (!coupons.length) {
    return <div className="px-4 py-8 text-lg">No coupons found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-white/[0.05]">
          <thead>
            <tr>
              <th className="px-5 py-3 text-start text-theme-xs">Custom ID</th>
              <th className="px-5 py-3 text-start text-theme-xs">Name</th>
              <th className="px-5 py-3 text-start text-theme-xs">Code</th>
              <th className="px-5 py-3 text-start text-theme-xs">Status</th>
              <th className="px-5 py-3 text-start text-theme-xs">Level</th>
              <th className="px-5 py-3 text-start text-theme-xs">Level Names</th>
              <th className="px-5 py-3 text-start text-theme-xs">Discount Type</th>
              <th className="px-5 py-3 text-start text-theme-xs">Discount</th>
              <th className="px-5 py-3 text-start text-theme-xs">Expiry Date</th>
              <th className="px-5 py-3 text-start text-theme-xs">Minimum Cart Value</th>
              <th className="px-5 py-3 text-start text-theme-xs">Created At</th>
              <th className="px-5 py-3 text-start text-theme-xs">Updated At</th>
              <th className="px-5 py-3 text-start text-theme-xs">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="px-4 py-3">{coupon.customId || "-"}</td>
                <td className="px-4 py-3">{coupon.name || "-"}</td>
                <td className="px-4 py-3">{coupon.code}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      coupon.status === "active"
                        ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                        : "px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    }
                  >
                    {coupon.status}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize">{coupon.level}</td>
                <td className="px-4 py-3">{getLevelNames(coupon)}</td>
                <td className="px-4 py-3 capitalize">{coupon.discountType}</td>
                <td className="px-4 py-3">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discount}%`
                    : coupon.discount}
                </td>
                <td className="px-4 py-3">
                  {coupon.expiryDate
                    ? new Date(coupon.expiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  {coupon.minimumCartValue !== undefined &&
                  coupon.minimumCartValue !== null
                    ? coupon.minimumCartValue
                    : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {coupon.createdAt ? new Date(coupon.createdAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {coupon.updatedAt ? new Date(coupon.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditCoupon(coupon)}
                      className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteCouponRequest(coupon)}
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700"
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
