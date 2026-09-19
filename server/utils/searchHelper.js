const mongoose = require("mongoose");

const processSearchFilters = (filters, query) => {
  const filtersSearchArgs = {};
  const filtersFilterArgs = {};
  const orSearch = [];
  const orFilter = [];

  // Utility function for search filters
  const processSearchItem = (key, filter) => {
    const value = filter.value;
    switch (filter.type) {
      case "id":
        return { [key]: mongoose.Types.ObjectId(value) };
      case "Number":
        return { [key]: { $regex: new RegExp(parseInt(value), "i") } };
      case "String":
        return { [key]: { $regex: new RegExp(value.toString(), "i") } };
      case "Array":
        return { [key]: { $in: [value.toString()] } };
      default:
        return { [key]: value };
    }
  };

  // Utility function for filter conditions
  const processFilterItem = (item, filter) => {
    const value = filter.value;
    switch (filter.type) {
      case "id":
        return { [item]: mongoose.Types.ObjectId(value) };
      case "Number":
        return { [item]: parseInt(value) };
      case "String":
        return { [item]: value.toString() };
      case "Date":
        const [startDate, endDate] = value.split("-");
        return {
          [item]: { $gte: new Date(startDate), $lte: new Date(endDate) },
        };
      case "Boolean":
        return { [item]: value === "1" };
      default:
        return { [item]: value };
    }
  };

  // Iterate through filters
  filters.forEach((item) => {
    if (query[item]) {
      if (item === "search") {
        const searchFilters = query[item];
        for (let key in searchFilters) {
          orSearch.push(processSearchItem(key, searchFilters[key]));
        }
        if (orSearch.length) filtersSearchArgs.$or = orSearch;
      } else {
        orFilter.push(processFilterItem(item, query[item]));
      }
    }
  });

  // Combine filter conditions
  if (orFilter.length) filtersFilterArgs.$and = orFilter;

  return { ...filtersSearchArgs, ...filtersFilterArgs };
};

module.exports = { processSearchFilters };
