import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import ProductServiceForm from "./ProductServiceForm";
import Spinner from "../../../Spinner";

import { getProductServiceById } from "@actions/productServiceActions";

const EditProductService = ({
  loadingProductService,
  getProductServiceById,
}) => {
  const { product_service_id } = useParams();

  React.useEffect(() => {
    if (!product_service_id) return;
    getProductServiceById(product_service_id);
  }, [product_service_id]);

  return loadingProductService ? (
    <Spinner />
  ) : (
    <ProductServiceForm productServiceID={product_service_id} />
  );
};

const mapStateToProps = (state) => ({
  loadingProductService: state.productService.loadingProductService,
});

export default connect(mapStateToProps, { getProductServiceById })(
  EditProductService
);
