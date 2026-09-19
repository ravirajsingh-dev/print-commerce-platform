import React from "react";
import { connect } from "react-redux";
import { Button, Card } from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { PropTypes } from "prop-types";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

import { getProductServicesListByID } from "@src/actions/commonActions";
import PiDataTable from "@src/views/DataTable/PiDataTable";

import { create } from "@src/actions/orderActions";

const ProductServices = ({
  getProductServicesListByID,
  productServicesList,
  loggenInUser,
  loadingOrder,
  create,
}) => {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const location = useLocation();
  const title = `${location.state?.title} Services` || "Product Services";

  React.useEffect(() => {
    if (!product_id) return;

    getProductServicesListByID(product_id);
  }, [product_id]);

  const columns = [
    {
      name: "Name",
      cell: (row) => row.title,
      width: "30%",
    },
    {
      name: "Quality",
      selector: (row) => row.quality?.title || "Best Quality",
      width: "20%",
    },
    {
      name: "Price",
      selector: (row) =>
        row.quality
          ? row.quality?.price
          : row?.price_per_square
          ? row?.price_per_square
          : row?.price,
      width: "20%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "calc(30% - 48px)",
    },
  ];

  const conditionalRowStyles = [
    {
      when: () => true, // Always applies
      style: (row) => ({
        backgroundColor: row.index % 2 === 0 ? "#ffece5" : "#fff", // Use row's ID
        color: "black",
      }),
    },
  ];

  React.useEffect(
    (each) => {
      if (!productServicesList?.length) return;
      const dataWithIndex = productServicesList.map((row, index) => ({
        ...row,
        index: index, // Add an index property
      }));

      setList(dataWithIndex);

      return () => {
        setList([]);
      };
    },
    [productServicesList]
  );

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  React.useEffect(() => {
    if (!loggenInUser?._id) {
      return navigate("/login");
    }
  }, [loggenInUser]);

  const onClickHandle = (e) => {
    e.preventDefault();

    if (!loggenInUser?._id) {
      return navigate("/login");
    }

    const orderItems = selectedRows.map((row) => ({
      product: row.product,
      service_id: row._id,
      quality: row.quality ? row.quality.title : null,
      price: row.quality ? row.quality.price : row.price,
    }));

    const preparedOrder = {
      name: loggenInUser ? loggenInUser.name : "New Order",
      order_items: orderItems,
    };

    create(preparedOrder, navigate).then((res) => {});
  };

  return (
    <>
      <AppBreadCrumb
        title={title}
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Our Services", url: "/our-services" },
          { label: title },
        ]}
      />

      <div className="elementor-element elementor-element-bba8448 e-con-full e-flex e-con e-parent">
        <div className="elementor-element elementor-element-c1529ca elementor-widget elementor-widget-rr-services">
          <div className="elementor-widget-container">
            <section className="latest-service__area pb-90 p-relative overflow-hidden latest-service-bg">
              <div className="container p-relative">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="latest-service__title-box mb-40 text-center">
                      <div className="latest-service__title-box-subtitle wow fadeInLeft animated">
                        <h6>{title}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="row customTileCardDesign"> */}
                {/* {productServicesList?.map((productService, i) => (
                   
                    // <div
                    //   className="col-xl-3 col-lg-3 col-md-4 col-12 mb-30 wow fadeInUp"
                    //   key={productService._id}
                    // >
                    //   <Link
                    //     to={
                    //       productService && productService?.isCatExist
                    //         ? `/services-categories/${productService._id}`
                    //         : `/user/create-order`
                    //     }
                    //     state={{
                    //       title: productService.title,
                    //       orderProduct: { ProductServices: productService },
                    //     }}
                    //   >
                    //     <div className="latest-service__item-custom text-center">
                    //       <div className="latest-service__item-icon-custom">
                    //         <img
                    //           src={productService.image}
                    //           alt={productService.title}
                    //         />
                    //       </div>
                    //       <div className="latest-service__item-title">
                    //         {productService.title}
                    //       </div>
                    //       <div className="latest-service__item-text">
                    //         <p className="rr-el-re-dec">
                    //           {productService.description}
                    //         </p>
                    //       </div>
                    //     </div>
                    //   </Link>
                    // </div>
                  ))} */}

                <PiDataTable
                  columns={columns}
                  data={list}
                  count={0}
                  params={{}}
                  setParams={{}}
                  responsive
                  striped={true}
                  selectableRows
                  progressPending={false}
                  highlightOnHover
                  persistTableHead={false}
                  pagination={false}
                  // selectableRowsNoSelectAll={true}
                  conditionalRowStyles={conditionalRowStyles}
                  onSelectedRowsChange={handleSelectedRowsChange}
                />
                {/* </div> */}
              </div>

              <div className="text-end container mt-5">
                {selectedRows.length > 0 ? (
                  <Button
                    className="rr-btn"
                    onClick={onClickHandle}
                    disabled={loadingOrder}
                  >
                    {loadingOrder ? "Creating your order..." : "Create Order"}
                  </Button>
                ) : (
                  <h5 className="">
                    Please select a service to create an order.
                  </h5>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  productServicesList: state.common.productServicesList,
  loggenInUser: state.auth.user,
  loadingOrder: state.order.loadingOrder,
});

export default connect(mapStateToProps, { getProductServicesListByID, create })(
  ProductServices
);
