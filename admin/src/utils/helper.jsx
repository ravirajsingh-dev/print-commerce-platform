import moment from "moment";
import store from "../store";

import { GlobalOrderStatus, GlobalUserStatuses } from "@constants/index";

export const capitalizeFirst = (text) => {
  if (!text) return "";
  const [first, ...rest] = text;
  return first.toUpperCase() + rest.join("");
};

export const dividePascalCaseString = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};

export const isAdmin = (user) => {
  return true;
};

export const isProvider = (user) => {
  return user && (user.role === 2 || user.role === 3) ? true : false;
};

export const userNameToShow = (fullname) => {
  fullname = fullname.trim();

  if (fullname) {
    let extractedInitials = fullname.split(" ");
    extractedInitials = extractedInitials.filter((n) => n);

    const firstName = extractedInitials[0];
    const middleName = extractedInitials[1] ? extractedInitials[1] : "";

    return firstName + " " + middleName;
  }
  return fullname;
};

export const getDateRange = (option) => {
  let dateFrom = "";
  let dateTo = "";

  let todayDate = moment();

  switch (option) {
    case "today":
      dateFrom = todayDate.clone().startOf("day").format();
      dateTo = todayDate.clone().endOf("day").format();
      break;
    case "yesterday":
      dateFrom = todayDate.clone().subtract(1, "days").startOf("day").format();
      dateTo = todayDate.clone().subtract(1, "days").endOf("day").format();
      break;
    case "last-7-days":
      dateFrom = todayDate.clone().subtract(7, "days").startOf("day").format();
      dateTo = todayDate.clone().endOf("day").format();
      break;
    case "last-30-days":
      dateFrom = todayDate.clone().subtract(1, "month").startOf("day").format();
      dateTo = todayDate.clone().endOf("day").format();
      break;
    default:
      dateTo = "";
      dateFrom = "";
  }

  return {
    dateFrom,
    dateTo,
  };
};

export const checkBase64Type = (base64String) => {
  const cleanedBase64 = base64String.replace(/\s/g, "");

  // Decode the Base64 string to binary data
  const binaryData = window.atob(cleanedBase64);

  // Check for common patterns in the binary data to make an educated guess
  if (hasImagePattern(binaryData)) {
    return "image";
  } else if (hasPDFPattern(binaryData)) {
    return "pdf";
  } else {
    return "unknown";
  }
};

function hasImagePattern(binaryData) {
  return (
    binaryData.includes("\xFF\xD8\xFF") ||
    binaryData.includes("PNG") ||
    binaryData.includes("GIF")
  );
}

function hasPDFPattern(binaryData) {
  // Check for common patterns in PDF binary data
  return binaryData.includes("%PDF-");
}

export const isBase64String = (str) => {
  // Base64 characters and padding regex pattern
  const base64Regex = /^[A-Za-z0-9+/=]+$/;

  // Check if the string matches the Base64 pattern and has correct padding
  return base64Regex.test(str) && str.length % 4 === 0 && str.length >= 4;
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

// export const convertBase64ToBlob = (base64String) => {
//   const binaryData = atob(base64String);
//   const byteArray = new Uint8Array(binaryData.length);

//   for (let i = 0; i < binaryData.length; i++) {
//     byteArray[i] = binaryData.charCodeAt(i);
//   }

//   const contentType = detectMimeType(base64String);
//   const { mime } = contentType;
//   return new Blob([byteArray], { type: mime });
// };

// export const showBase64ToNewWindow = (base64String) => {
//   const blob = convertBase64ToBlob(base64String);

//   const blobUrl = URL.createObjectURL(blob);
//   window.open(blobUrl, "_blank");
// };

export const daysUntil = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffInTime = targetDate.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
  return diffInDays;
};

export const expiringInDays = (days) => {
  if (days > 90) {
    return "";
  }

  if (days < 0) {
    return "Expired";
  }

  switch (days) {
    case 0:
      return "Expiring Today";
    case 1:
      return "Expiring Tomorrow";
    default:
      return `Expiring in ${days} days`;
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Regex to allow only numbers with a length between 10 and 20
  const phoneRegex = /^[0-9]{10,20}$/;
  return phoneRegex.test(phone);
};

export const getUserStatusLabel = (status) => {
  if (!status) return "";

  const getStatus = GlobalUserStatuses.find((s) => s.value === status);

  if (!getStatus) return "";

  return getStatus.label;
};

export const getProductServiceByProductID = (productID) => {
  const list = store.getState().productService.productServicesListAll;

  const filtered = list.filter((each) => each.product === productID);
  return filtered ?? [];
};

export const getServiceCatByProductServiceID = (service_id) => {
  const list = store.getState().serviceCat.serviceCatsListAll;

  const filtered = list.filter((each) => each.product_service === service_id);
  return filtered ?? [];
};

export const getOrderStatusByValue = (value) => {
  const selected = GlobalOrderStatus.find((each) => each.value === value);

  return selected ? selected.label : "";
};

export const isDisabledOrderStatusUpdate = (currentStatus) => {
  const statusOrder = GlobalOrderStatus.map((status) => status.value);
  const confirmedIndex = statusOrder.indexOf("confirmed");
  const currentIndex = statusOrder.indexOf(currentStatus);

  return currentIndex >= confirmedIndex; // Disable if status is "confirmed" or any status after it
};

export const downloadFileToLocal = (fileURL, fileName) => {
  // create and remove link to download pdf
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
