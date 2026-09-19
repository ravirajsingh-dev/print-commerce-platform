export const ADMIN_ROLE = 1;
export const LAB_ROLE = 3;
export const EMPLOYER_ROLE = 2;
export const EMPLOYEE_ROLE = 4;
export const DEFAULT_PAGE_SIZE = 20;

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

export const GlobalUserStatuses = [
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

export const serviceCatFieldsGlobal = [
  {
    label: "Height",
    value: "height",
    key: "height",
    type: "number",
  },
  {
    label: "Width",
    value: "width",
    key: "width",
    type: "number",
  },
  {
    label: "Height In Feet",
    value: "height_feet",
    key: "height_feet",
    type: "number",
  },
  {
    label: "Width In Feet",
    value: "width_feet",
    key: "width_feet",
    type: "number",
  },
  {
    label: "Quality",
    value: "quality",
    key: "quality",
    type: "dropdown",
  },
  {
    label: "Lamination",
    value: "lamination",
    key: "lamination",
    type: "dropdown",
  },
  // {
  //   label: "Price Per Square",
  //   value: "price_per_square",
  //   key: "price_per_square",
  //   type: "number",
  // },
];

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

export const GlobalOrderStatus = [
  { value: "pending", label: "Order Booked" },
  { value: "processing", label: "Pending" },
  { value: "confirmed", label: "Under Processing" },
  { value: "under-packing", label: "Under Packing" },
  { value: "ready-to-delievery", label: "Ready To Delievery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
  { value: "failed", label: "Payment Failed" },
];

export const GlobalWalletRequestStatus = [
  { label: "Success", value: "success" },
  { label: "Cancelled", value: "cancelled" },
];
