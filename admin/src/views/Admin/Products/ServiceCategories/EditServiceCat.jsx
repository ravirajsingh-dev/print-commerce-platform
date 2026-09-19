import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import ProductServiceForm from "./ServiceCatForm";
import Spinner from "../../../spinners/RoundSpinner";

import { getProductServiceById } from "@actions/productServiceActions";

const EditProductService = ({
  loadingProductService,
  getProductServiceById,
}) => {
  const { service_cat_id } = useParams();

  React.useEffect(() => {
    if (!service_cat_id) return;
    getProductServiceById(service_cat_id);
  }, [service_cat_id]);

  return loadingProductService ? (
    <Spinner />
  ) : (
    <ProductServiceForm serviceCatID={service_cat_id} />
  );
};

const mapStateToProps = (state) => ({
  loadingProductService: state.serviceCat.loadingProductService,
});

export default connect(mapStateToProps, { getProductServiceById })(
  EditProductService
);
