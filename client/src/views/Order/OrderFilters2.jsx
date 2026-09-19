import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import moment from "moment";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const OrderFilters = (props) => {
  const {
    filterParams,
    filterName,
    filter,
    filterType,
    onFilterChange = () => {},
    selectOptions,
    toggleFilters,
  } = props;

  const [selectedOption, setSelectedOption] = useState(null);
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [searchText, setSearchText] = useState("");
  const [orderRangeFilter, setOrderRangeFilter] = useState({
    orderStartDate: "",
    orderEndDate: "",
  });

  // Handle input changes
  const handleSearchInputChange = (e) => setSearchText(e.target.value);
  const handleSelectChange = (option) => setSelectedOption(option);
  const [startDate, endDate] = dateRange;
  // const handleDateChange = (option, date_range) => {
  //   if (option === "resetDate") {
  //     setDateRange([null, null]);
  //     optionValue = "";
  //   } else {
  //     setDateRange(date_picker);

  //     optionValue =
  //       moment(date_picker[0]).format("MM/DD/YYYY HH:mm:ss") +
  //       "-" +
  //       moment(date_picker[1]).format("MM/DD/YYYY HH:mm:ss");
  //   }
  // };

  const resetLinkCSS = {
    marginLeft: "10px",
    textTransform: "underline",
    color: "#20a8d8",
    cursor: "pointer",
    float: "right",
  };

  const handleSelect = (option, date_picker, type) => {
    let optionValue;
    if (type === "searchable-select") {
      optionValue = option.value;
      setSelectedOption(option);
    } else if (type === "date-range-picker") {
      console.log("HEllo");
      if (option === "resetDate") {
        setDateRange([null, null]);
        optionValue = "";
      } else {
        // setDateRange(date_picker);

        console.log("optionValue", optionValue);
        optionValue =
          moment(date_picker?.startDate).format("MM/DD/YYYY HH:mm:ss") +
          "-" +
          moment(date_picker?.endDate).format("MM/DD/YYYY HH:mm:ss");
      }
    } else {
      optionValue = option.target.value;
    }

    let filters, params;
    if (optionValue === "all" || optionValue === "") {
      filters = filterParams.filters.filter((item) => item !== filter);
      params = { ...filterParams, filters, query: {} };

      for (let key in params.query) {
        if (key !== filter) {
          params.query[key] = filterParams.query[key];
        }
      }
    } else {
      filters = filterParams.filters.includes(filter)
        ? filterParams.filters
        : [...filterParams.filters, filter];

      params = {
        ...filterParams,
        filters,
        query: {
          ...filterParams.query,
          [filter]: { value: optionValue, type: filterType },
        },
      };
    }

    params.page = 1;
    onFilterChange(filter, optionValue, params);
  };

  // Apply Filters when button is clicked
  const applyFilters = () => {
    toggleFilters();
    if (searchText.trim()) {
      props.onSearch("search", searchText);
    }

    if (selectedOption) {
      handleSelect(selectedOption, "", "searchable-select");
    }

    if (state[0]?.startDate && state[0]?.endDate) {
      handleSelect("date-range-picker", state[0], "date-range-picker");
    }
  };

  // Reset Filters when button is clicked
  const resetFilters = () => {
    toggleFilters();
    setSearchText("");
    setSelectedOption(null);
    setOrderRangeFilter({ orderStartDate: "", orderEndDate: "" });

    // Reset API filters
    let params = {
      ...filterParams,
      query: {},
      filters: [],
      page: 1,
    };

    onFilterChange(filter, "", params);
  };

  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  return (
    <Form>
      <Row className="p-5">
        <Col xs="6">
          <Row>
            <Col xs="12" className="custom-input-card-filter">
              {/* Search Input */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="search">Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by SA ID, Name, Email and Phone"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </Form.Group>
            </Col>
            <Col xs="12" className="custom-input-card-filter">
              {/* Searchable Select */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="filter">
                  {filterName ? filterName : filter}
                </Form.Label>
                <Select
                  id={filter}
                  name={filter}
                  options={selectOptions.map((r) => ({
                    value: r.value,
                    label: r.label,
                  }))}
                  value={selectedOption}
                  placeholder="Select"
                  onChange={handleSelectChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col xs="12" md="6" lg="3" className="custom-input-card-filter">
          {/* Date Range Picker */}
          <Form.Group className="form-group-custom mb-2">
            <Form.Label>Date Range</Form.Label>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setState([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={state}
            />
            {/* <span
              style={resetLinkCSS}
              onClick={(e, picker) => {
                handleSelect("resetDate", picker);
              }}
            >
              reset
            </span> */}
            {/* <div className="d-flex">
              <Form.Control
                type="date"
                name="orderStartDate"
                value={orderRangeFilter.orderStartDate}
                onChange={handleDateChange}
              />
              <span className="mx-2">to</span>
              <Form.Control
                type="date"
                name="orderEndDate"
                value={orderRangeFilter.orderEndDate}
                onChange={handleDateChange}
              />
            </div> */}
          </Form.Group>
        </Col>

        <Col xs="12" className="custom-input-card-filter">
          {/* Buttons */}
          <div className="d-flex gap-2 mt-2">
            <Button onClick={applyFilters} className="rr-btn">
              Apply Filters
            </Button>
            <Button
              variant="secondary"
              onClick={resetFilters}
              className="rr-btn"
            >
              Reset Filters
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderFilters;
