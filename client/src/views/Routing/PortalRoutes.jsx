import { createBrowserRouter, useNavigate } from "react-router-dom";

import NotFound from "../Layout/NotFound/NotFound";
import Home from "../Layout/Home";
import ContactUs from "../Layout/Components/ContactUs";
import AboutUs from "../Layout/Components/AboutUs";
import OurServicesLayout from "../Layout/OurServices/index";
import ProductServices from "../Layout/OurServices/ProductServices";
import ServicesCategories from "../Layout/OurServices/ServicesCategories";
import OrderLayout from "../Order/index";
import PortalLayout from "../Layout/PortalLayout";
import Login from "../Auth/Login";
import ProfileLayout from "../Layout/Profile/ProfileLayout";
import EditProfileLayout from "../Layout/Profile/EditProfileLayout";
import ChangePassword from "../Auth/ChangePassword";
import WalletLayout from "../Layout/Wallet/WalletLayout";
import AddMoneyLayout from "../Layout/Wallet/AddMoneyLayout";
import OrdersList from "../Order/OrdersList";
import TrackOrder from "../Order/TrackOrder";
import TermsConditions from "../Layout/Components/TermsConditions";
import PublicLayout from "../Layout/PublicLayout";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import Complaints from "../Layout/Complaints/index";

const PortalRoutes = createBrowserRouter([
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/",
    element: <PublicLayout />, // The layout will always render
    children: [
      {
        path: "/",
        name: "Home Page",
        element: <Home />,
      },
      {
        path: "/contact-us",
        name: "Contact US",
        element: <ContactUs />,
      },
      {
        path: "/about-us",
        name: "About US",
        element: <AboutUs />,
      },
      {
        path: "/terms-conditions",
        name: "Terms & Conditions",
        element: <TermsConditions />,
      },
      {
        path: "/our-services",
        name: "Our Services",
        element: <OurServicesLayout />,
      },
      {
        path: "/product-services/:product_id",
        name: "Product Services",
        element: <ProductServices />,
      },
      {
        path: "/services-categories/:product_service_id",
        name: "Services Categories",
        element: <ServicesCategories />,
      },
      {
        path: "/forgot-password",
        name: "Forgot Password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/user",
    name: "Portal Layout",
    element: <PortalLayout />,
    children: [
      {
        path: "orders",
        name: "Orders List",
        element: <OrdersList />,
      },
      {
        path: "orders/tracking",
        name: "Orders Tracking",
        element: <TrackOrder />,
      },
      {
        path: "create-order",
        name: "Order Layout",
        element: <OrderLayout />,
      },
      {
        path: "profile",
        name: "View Profile",
        element: <ProfileLayout />,
      },
      {
        path: "edit-profile/:user_id",
        name: "Edit Profile",
        element: <EditProfileLayout />,
      },
      {
        path: "add-money",
        name: "Add Money",
        element: <AddMoneyLayout />,
      },
      {
        path: "wallet",
        name: "Add Money",
        element: <WalletLayout />,
      },
      {
        path: "complaints",
        name: "Complaints",
        element: <Complaints />,
      },
      {
        path: "change-password",
        name: "Change Password",
        element: <ChangePassword />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default PortalRoutes;
