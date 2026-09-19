import React from "react";
import DataTable from "react-data-table-component";

import AppPagination from "./AppPagination";

import BouncingLoader from "@views/spinners/BouncingLoader";

const tableCustomStyles = {
  headCells: {
    style: {
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "#e2e6ed",
    },
  },
  cells: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

function PiDataTable(props) {
  const { count, params, setParams, minHeight } = props;

  const handleSort = (column, sortOrder) => {
    const sortField = column && column.sortField ? column.sortField : "";

    setParams({
      ...params,
      orderBy: sortField,
      ascending: sortOrder,
    });
  };

  return (
    <DataTable
      customStyles={tableCustomStyles}
      paginationComponent={() => {
        return (
          <AppPagination count={count} params={params} setParams={setParams} />
        );
      }}
      title="&nbsp;"
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
