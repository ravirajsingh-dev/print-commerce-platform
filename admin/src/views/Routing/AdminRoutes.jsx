import Dashboard from "@views/Admin/Dashboard/index";
import NotFoundInner from "@views/404Inner";

import UsersList from "@views/Admin/Users/UsersList";
import CreateUser from "@views/Admin/Users/AddUser/CreateUser";
import ViewUser from "@views/Admin/Users/ViewUser/index";

import AdminProfile from "@views/Admin/Profile/AdminProfile";
import EditProfile from "@views/Admin/Profile/EditProfile";

import OrdersList from "@views/Admin/Orders/OrdersList";
import CreateOrder from "@views/Admin/Orders/CreateOrder";
import EditOrder from "@views/Admin/Orders/EditOrder";

import ProductsList from "@views/Admin/Products/ProductsList";
import CreateProduct from "@views/Admin/Products/CreateProduct";
import EditProduct from "@views/Admin/Products/EditProduct";

import ProductServicesList from "@views/Admin/Products/ProductServices/ProductServicesList";
import CreateProductService from "@views/Admin/Products/ProductServices/CreateProductService";
import EditProductService from "@views/Admin/Products/ProductServices/EditProductService";

import ServiceCatList from "@views/Admin/Products/ServiceCategories/ServiceCatList";
import CreateServiceCat from "@views/Admin/Products/ServiceCategories/CreateServiceCat";

import ServicesList from "@views/Admin/Services/ServicesList";
import CreateService from "@views/Admin/Services/CreateService";
import EditService from "@views/Admin/Services/EditService";

import CredentialsList from "@views/Admin/Credentials/CredentialsList";
import CreateCredential from "@views/Admin/Credentials/CreateCredential";
import EditCredential from "@views/Admin/Credentials/EditCredential";
import WalletRequestsList from "@views/Admin/WalletRequest/WalletRequestsList";
import BannersList from "@views/Admin/Banners/BannersList";
import ComplaintsList from "@views/Admin/Complaints/ComplaintsList";
import CreateComplaint from "@views/Admin/Complaints/ComplaintForm";
import EditComplaint from "@views/Admin/Complaints/EditComplaint";
import DeductMoney from "@views/DeductMoney/DeductMoney";

const AdminRoutes = [
  {
    path: "/dashboard",
    name: "Admin Dashboard",
    element: <Dashboard />,
    provider: false,
  },
  {
    path: "/users",
    name: "All Users",
    element: <UsersList />,
    provider: false,
  },
  {
    path: "/users/create",
    name: "Add User",
    element: <CreateUser />,
    provider: false,
  },
  {
    path: "/users/:user_id/*",
    name: "View User",
    element: <ViewUser />,
    provider: false,
  },
  {
    path: "/profile",
    name: "Admin Profile",
    element: <AdminProfile />,
    provider: false,
  },
  {
    path: "/profile/edit",
    name: "Edit Profile",
    element: <EditProfile />,
    provider: false,
  },
  {
    path: "/orders",
    name: "Orders List",
    element: <OrdersList />,
    provider: false,
  },
  {
    path: "/orders/create",
    name: "Create Order",
    element: <CreateOrder />,
    provider: false,
  },
  {
    path: "/orders/:order_id/edit",
    name: "Edit Order",
    element: <EditOrder />,
    provider: false,
  },
  {
    path: "/products",
    name: "Products List",
    element: <ProductsList />,
    provider: false,
  },
  {
    path: "/products/create",
    name: "Create product",
    element: <CreateProduct />,
    provider: false,
  },
  {
    path: "/products/:product_id/edit",
    name: "Edit product",
    element: <EditProduct />,
    provider: false,
  },
  {
    path: "/product-services",
    name: "Product Services List",
    element: <ProductServicesList />,
    provider: false,
  },
  {
    path: "/product-services/create",
    name: "Create Product Service",
    element: <CreateProductService />,
    provider: false,
  },
  {
    path: "/product-services/:product_service_id/edit",
    name: "Edit Product Service",
    element: <EditProductService />,
    provider: false,
  },
  {
    path: "/service-categories",
    name: "Service Categorie List",
    element: <ServiceCatList />,
    provider: false,
  },
  {
    path: "/service-categories/create",
    name: "Create Product Service",
    element: <CreateServiceCat />,
    provider: false,
  },
  {
    path: "/service-categories/:service_cat_id/edit",
    name: "Edit Product Service",
    element: <EditProductService />,
    provider: false,
  },
  {
    path: "/services",
    name: "Services List",
    element: <ServicesList />,
    provider: false,
  },
  {
    path: "/services/create",
    name: "Create Service",
    element: <CreateService />,
    provider: false,
  },
  {
    path: "/services/:service_id/edit",
    name: "Edit Service",
    element: <EditService />,
    provider: false,
  },
  {
    path: "credentials",
    name: "Credentials List",
    element: <CredentialsList />,
  },
  {
    path: "credentials/create",
    name: "Create Credential",
    element: <CreateCredential />,
  },
  {
    path: "credentials/:credential_id/edit",
    name: "Edit Credential",
    element: <EditCredential />,
  },

  {
    path: "wallet-request",
    name: "Wallet Request",
    element: <WalletRequestsList />,
  },
  {
    path: "banner",
    name: "Banners List",
    element: <BannersList />,
  },
  {
    path: "complaints",
    name: "Complaints List",
    element: <ComplaintsList />,
  },
  {
    path: "complaints/create",
    name: "Create Complaint",
    element: <CreateComplaint />,
  },
  {
    path: "complaints/:complaint_id/edit",
    name: "Edit Complaint",
    element: <EditComplaint />,
  },
  {
    path: "deduct-money",
    name: "Deduct Money",
    element: <DeductMoney />,
  },
  {
    path: "/*",
    element: <NotFoundInner />,
    provider: true,
  },
];

export default AdminRoutes;
