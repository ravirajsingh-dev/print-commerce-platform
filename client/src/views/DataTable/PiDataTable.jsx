import React from "react";
import DataTable from "react-data-table-component";

import AppPagination from "./AppPagination";
import BouncingLoader from "@src/views/spinners/BouncingLoader";

const tableCustomStyles = {
  table: {
    style: {
      borderRadius: "10px",
      overflow: "hidden",
      minWidth: "1000px",
    },
  },
  headCells: {
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      backgroundColor: "rgb(230, 243, 255)",
    },
  },
  rows: {
    style: {
      fontSize: "18px",
    },
  },
};

function PiDataTable(props) {
  const { count, params, setParams, minHeight, dtMinWidth = "1000px" } = props;

  const handleSort = (column, sortOrder) => {
    const sortField = column && column.sortField ? column.sortField : "";

    setParams({
      ...params,
      orderBy: sortField,
      ascending: sortOrder,
    });
  };

  const tableStyles = {
    ...tableCustomStyles,
  };

  tableStyles["table"]["style"]["minWidth"] = dtMinWidth;

  return (
    <DataTable
      customStyles={tableStyles}
      paginationComponent={() => {
        return (
          <AppPagination count={count} params={params} setParams={setParams} />
        );
      }}
      onSort={handleSort}
      sortServer
      progressComponent={
        <BouncingLoader minHeight={`${minHeight ? minHeight : "400px"}`} />
      }
      {...props}
    />
  );
}

export default PiDataTable;
