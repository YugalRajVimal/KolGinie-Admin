import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import DeleteConfirmModal from "./DeleteConfirmModal";
// Importing toast from react-toastify
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
}
interface SubCategory {
  _id: string;
  name: string;
}
interface Tag {
  _id: string;
  name: string;
}
interface AttributeValue {
  attributeId: {
    _id: string;
    name: string;
  };
  value: string;
}
interface Product {
  _id: string;
  name: string;
  description?: string;
  productSKU?: string;
  itemsInStock?: number;
  regularPrice?: number;
  salePrice?: number;
  status?: string;
  mainImage?: string;
  categories?: Category[];
  subCategories?: SubCategory[];
  tags?: Tag[];
  attributes?: AttributeValue[];
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // "deletingId" is replaced by delete confirm modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-products`,
          {
            params: { page }
          }
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages ?? 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again."); // use toast here
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Show Delete Modal and set product
  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Hide Delete Modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
    setDeleting(false);
  };

  // Confirm product delete, call API and update products list
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-product/${productToDelete._id}`
      );
      setProducts(prev => prev.filter((p) => p._id !== productToDelete._id));
      closeDeleteModal();
      toast.success("Product deleted successfully."); // Use toast for successful delete
    } catch (error) {
      toast.error("Could not delete product. Please try again."); // use toast for delete error
      console.error("Delete error:", error);
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="whitespace-nowrap">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Main Image
              </TableCell>
             
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                SKU
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                In Stock
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Regular Price
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Sale Price
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Categories
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Sub Categories
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Tags
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Attributes
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 whitespace-nowrap">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {products?.map((product) => (
              <TableRow key={product._id}>
                {/* Main Image */}
                <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                  {product.mainImage ? (
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs whitespace-nowrap">
                      No Image
                    </div>
                  )}
                </TableCell>

                {/* Name */}
                <TableCell className="px-5 py-4 sm:px-6 text-start whitespace-nowrap">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 whitespace-nowrap">
                    {product.name}
                  </span>
                </TableCell>
                {/* SKU */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  <span className="whitespace-nowrap">{product.productSKU || "N/A"}</span>
                </TableCell>
                {/* In Stock */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  <span className="whitespace-nowrap">
                    {typeof product.itemsInStock === "number" ? product.itemsInStock : "N/A"}
                  </span>
                </TableCell>
                {/* Regular Price */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  <span className="whitespace-nowrap">
                    {typeof product.regularPrice === "number" ? `₹${product.regularPrice}` : "N/A"}
                  </span>
                </TableCell>
                {/* Sale Price */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                  <span className="whitespace-nowrap">
                    {typeof product.salePrice === "number" ? `₹${product.salePrice}` : "N/A"}
                  </span>
                </TableCell>
                {/* Status */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 capitalize whitespace-nowrap">
                  <span className="whitespace-nowrap">{product.status || "N/A"}</span>
                </TableCell>
                {/* Categories */}
                <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                  {product.categories && product.categories.length > 0 ? (
                    <ul className="list-disc pl-3 whitespace-nowrap">
                      {product.categories.map((category) => (
                        <li key={category._id} className="text-gray-700 dark:text-white/80 text-theme-xs whitespace-nowrap">
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-xs whitespace-nowrap">N/A</span>
                  )}
                </TableCell>

                {/* Sub Categories */}
                <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                  {product.subCategories && product.subCategories.length > 0 ? (
                    <ul className="list-disc pl-3 whitespace-nowrap">
                      {product.subCategories.map((sub) => (
                        <li key={sub._id} className="text-gray-700 dark:text-white/80 text-theme-xs whitespace-nowrap">
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-xs whitespace-nowrap">N/A</span>
                  )}
                </TableCell>
                {/* Tags */}
                <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                  {product.tags && product.tags.length > 0 ? (
                    <ul className="flex flex-wrap gap-1 whitespace-nowrap">
                      {product.tags.map((tag) => (
                        <li key={tag._id} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap">
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-xs whitespace-nowrap">N/A</span>
                  )}
                </TableCell>
                {/* Attributes */}
                <TableCell className="px-4 py-3 text-start whitespace-nowrap">
                  {product.attributes && product.attributes.length > 0 ? (
                    <ul className="space-y-1 whitespace-nowrap">
                      {product.attributes.map((attr, idx) => (
                        <li key={attr.attributeId?._id ?? idx} className="text-gray-700 dark:text-white/80 text-theme-xs whitespace-nowrap">
                          <span className="font-semibold whitespace-nowrap">{attr.attributeId?.name || "Unknown"}:</span>{" "}
                          <span className="whitespace-nowrap">{attr.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-xs whitespace-nowrap">N/A</span>
                  )}
                </TableCell>
                {/* Action */}
                <TableCell className="px-4 py-3 text-center whitespace-nowrap flex gap-2 items-center justify-center">
                  <a
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition duration-150"
                    href={`/products/edit-product/${product._id}`}
                  >
                    Edit
                  </a>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition duration-150"
                    onClick={() => openDeleteModal(product)}
                  >
                    {(deleting && productToDelete && productToDelete._id === product._id) ? "Deleting..." : "Delete"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        product={productToDelete}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 whitespace-nowrap">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md whitespace-nowrap"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="whitespace-nowrap">{`Page ${page} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md whitespace-nowrap"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
