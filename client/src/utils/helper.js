import { UserStatuses } from "@src/constants/index";
import moment from "moment";

export const isAdmin = (user) => {
  return user && user.role === "admin" ? true : false;
};

export const capitalizeFirst = (text) => {
  if (!text) return "";
  const [first, ...rest] = text;
  return first.toUpperCase() + rest.join("");
};

export const capitalizeFullName = (name) => {
  return name
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
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

export const generateRandomNumberString = (length = 6) => {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const handleNumberInput = (event) => {
  const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];

  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};

export const handleTableChange = (
  type,
  searchText,
  sortingParams,
  setUserParams,
  searchFields
) => {
  const { limit, page } = sortingParams;
  let params = {
    limit: limit,
    page: type === "search" ? 1 : page ? page : 1,
  };

  let filters = [];
  if (type === "search") {
    if (searchText.length > 0) {
      filters = sortingParams.filters.includes(type)
        ? sortingParams.filters
        : [...sortingParams.filters, type];

      const query = searchFields.reduce((acc, field) => {
        acc[field.name] = { value: searchText, type: field.type };
        return acc;
      }, {});

      params = {
        ...params,
        query: {
          ...sortingParams.query,
          [type]: query,
        },
        filters,
      };
    } else {
      filters = sortingParams.filters.filter((item) => item !== type);
      const temp = {};
      params = {
        ...sortingParams,
        filters,
      };
      for (const key in params.query) {
        if (key === type) continue;
        temp[key] = params.query[key];
      }
      params.query = temp;
    }
  }

  setUserParams(params);
};

export const capitalizeAll = (text) => {
  if (!text) return "";
  return text
    .split("")
    .map((char) => char.toUpperCase())
    .join("");
};

export const lowercaseAll = (text) => {
  if (!text) return "";
  return text.toLowerCase();
};

export const validateUPI = (upiID) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

  // Test if the UPI ID matches the pattern
  return pattern.test(upiID);
};

export const getUserStatus = (status) => {
  const findStatus = UserStatuses.find((i) => i.value === status);

  if (!findStatus) {
    return status;
  }

  return findStatus.label;
};

export const formatLastLoginTime = (time) => {
  if (!time) {
    return "";
  }

  const tm = moment(time);
  if (!tm.isValid()) {
    return "";
  }

  return tm.fromNow();
};

export const getOrderPaymentStatus = (status) => {
  return status === "confirmed" ||
    status === "shipped" ||
    status === "delivered"
    ? "Confirmed"
    : "Under Processing";
};
