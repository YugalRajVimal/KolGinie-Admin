import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProductTable from "./ProductTable";


export default function AllProducts() {
  return (
    <>
      <PageMeta
        title="All Products | Admin Panel"
        description="View all products in the store"
      />
      <PageBreadcrumb pageTitle="All Products" />
      <div className="space-y-6">
        <ComponentCard title="Product Table">
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  );
}
