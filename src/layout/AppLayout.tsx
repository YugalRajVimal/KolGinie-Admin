import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();



  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />

        <ToastContainer style={{ zIndex: 9999999 }} position="top-right" />


        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<
  boolean | null
>(null);

useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin-token");

      if (!token) {
        setIsAdminAuthenticated(false);
        if (window.location.pathname.startsWith("/")) {
          window.location.href = "/signin";
        }
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/admin`,
        {},
        {
          headers: { Authorization: `${token}` },
        }
      );



      if (res.status === 200) {
        setIsAdminAuthenticated(true);
        // redirect only if logged in but not already on an admin page
        if (window.location.pathname === "/signin") {
          window.location.href = "/";
        }
      } else {
        setIsAdminAuthenticated(false);
        window.location.href = "/signin";
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAdminAuthenticated(false);
      window.location.href = "/signin";
    }
  };

  checkAuth();
}, []);

if (isAdminAuthenticated === null || !isAdminAuthenticated) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="w-40 h-40 border-4 border-t-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <SidebarProvider>

      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
