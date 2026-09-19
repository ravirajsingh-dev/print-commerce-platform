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
  const [searchText, setSearchText] = useState("");
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const onChangeDate = (item) => {
    setState([item.selection]);
  };

  // Handle input changes
  const handleSearchInputChange = (e) => setSearchText(e.target.value);
  const handleSelectChange = (option) => setSelectedOption(option);

  // Apply Filters when button is clicked
  const applyFilters = () => {
    // toggleFilters();
    if (searchText.trim()) {
      props.onSearch("search", searchText);
    }

    let filters, params;
    if (selectedOption) {
      let optionValue = selectedOption.value;

      filters = filterParams.filters.includes("status")
        ? filterParams.filters
        : [...filterParams.filters, "status"];

      params = {
        ...filterParams,
        filters,
        query: {
          ...filterParams.query,
          status: { value: optionValue, type: "String" },
        },
      };
    }

    if (state[0]?.startDate && state[0]?.endDate) {
      let optionValue =
        moment(state[0]?.startDate).format("MM/DD/YYYY HH:mm:ss") +
        "-" +
        moment(state[0]?.endDate).format("MM/DD/YYYY HH:mm:ss");

      filters = filterParams.filters.includes("createdAt")
        ? filterParams.filters
        : [...filterParams.filters, "createdAt"];

      params = {
        ...filterParams,
        filters,
        query: {
          ...filterParams.query,
          createdAt: { value: optionValue, type: "Date" },
        },
      };
    }

    params.page = 1;
    onFilterChange(filter, "", params);
  };

  // Reset Filters when button is clicked
  const resetFilters = () => {
    toggleFilters();
    setSearchText("");
    setSelectedOption(null);
    setState([
      {
        startDate: new Date(),
        endDate: null,
        key: "selection",
      },
    ]);

    // Reset API filters
    let params = {
      ...filterParams,
      query: {},
      filters: [],
      page: 1,
    };

    onFilterChange(filter, "", params);
  };

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
                  placeholder="Search by SA ID, Name  and Email"
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
              onChange={(item) => onChangeDate(item)}
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
