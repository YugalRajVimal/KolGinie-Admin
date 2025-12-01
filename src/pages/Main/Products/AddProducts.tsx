import  { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import MultiSelect from "../../../components/form/MultiSelect";
import Select from "../../../components/form/Select";
import Radio from "../../../components/form/input/Radio";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";


type Attribute = {
  _id: string;
  customId: string;
  name: string;
  terms: string[]; // array of terms
  createdAt?: string;
  updatedAt?: string;
};

type SelectedAttributeValues = {
  [attributeId: string]: string;
};

export default function AddProducts() {

    const { id } = useParams(); 
const isEditMode = Boolean(id);



  // --- Core Product State ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([""]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<SelectedAttributeValues>({});
  const [selectedValue, setSelectedValue] = useState("publish"); // status
  const [additionalFields, setAdditionalFields] = useState([{ key: "", value: "" }]);
  const [processing, setProcessing] = useState(false);

  // --- Fetch all categories on mount ---
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-categories`
        );
        const data = await response.json();
        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
          toast.error("No categories found.");
        }
      } catch (error: any) {
        setCategories([]);
        toast.error(
          "Failed to fetch categories: " +
            (typeof error === "object" && error && "message" in error ? error.message : String(error))
        );
      }
    }
    fetchCategories();
  }, []);

  // --- Fetch subcategories for selected category ---
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSubCategories([]);
      return;
    }
    async function fetchAll() {
      try {
        const finalList: any[] = [];
        for (const catId of selectedCategories) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/admin/get-sub-categories-by-category/${catId}`
            );
            const data = await res.json();
            if (Array.isArray(data.subcategories)) {
              finalList.push(...data.subcategories);
            } else {
              toast.error("No subcategories found for selected category.");
            }
          } catch (err: any) {
            toast.error(
              "Failed to fetch subcategories: " +
                (typeof err === "object" && err && "message" in err ? err.message : String(err))
            );
          }
        }
        setSubCategories(finalList);
      } catch (error: any) {
        setSubCategories([]);
        toast.error(
          "Failed to fetch subcategories: " +
            (typeof error === "object" && error && "message" in error ? error.message : String(error))
        );
      }
    }
    fetchAll();
  }, [selectedCategories]);

  // --- Fetch and display all tags ---
  useEffect(() => {
    async function fetchAllTags() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-tags`
        );
        const data = await response.json();
        if (data && Array.isArray(data.tags)) {
          setTags(data.tags);
        } else {
          setTags([]);
          toast.error("No tags found.");
        }
      } catch (err: any) {
        setTags([]);
        toast.error(
          "Failed to fetch tags: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
    }
    fetchAllTags();
  }, []);


  
  

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-attributes`
        );
        const data = await response.json();
        if (data.success) {
          setAttributes(data.attributes);
        } else {
          toast.error(data.error || "Failed to load attributes");
        }
      } catch (err: any) {
        toast.error(
          "Error fetching attributes: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
    };
    fetchAttributes();
  }, []);

  const categoryOptions = categories.map((c: any) => ({
    value: c._id,
    text: c.name,
  }));
  const subCategoryOptions = subCategories.map((s: any) => ({
    value: s._id,
    text: s.name,
  }));
  const tagOptions = tags.map((t: any) => ({
    value: t._id,
    text: t.name,
  }));

  // --- Dynamic Additional Info ---
  const handleFieldChange = (i: number, k: "key" | "value", v: string) => {
    setAdditionalFields((prev) =>
      prev.map((f, idx) => (i === idx ? { ...f, [k]: v } : f))
    );
  };

  const addField = () => setAdditionalFields((p) => [...p, { key: "", value: "" }]);
  const removeField = (i: number) =>
    setAdditionalFields((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));

  // --- Gallery Images ---
  const handleGalleryChange = (i: number, url: string) => {
    setGalleryImages((prev) => prev.map((g, idx) => (i === idx ? url : g)));
  };

  const addGallery = () => setGalleryImages((p) => [...p, ""]);
  const removeGallery = (i: number) =>
    setGalleryImages((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));

  // --- Attribute Select Handlers ---
  const handleAttributeSelect = (attributeId: string, value: string) => {
    setSelectedAttributeValues((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  // --- Submit Handler ---
  const handleCreateProduct = async () => {
    if (processing) {
      toast.warn("A product is already being created. Please wait...");
      return;
    }
    setProcessing(true);
    let toastId: any = null;
    try {
      // Minimal client field validation
      if (!title.trim()) {
        toast.error("Product title is required.");
        setProcessing(false);
        return;
      }
      if (!sku.trim()) {
        toast.error("SKU is required.");
        setProcessing(false);
        return;
      }
      if (!price.trim() || isNaN(Number(price))) {
        toast.error("Valid regular price is required.");
        setProcessing(false);
        return;
      }
      if (!mainImageUrl.trim()) {
        toast.warn("A main image URL is recommended for all products.");
      }

      // Prepare formatted attributes
      const formattedAttributes = Object.entries(selectedAttributeValues)
        .filter(([, v]) => v && v.length > 0)
        .map(([id, value]) => ({ attributeId: id, value }));

      const body = {
        name: title.trim(),
        description,
        productSKU: sku,
        regularPrice: Number(price),
        salePrice: Number(salePrice),
        itemsInStock: Number(stock),
        mainImage: mainImageUrl,
        galleryImages: galleryImages.filter(Boolean),
        categories: selectedCategories,
        subCategories: selectedSubCategories,
        tags: selectedTags,
        attributes: formattedAttributes,
        status: selectedValue,
        additionalInformation: additionalFields.filter((f) => f.key && f.value),
      };

      toastId = toast.loading("Creating product... Please wait.");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        // Could not parse JSON
        toast.update(toastId, {
          render: `Server error: Could not parse response.`,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
        setProcessing(false);
        return;
      }

      // Processing all possible status codes/errors coming from admin.controller.js
      if (res.status === 200 && data.success) {
        toast.update(toastId, {
          render: "Product created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2500,
        });
        // Optionally clear the form
        setTitle("");
        setDescription("");
        setSku("");
        setPrice("");
        setSalePrice("");
        setStock("");
        setMainImageUrl("");
        setGalleryImages([""]);
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setSelectedTags([]);
        setSelectedAttributeValues({});
        setAdditionalFields([{ key: "", value: "" }]);
        setSelectedValue("publish");
      } else if (res.status === 400 && data?.errors) {
        // Validation errors (structured, field-based)
        const messages: string[] = [];
        Object.entries(data.errors).forEach(([field, msgOrArr]: any) => {
          if (Array.isArray(msgOrArr)) {
            messages.push(...msgOrArr.map((m) => `[${field}] ${m}`));
          } else if (typeof msgOrArr === "string") {
            messages.push(`[${field}] ${msgOrArr}`);
          }
        });
        toast.update(toastId, {
          render: messages.length ? messages.join(" | ") : "Validation error. Please check your input.",
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
      } else if (res.status === 400 && data?.error) {
        // Single error message (duplicate SKU, etc.)
        toast.update(toastId, {
          render: `Error: ${data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } else if (res.status === 500) {
        toast.update(toastId, {
          render: data?.error ? `Server error: ${data.error}` : "Internal server error.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        // catch-all for unexpected statuses (network error shouldn't occur here but just in case)
        toast.update(toastId, {
          render:
            (data?.error && `Error: ${data.error}`) ||
            `Unexpected response [${res.status}]: ${res.statusText || JSON.stringify(data)}`,
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
      }
    } catch (err: any) {
      if (toastId) {
        toast.update(toastId, {
          render:
            "Error creating product: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err)),
          type: "error",
          isLoading: false,
          autoClose: 6000,
        });
      } else {
        toast.error(
          "Error creating product: " +
            (typeof err === "object" && err && "message" in err ? err.message : String(err))
        );
      }
    } finally {
      setProcessing(false);
    }
  };



  useEffect(() => {
    if (!isEditMode) return;
  
    async function fetchProduct() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get-product/${id}`);
        const data = await res.json();
  
        if (data.success) {
          const p = data.product;
  
          setTitle(p.name);
          setDescription(p.description || "");
          setSku(p.productSKU || "");
          setPrice(String(p.regularPrice || ""));
          setSalePrice(String(p.salePrice || ""));
          setStock(String(p.itemsInStock || ""));
          setMainImageUrl(p.mainImage || "");
          setGalleryImages(p.galleryImages?.length ? p.galleryImages : [""]);
  
          // 🔥 Only set SELECTED VALUES, not master lists
          setSelectedCategories(p.categories?.map((c: any) => c._id) || []);
          setSelectedSubCategories(p.subCategories?.map((s: any) => s._id) || []);
          setSelectedTags(p.tags?.map((t: any) => t._id) || []);
  
          // 🔥 Attributes — selected values only
          setSelectedAttributeValues(
            Object.fromEntries(
              (p.attributes?.map((a: any) => [
                a.attributeId?._id,
                a.value,
              ])) || []
            )
          );


   

  
          setAdditionalFields(p.additionalInformation || [{ key: "", value: "" }]);
          setSelectedValue(p.status || "draft");
        }
      } catch (err) {
        console.error("Error loading product", err);
      }
    }
  
    fetchProduct();
  }, [id]);
  

  const handleUpdateProduct = async () => {
    if (processing) return;
  
    setProcessing(true);
  
    try {
      const formattedAttributes = Object.entries(selectedAttributeValues)
        .map(([attributeId, value]) => ({ attributeId, value }));
  
      const body = {
        name: title,
        description,
        productSKU: sku,
        regularPrice: Number(price),
        salePrice: Number(salePrice),
        itemsInStock: Number(stock),
        mainImage: mainImageUrl,
        galleryImages,
        categories: selectedCategories,
        subCategories: selectedSubCategories,
        tags: selectedTags,
        attributes: formattedAttributes,
        status: selectedValue,
        additionalInformation: additionalFields,
      };
  
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/update-product/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
  
      const data = await res.json();
  
      if (data.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch (err: any) {
      toast.error("Error updating product: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <PageMeta title="Add Product | Admin Panel" description="Add new products to store" />
      <PageBreadcrumb pageTitle="Add Product" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Product Details */}
          <ComponentCard title="Product Details">
            <div className="space-y-6">
              <div>
                <Label htmlFor="product-title">Product Title</Label>
                <Input
                  id="product-title"
                  placeholder="Product Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={processing}
                />
              </div>

              <div>
                <Label>Description</Label>
                <TextArea
                  value={description}
                  onChange={setDescription}
                  rows={6}
                  placeholder="Write product description"
                  disabled={processing}
                />
              </div>

              <div>
                <Label>SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" disabled={processing} />
              </div>
            </div>
          </ComponentCard>

          {/* Price & Stock */}
          <ComponentCard title="Product Price & Stock">
            <div className="space-y-6">
              <div>
                <Label>Regular Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={processing}
                />
              </div>

              <div>
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.00"
                  disabled={processing}
                />
              </div>

              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  disabled={processing}
                />
              </div>
            </div>
          </ComponentCard>

          {/* Images */}
          <ComponentCard title="Product Images">
            <div className="space-y-6">
              {/* Main Image */}
              <div>
                <Label>Main Image URL</Label>
                <Input
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  placeholder="https://image.jpg"
                  disabled={processing}
                />

                {mainImageUrl && (
                  <img
                    src={mainImageUrl}
                    className="h-32 mt-4 max-w-xs object-contain border rounded-lg"
                  />
                )}
              </div>

              {/* Gallery */}
              <div>
                <Label>Gallery Images</Label>
                <div className="space-y-3">
                  {galleryImages.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={url}
                        onChange={(e) => handleGalleryChange(idx, e.target.value)}
                        placeholder="https://gallery.jpg"
                        className="w-full"
                        disabled={processing}
                      />

                      {idx === galleryImages.length - 1 && (
                        <button className="text-brand-500" onClick={addGallery} type="button" disabled={processing}>
                          +
                        </button>
                      )}

                      {galleryImages.length > 1 && (
                        <button
                          className="text-error-500"
                          onClick={() => removeGallery(idx)}
                          type="button"
                          disabled={processing}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 flex-wrap mt-4">
                    {galleryImages.filter(Boolean).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="h-20 w-20 object-cover border rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Categories */}
          <ComponentCard title="Product Categories">
            <div className="space-y-6">
              <MultiSelect
                label="Select Categories"
                options={categoryOptions}
                onChange={(values) => {
                  setSelectedCategories(values);
                  setSelectedTags([]);
                  setSelectedAttributeValues({});
                }}
                defaultSelected={selectedCategories}
                disabled={processing}
              />

              <MultiSelect
                label="Select Subcategories"
                options={subCategoryOptions}
                onChange={(values) => setSelectedSubCategories(values)}
                defaultSelected={selectedSubCategories}
                disabled={processing}
              />

              <MultiSelect
                label="Select Tags"
                options={tagOptions}
                onChange={setSelectedTags}
                defaultSelected={selectedTags}
                disabled={processing}
              />

              {/* Show each attribute as its own select dropdown */}
              <div className="space-y-2 ">
                <Label>Attributes</Label>
                <div className="space-y-4 pl-4">
                  {attributes.map((attr) => (
                    <div key={attr._id} className="">
                      <Label>{attr.name}</Label>
                      {/* <Select
                        options={attr.terms.map(term => ({ value: term, label: term }))}
                        onChange={(value: string) => handleAttributeSelect(attr._id, value)}
                        placeholder={`Select ${attr.name}`}
                        disabled={processing}
                      /> */}
                      <Select
                        defaultValue={selectedAttributeValues[attr._id] || ""}
                        options={attr.terms.map(term => ({ value: term, label: term }))}
                        onChange={(value: string) => handleAttributeSelect(attr._id, value)}
                        placeholder={`Select ${attr.name}`}
                        //   disabled={processing}
                        />

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ComponentCard>

          {/* Additional Info */}
          <ComponentCard title="Additional Information">
            <div className="space-y-4">
              {additionalFields.map((f, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={f.key}
                    onChange={(e) => handleFieldChange(idx, "key", e.target.value)}
                    placeholder="Key"
                    className="w-1/3"
                    disabled={processing}
                  />
                  <Input
                    value={f.value}
                    onChange={(e) => handleFieldChange(idx, "value", e.target.value)}
                    placeholder="Value"
                    className="w-2/3"
                    disabled={processing}
                  />

                  {idx === additionalFields.length - 1 && (
                    <button
                      className="text-brand-500"
                      onClick={addField}
                      type="button"
                      disabled={processing}
                    >
                      +
                    </button>
                  )}

                  {additionalFields.length > 1 && (
                    <button
                      className="text-error-500"
                      onClick={() => removeField(idx)}
                      type="button"
                      disabled={processing}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>
          </ComponentCard>

          {/* Status */}
          <ComponentCard title="Status">
            <div className="flex gap-8">
              <Radio
                id="status-draft"
                name="status"
                value="draft"
                checked={selectedValue === "draft"}
                onChange={() => setSelectedValue("draft")}
                label="Draft"
                disabled={processing}
              />

              <Radio
                id="status-publish"
                name="status"
                value="publish"
                checked={selectedValue === "publish"}
                onChange={() => setSelectedValue("publish")}
                label="Publish"
                disabled={processing}
              />
            </div>
          </ComponentCard>

          {/* <button
            onClick={handleCreateProduct}
            className={`bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold ${
              processing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            disabled={processing}
          >
            {processing ? "Processing..." : "Create Product"}
          </button> */}
          <button
  onClick={isEditMode ? handleUpdateProduct : handleCreateProduct}
  className="bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold
    ${processing ? 'opacity-50 cursor-not-allowed' : ''}"
  disabled={processing}
>
  {processing ? "Processing..." : isEditMode ? "Update Product" : "Create Product"}
</button>

        </div>
      </div>
    </div>
  );
}
