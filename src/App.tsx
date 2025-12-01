import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AdminDashboard from "./pages/Main/Admin-Dashboard/AdminDashboard";
import AllCustomers from "./pages/Main/Customer/AllCustomer";
import ManageCategory from "./pages/Main/Categories/Category";
import ManageSubCategory from "./pages/Main/SubCategories/SubCategory";
import ManageTags from "./pages/Main/Tags/Tags";
import ManageAttributes from "./pages/Main/Attributes/Attributes";
import AddProducts from "./pages/Main/Products/AddProducts";
import AllProducts from "./pages/Main/Products/AllProducts";
import ManageCoupon from "./pages/Main/Coupons/Coupons";

export default function App() {
  return (
    <>
      <Router>
       

        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
          <Route index path="/" element={<AdminDashboard />} />
          <Route index path="/users" element={<AllCustomers />} />
          <Route index path="/category" element={<ManageCategory />} />
          <Route index path="/sub-category" element={<ManageSubCategory />} />
          <Route index path="/tags" element={<ManageTags />} />
          <Route index path="/attributes" element={<ManageAttributes />} />
          <Route index path="/products/add" element={<AddProducts />} />
          <Route index path="/products" element={<AllProducts />} />
          <Route
          index
            path="/products/edit-product/:id"
            element={<AddProducts />}
          />

          <Route index path="/coupons" element={<ManageCoupon />} />




            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
