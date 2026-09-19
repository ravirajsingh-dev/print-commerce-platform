export const PAGE_SIZE_OPTIONS = [
  {
    text: "20",
    page: 20,
  },
  {
    text: "50",
    page: 50,
  },
  {
    text: "100",
    page: 100,
  },
];

export const DEFAULT_PAGE_SIZE = 20;

export const credentialTypes = [
  {
    label: "Bank",
    value: "bank",
  },
  {
    label: "UPI ID",
    value: "upi",
  },
];

export const UserStatuses = [
  {
    label: "Active",
    value: 1,
  },
  {
    label: "Inactive",
    value: 2,
  },
  {
    label: "New",
    value: 3,
  },
];

export const MenuItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Wallet",
    href: "/user/wallet",
    subMenu: [
      { title: "Add Money", href: "/user/add-money" },
      { title: "Wallet History", href: "/user/wallet" },
    ],
  },
  {
    title: "Orders",
    href: "/user/orders",
    subMenu: [
      { title: "Orders", href: "/user/orders" },
      { title: "Order Tracking", href: "/user/orders/tracking" },
    ],
  },
  {
    title: "Setting",
    href: "/user/profile",
    subMenu: [
      { title: "Profile", href: "/user/profile" },
      { title: "Change Password", href: "/user/change-password" },
    ],
  },
  {
    title: "Help Desk",
    href: "/contact-us",
    subMenu: [
      {
        title: "About Us",
        href: "/about-us",
      },
      {
        title: "Contact Us",
        href: "/contact-us",
      },
      { title: "Terms & Conditions", href: "/terms-conditions" },
    ],
  },
];

export const MenuItems2 = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Help Desk",
    href: "/contact-us",
  },
  {
    title: "About Us",
    href: "/about-us",
  },
  {
    title: "Contact Us",
    href: "/contact-us",
  },
  {
    title: "Terms & Conditions",
    href: "/terms-conditions",
  },
];

export const MenuItems3 = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Setting / Setup",
    href: "/user/profile",
    subMenu: [
      { title: "Edit Profile", href: "/user/profile" },
      { title: "Change Password", href: "/user/change-password" },
    ],
  },
  {
    title: "Add Money",
    href: "/user/add-money",
  },
  {
    title: "Add Order",
    isButton: true,
    href: "/our-services",
  },
  {
    title: "Wallet History",
    href: "/user/wallet",
  },
  {
    title: "Orders",
    href: "/user/orders",
  },
  {
    title: "Order Status",
    href: "/user/orders/tracking",
  },
  {
    title: "Compliants",
    href: "/user/complaints",
  },
  {
    title: "Help Desk",
    href: "/contact-us",
    subMenu: [
      {
        title: "About Us",
        href: "/about-us",
      },
      {
        title: "Contact Us",
        href: "/contact-us",
      },
      { title: "Terms & Conditions", href: "/terms-conditions" },
    ],
  },
];

export const GlobalOrderStatus2 = [
  { value: "pending", label: "Order Booked" },
  { value: "processing", label: "Pending" },
  { value: "confirmed", label: "Under Processing" },
  { value: "under-packing", label: "Under Packing" },
  { value: "ready-to-delievery", label: "Ready To Delievery" },
  { value: "delivered", label: "Delivered" },
];

export const GlobalOrderStatus = [
  { value: "pending", label: "Order Booked" },
  { value: "processing", label: "Pending" },
  { value: "confirmed", label: "Under Processing" },
  { value: "under-packing", label: "Under Packing" },
  { value: "ready-to-delievery", label: "Ready To Delievery" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "failed", label: "Payment Failed" },
];
