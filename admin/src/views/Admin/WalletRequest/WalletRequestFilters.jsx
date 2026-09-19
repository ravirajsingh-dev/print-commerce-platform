import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

const WalletRequestFilters = (props) => {
  const {
    filterParams,
    filterName,
    filter,
    filterType,
    type,
    onFilterChange = () => {},
    searchDelay = 750,
    selectOptions,
    placeholder,
  } = props;

  let delayTimer;

  const [selectedOption, setSelectedOption] = React.useState();

  const [orderRangeFilter, setOrderRangeFilter] = React.useState({
    orderStartDate: "",
    orderEndDate: "",
  });

  let { orderStartDate, orderEndDate } = orderRangeFilter;

  const handleSearch = (e) => {
    clearTimeout(delayTimer);
    const text = e.target.value;
    delayTimer = setTimeout(() => {
      props.onSearch("search", text);
    }, searchDelay);
  };

  const handleTextSearch = (e) => {
    e.persist();
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      handleSelect(e);
    }, searchDelay);
  };

  const handleSelect = (option, date_picker) => {
    let optionValue;
    if (type === "searchable-select") {
      optionValue = option.value;
      setSelectedOption(option);
    } else if (type === "gmap-citypicker") {
      // let place_id = option.place_id;
      let city_name = option.name;
      // console.log("selected city: ", city_name, "place_id: ", place_id, );

      optionValue = city_name;
    } else if (type === "date-range-picker") {
      if (option === "resetDate") {
        setOrderRangeFilter({
          orderStartDate: "",
          orderEndDate: "",
        });
        optionValue = "";
      } else {
        const { startDate, endDate } = date_picker;
        setOrderRangeFilter({
          orderStartDate: moment(startDate).format("MM/DD/YYYY"),
          orderEndDate: moment(endDate).format("MM/DD/YYYY"),
        });
        optionValue =
          moment(startDate).format("MM/DD/YYYY HH:mm:ss") +
          "-" +
          moment(endDate).format("MM/DD/YYYY HH:mm:ss");
      }
    } else {
      optionValue = option.target.value;
    }

    let filters, params;

    if (optionValue === "all" || optionValue === "") {
      filters = filterParams.filters.filter((item) => item !== filter);

      const temp = {};
      params = {
        ...filterParams,
        filters,
      };
      for (var i in params.query) {
        if (i === filter) continue;
        temp[i] = params.query[i];
      }
      params.query = temp;
    } else {
      filters = filterParams.filters.includes(filter)
        ? filterParams.filters
        : [...filterParams.filters, filter];
      params = {
        ...filterParams,
        filters,
      };
      params.query = {
        ...params.query,
        [filter]: {
          value: optionValue,
          type: filterType,
        },
      };
    }

    // to bring on first page on every filter change
    params.page = 1;

    onFilterChange(filter, optionValue, params);
  };

  return (
    <>
      {props.onSearch ? (
        <Form.Group>
          <Form.Label htmlFor="search">Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Status, Type and Transaction Number"
            title="Search by Status, Type and Transaction Number"
            onChange={(e) => handleSearch(e)}
          />
        </Form.Group>
      ) : null}

      {type === "text" ? (
        <Form.Group className="mb-2 mr-sm-3">
          <Form.Label htmlFor={filter}>
            {filterName ? filterName : filter}
          </Form.Label>
          <Form.Control
            type="text"
            id={filter}
            name={filter}
            placeholder={placeholder}
            title={placeholder}
            onChange={(e) => handleTextSearch(e)}
          />
        </Form.Group>
      ) : null}

      {type === "searchable-select" && (
        <Form.Group className="mb-2 mr-sm-3" style={{ width: "200px" }}>
          <Form.Label htmlFor="filter">
            {filterName ? filterName : filter}{" "}
          </Form.Label>

          <Select
            id={filter}
            name={filter}
            options={selectOptions.map((r) => ({
              value: r.value,
              label: r.title,
            }))}
            value={selectedOption}
            placeholder="Select"
            onChange={(e) => {
              handleSelect(e);
            }}
          />
        </Form.Group>
      )}
    </>
  );
};

export default WalletRequestFilters;
