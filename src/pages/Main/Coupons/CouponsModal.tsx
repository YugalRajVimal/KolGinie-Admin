// import { useEffect, useState } from "react";
// import Input from "../../../components/form/input/InputField";
// import Radio from "../../../components/form/input/Radio";
// import MultiSelect from "../../../components/form/MultiSelect";

// type Category = { _id: string; name: string };
// type SubCategory = { _id: string; name: string; category?: string };

// export type CouponForm = {
//   customId: string;
//   code: string;
//   name: string;
//   status: string;
//   level: "all" | "categories" | "subcategories";
//   categoryIds: string[];
//   subCategoryIds: string[];
//   discountType: "percentage" | "fixed";
//   discount: number;
//   expiryDate?: string;
//   minimumCartValue?: number;
// };

// interface CouponModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (form: CouponForm) => void;
//   initialData?: CouponForm;
//   editMode?: boolean;
//   reloadFlag?: boolean;
// }

// export default function CouponModal({
//   open,
//   onClose,
//   onSubmit,
//   initialData,
//   editMode,
//   reloadFlag,
// }: CouponModalProps) {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

//   const [selectedCategoriesForSubCat, setSelectedCategoriesForSubCat] = useState<string[]>([]);
//   const [selectedSubCategoriesForSubCat, setSelectedSubCategoriesForSubCat] = useState<string[]>([]);

//   // Default CouponForm, now using categoryIds and subCategoryIds.
//   const defaultFormState: CouponForm = {
//     customId: "",
//     code: "",
//     name: "",
//     status: "active",
//     level: "all",
//     categoryIds: [],
//     subCategoryIds: [],
//     discountType: "percentage",
//     discount: 0,
//     expiryDate: "",
//     minimumCartValue: undefined,
//   };

//   const [form, setForm] = useState<CouponForm>(defaultFormState);

//   // Load Initial Data on open & also reloadFlag
//   useEffect(() => {
//     if (!open) return;

//     // ⛔ Prevent premature running when editing subcategories (data not loaded yet)
//     if (initialData && initialData.level === "subcategories") {
//       if (subCategories.length === 0) return;
//     }

//     if (initialData) {
//       setForm({
//         ...defaultFormState,
//         ...initialData,
//         discount: typeof initialData.discount === "number"
//           ? initialData.discount
//           : Number(initialData.discount ?? 0),
//         minimumCartValue:
//           typeof initialData.minimumCartValue === "number"
//             ? initialData.minimumCartValue
//             : initialData.minimumCartValue === undefined
//               ? undefined
//               : Number(initialData.minimumCartValue),
//       });

//       if (initialData.level === "categories") {
//         setForm(prev => ({
//           ...prev,
//           categoryIds: initialData.categoryIds ?? [],
//           subCategoryIds: [],
//         }));
//       }

//       if (initialData.level === "subcategories") {
//         const usedSubCatIds = initialData.subCategoryIds ?? [];
//         const derivedCatsRaw = subCategories
//           .filter(sc => usedSubCatIds.includes(sc._id))
//           .map(sc => sc.category);

//         const derivedCats = [...new Set(derivedCatsRaw)].filter((x): x is string => !!x);

//         setSelectedCategoriesForSubCat(derivedCats);
//         setSelectedSubCategoriesForSubCat(usedSubCatIds);

//         // On edit, populate both categoryIds and subCategoryIds for subcategories mode
//         setForm(prev => ({
//           ...prev,
//           categoryIds: derivedCats,
//           subCategoryIds: usedSubCatIds,
//         }));
//       }
//     } else {
//       setForm({ ...defaultFormState });
//       setSelectedCategoriesForSubCat([]);
//       setSelectedSubCategoriesForSubCat([]);
//     }
//   }, [open, initialData, reloadFlag, subCategories]);


//   // Fetch categories
//   useEffect(() => {
//     if (!open) return;
//     if (form.level === "all") return;

//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`)
//       .then((res) => res.json())
//       .then((res) => setCategories(res.categories || []));
//   }, [open, form.level, reloadFlag]);

//   // Fetch subcategories: ALL when level=categories
//   useEffect(() => {
//     if (!open) return;
//     if (form.level !== "categories") return;

//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-categories`)
//       .then((res) => res.json())
//       .then((res) => setSubCategories(res.subcategories || []));
//   }, [open, form.level, reloadFlag]);

//   // Fetch subcategories per selected category when level=subcategories
//   useEffect(() => {
//     if (!open) return;
//     if (form.level !== "subcategories") return;

//     if (selectedCategoriesForSubCat.length === 0) {
//       setSubCategories([]);
//       setSelectedSubCategoriesForSubCat([]);
//       return;
//     }

//     Promise.all(
//       selectedCategoriesForSubCat.map((catId) =>
//         fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-sub-categories-by-category/${catId}`).then((r) => r.json())
//       )
//     ).then((results) => {
//       const merged = results.flatMap((x) => x.subcategories || []);
//       setSubCategories(merged);
//     });
//   }, [open, form.level, selectedCategoriesForSubCat, reloadFlag]);

//   const handleSubmit = (e: any) => {
//     e.preventDefault();

//     // Prepare output structure to use categoryIds & subCategoryIds only
//     let finalForm: CouponForm;
//     if (form.level === "all") {
//       finalForm = {
//         ...form,
//         categoryIds: [],
//         subCategoryIds: [],
//         discount: typeof form.discount === "string" ? Number(form.discount) : form.discount,
//         minimumCartValue:
//           form.minimumCartValue === undefined || form.minimumCartValue === 0
//             ? undefined
//             : typeof form.minimumCartValue === "string"
//             ? Number(form.minimumCartValue)
//             : form.minimumCartValue,
//       };
//     } else if (form.level === "categories") {
//       finalForm = {
//         ...form,
//         categoryIds: form.categoryIds, // selected categories
//         subCategoryIds: [],
//         discount: typeof form.discount === "string" ? Number(form.discount) : form.discount,
//         minimumCartValue:
//           form.minimumCartValue === undefined || form.minimumCartValue === 0
//             ? undefined
//             : typeof form.minimumCartValue === "string"
//             ? Number(form.minimumCartValue)
//             : form.minimumCartValue,
//       };
//     } else if (form.level === "subcategories") {
//       // Always send categoryIds as well!
//       finalForm = {
//         ...form,
//         categoryIds: selectedCategoriesForSubCat,
//         subCategoryIds: selectedSubCategoriesForSubCat,
//         discount: typeof form.discount === "string" ? Number(form.discount) : form.discount,
//         minimumCartValue:
//           form.minimumCartValue === undefined || form.minimumCartValue === 0
//             ? undefined
//             : typeof form.minimumCartValue === "string"
//             ? Number(form.minimumCartValue)
//             : form.minimumCartValue,
//       };
//     } else {
//       // fallback - should never happen
//       finalForm = { ...form };
//     }

//     onSubmit(finalForm);
//   };

//   if (!open) return null;

//   const categoryOptions = categories.map((c) => ({ text: c.name, value: c._id }));

//   const filteredSubCats =
//     form.level === "subcategories"
//       ? subCategories
//           .filter((sc) =>
//             selectedCategoriesForSubCat.includes(
//               typeof sc.category === "string" ? sc.category : (sc.category as any)?._id
//             )
//           )
//           .map((sc) => ({ text: sc.name, value: sc._id }))
//       : [];

//   return (
//     <div
//       key={String(reloadFlag)}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
//       >
//         {/* HEADER */}
//         <div className="flex justify-between">
//           <h2 className="text-lg font-semibold">{editMode ? "Edit Coupon" : "Add Coupon"}</h2>
//           <button type="button" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         {/* Fields */}
//         <Input
//           value={form.customId}
//           placeholder="Custom ID"
//           onChange={(e) => setForm({ ...form, customId: e.target.value })}
//         />

//         <Input
//           value={form.name}
//           placeholder="Coupon Name"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         <Input
//           value={form.code}
//           placeholder="Coupon Code"
//           onChange={(e) => setForm({ ...form, code: e.target.value })}
//         />

//         {/* Discount Type */}
//         <div>
//           <label className="block font-medium text-sm mb-1">Discount Type</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={form.discountType}
//             onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })}
//           >
//             <option value="percentage">Percentage</option>
//             <option value="fixed">Fixed</option>
//           </select>
//         </div>

//         <Input
//           type="number"
//           value={form.discount}  // ← REQUIRED
//           placeholder={form.discountType === "percentage" ? "Discount %" : "Discount Amount"}
//           min="0"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               discount: e.target.value === "" ? 0 : Number(e.target.value),
//             })
//           }
//         />

//         <Input
//           type="date"
//           value={form.expiryDate ? form.expiryDate.split("T")[0] : ""}
//           placeholder="Expiry Date"
//           onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
//         />

//         <Input
//           type="number"
//           value={form.minimumCartValue === undefined ? "" : form.minimumCartValue}
//           placeholder="Minimum Cart Value"
//           min="0"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               minimumCartValue:
//                 e.target.value === "" ? undefined : Number(e.target.value),
//             })
//           }
//         />

//         <select
//           className="w-full p-2 border rounded"
//           value={form.status}
//           onChange={(e) => setForm({ ...form, status: e.target.value })}
//         >
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>

//         {/* LEVEL */}
//         <div className="flex gap-4">
//           <Radio
//             id="all"
//             name="level"
//             value="all"
//             checked={form.level === "all"}
//             label="All"
//             onChange={() => {
//               setForm({ ...form, level: "all", categoryIds: [], subCategoryIds: [] });
//               setSelectedCategoriesForSubCat([]);
//               setSelectedSubCategoriesForSubCat([]);
//             }}
//           />
//           <Radio
//             id="cat"
//             name="level"
//             value="categories"
//             checked={form.level === "categories"}
//             label="Categories"
//             onChange={() => {
//               setForm({ ...form, level: "categories", categoryIds: [], subCategoryIds: [] });
//               setSelectedCategoriesForSubCat([]);
//               setSelectedSubCategoriesForSubCat([]);
//             }}
//           />
//           <Radio
//             id="subcat"
//             name="level"
//             value="subcategories"
//             checked={form.level === "subcategories"}
//             label="Subcategories"
//             onChange={() => {
//               setForm({ ...form, level: "subcategories", categoryIds: [], subCategoryIds: [] });
//               setSelectedCategoriesForSubCat([]);
//               setSelectedSubCategoriesForSubCat([]);
//             }}
//           />
//         </div>

//         {form.level === "categories" && (
//           <MultiSelect
//             label="Select Categories"
//             options={categoryOptions}
//             defaultSelected={form.categoryIds}
//             onChange={(values) => setForm({ ...form, categoryIds: values })}
//           />
//         )}

//         {form.level === "subcategories" && (
//           <>
//             <MultiSelect
//               label="Select Categories"
//               options={categoryOptions}
//               defaultSelected={selectedCategoriesForSubCat}
//               onChange={(values) => {
//                 setSelectedCategoriesForSubCat(values);
//                 setSelectedSubCategoriesForSubCat([]);
//               }}
//             />

//             <MultiSelect
//               label="Select Subcategories"
//               options={filteredSubCats}
//               defaultSelected={selectedSubCategoriesForSubCat}
//               onChange={(values) => setSelectedSubCategoriesForSubCat(values)}
//               disabled={selectedCategoriesForSubCat.length === 0}
//             />
//           </>
//         )}

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-2">
//           <button type="button" onClick={onClose}>
//             Cancel
//           </button>
//           <button type="submit" className="bg-brand-500 text-white px-4 py-2 rounded">
//             {editMode ? "Update" : "Create"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
 import { useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Radio from "../../../components/form/input/Radio";
import MultiSelect from "../../../components/form/MultiSelect";

type Category = { _id: string; name: string };
type SubCategory = { _id: string; name: string; category?: string };

export type CouponForm = {
  customId: string;
  code: string;
  name: string;
  status: string;
  level: "all" | "categories" | "subcategories";
  levelIds: string[];
  discountType: "percentage" | "fixed";
  discount: number;
  expiryDate?: string;
  minimumCartValue?: number;
};

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CouponForm) => void;
  initialData?: CouponForm;
  editMode?: boolean;
  reloadFlag?: boolean;
}

export default function CouponModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editMode,
  reloadFlag,
}: CouponModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [selectedCategoriesForSubCat, setSelectedCategoriesForSubCat] = useState<string[]>([]);
  const [selectedSubCategoriesForSubCat, setSelectedSubCategoriesForSubCat] = useState<string[]>([]);

  // Default CouponForm, matching used types from Coupons.tsx and including types for numbers.
  const defaultFormState: CouponForm = {
    customId: "",
    code: "",
    name: "",
    status: "active",
    level: "all",
    levelIds: [],
    discountType: "percentage",
    discount: 0,
    expiryDate: "",
    minimumCartValue: undefined,
  };

  const [form, setForm] = useState<CouponForm>(defaultFormState);

  // Load Initial Data on open & also reloadFlag
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        ...defaultFormState,
        ...initialData,
        discount: typeof initialData.discount === "number"
          ? initialData.discount
          : Number(initialData.discount ?? 0),
        minimumCartValue: typeof initialData.minimumCartValue === "number"
          ? initialData.minimumCartValue
          : initialData.minimumCartValue === undefined
            ? undefined
            : Number(initialData.minimumCartValue),
      });

      if (initialData.level === "subcategories") {
        setSelectedSubCategoriesForSubCat(initialData.levelIds);
      }
    } else {
      setForm({ ...defaultFormState });
      setSelectedCategoriesForSubCat([]);
      setSelectedSubCategoriesForSubCat([]);
    }
  }, [open, initialData, reloadFlag]);

  // Fetch categories
  useEffect(() => {
    if (!open) return;
    if (form.level === "all") return;

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`)
      .then((res) => res.json())
      .then((res) => setCategories(res.categories || []));
  }, [open, form.level, reloadFlag]);

  // Fetch subcategories: ALL when level=categories
  useEffect(() => {
    if (!open) return;
    if (form.level !== "categories") return;

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-categories`)
      .then((res) => res.json())
      .then((res) => setSubCategories(res.subcategories || []));
  }, [open, form.level, reloadFlag]);

  // Fetch subcategories per selected category when level=subcategories
  useEffect(() => {
    if (!open) return;
    if (form.level !== "subcategories") return;

    if (selectedCategoriesForSubCat.length === 0) {
      setSubCategories([]);
      setSelectedSubCategoriesForSubCat([]);
      return;
    }

    Promise.all(
      selectedCategoriesForSubCat.map((catId) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-sub-categories-by-category/${catId}`).then((r) => r.json())
      )
    ).then((results) => {
      const merged = results.flatMap((x) => x.subcategories || []);
      setSubCategories(merged);
    });
  }, [open, form.level, selectedCategoriesForSubCat, reloadFlag]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const finalForm: CouponForm = {
      ...form,
      levelIds: form.level === "subcategories" ? selectedSubCategoriesForSubCat : form.levelIds,
      discount: typeof form.discount === "string" ? Number(form.discount) : form.discount,
      minimumCartValue:
        form.minimumCartValue === undefined || form.minimumCartValue === 0
          ? undefined
          : typeof form.minimumCartValue === "string"
          ? Number(form.minimumCartValue)
          : form.minimumCartValue,
    };

    onSubmit(finalForm);
  };

  if (!open) return null;

  const categoryOptions = categories.map((c) => ({ text: c.name, value: c._id }));

  const filteredSubCats =
    form.level === "subcategories"
      ? subCategories
          .filter((sc) =>
            selectedCategoriesForSubCat.includes(
              typeof sc.category === "string" ? sc.category : (sc.category as any)?._id
            )
          )
          .map((sc) => ({ text: sc.name, value: sc._id }))
      : [];

  return (
    <div
      key={String(reloadFlag)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        {/* HEADER */}
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">{editMode ? "Edit Coupon" : "Add Coupon"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Fields */}
        <Input
          value={form.customId}
          placeholder="Custom ID"
          onChange={(e) => setForm({ ...form, customId: e.target.value })}
        />

        <Input
          value={form.name}
          placeholder="Coupon Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          value={form.code}
          placeholder="Coupon Code"
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        {/* Discount Type */}
        <div>
          <label className="block font-medium text-sm mb-1">Discount Type</label>
          <select
            className="w-full p-2 border rounded"
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <Input
          type="number"
          
          placeholder={form.discountType === "percentage" ? "Discount %" : "Discount Amount"}
          min="0"
          onChange={(e) =>
            setForm({
              ...form,
              discount: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
        />


        <Input
          type="date"
          value={form.expiryDate ? form.expiryDate.split("T")[0] : ""}
          placeholder="Expiry Date"
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />

        <Input
          type="number"
          value={form.minimumCartValue === undefined ? "" : form.minimumCartValue}
          placeholder="Minimum Cart Value"
          min="0"
          onChange={(e) =>
            setForm({
              ...form,
              minimumCartValue:
                e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        />


        <select
          className="w-full p-2 border rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* LEVEL */}
        <div className="flex gap-4">
          <Radio
            id="all"
            name="level"
            value="all"
            checked={form.level === "all"}
            label="All"
            onChange={() => {
              setForm({ ...form, level: "all", levelIds: [] });
              setSelectedCategoriesForSubCat([]);
              setSelectedSubCategoriesForSubCat([]);
            }}
          />
          <Radio
            id="cat"
            name="level"
            value="categories"
            checked={form.level === "categories"}
            label="Categories"
            onChange={() => {
              setForm({ ...form, level: "categories", levelIds: [] });
              setSelectedCategoriesForSubCat([]);
              setSelectedSubCategoriesForSubCat([]);
            }}
          />
          <Radio
            id="subcat"
            name="level"
            value="subcategories"
            checked={form.level === "subcategories"}
            label="Subcategories"
            onChange={() => {
              setForm({ ...form, level: "subcategories", levelIds: [] });
              setSelectedCategoriesForSubCat([]);
              setSelectedSubCategoriesForSubCat([]);
            }}
          />
        </div>

        {form.level === "categories" && (
          <MultiSelect
            label="Select Categories"
            options={categoryOptions}
            defaultSelected={form.levelIds}
            onChange={(values) => setForm({ ...form, levelIds: values })}
          />
        )}

        {form.level === "subcategories" && (
          <>
          <div className="z-50 ">
            <MultiSelect
              label="Select Categories"
              options={categoryOptions}
              defaultSelected={selectedCategoriesForSubCat}
              onChange={(values) => {
                setSelectedCategoriesForSubCat(values);
                setSelectedSubCategoriesForSubCat([]);
              }}
            />
</div>

<MultiSelect
              label="Select Subcategories"
              options={filteredSubCats}
              defaultSelected={selectedSubCategoriesForSubCat}
              onChange={(values) => setSelectedSubCategoriesForSubCat(values)}
              disabled={selectedCategoriesForSubCat.length === 0}
            />

           
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bg-brand-500 text-white px-4 py-2 rounded">
            {editMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
} 