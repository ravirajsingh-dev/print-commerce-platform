import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";

import Tile from "@src/views/commonComponents/mainCard/Tile";
import { getComplaintsList } from "@src/actions/complaintActions";
import BouncingLoader from "@src/views/spinners/BouncingLoader";

const ComplaintsList = ({ loggedInUser, getComplaintsList }) => {
  const [loading, setLoading] = React.useState(false);
  const [complaintsList, setComplaintsList] = React.useState([]);
  const initialSortingParams = {
    limit: 50,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [params, setParams] = React.useState(initialSortingParams);

  React.useEffect(() => {
    if (!loggedInUser) return;
    setLoading(true);
    getComplaintsList(params).then((res) => {
      setLoading(false);

      setComplaintsList(res?.response[0]?.data);
    });
  }, [getComplaintsList, loggedInUser, params]);

  return (
    <>
      <Row>
        <Col xs="12">
          <div className="customTileCardDesign">
            <div className="heading-div">
              <div className="title py-2">Complaints</div>
            </div>
            {loading ? (
              <BouncingLoader minHeight="200px" />
            ) : complaintsList.length > 0 ? (
              complaintsList.map((each, i) => (
                <Row className="tile-body" key={each._id}>
                  <Col xs="12" sm="1" md="1" lg="1">
                    <Tile label="SR." value={i + 1} />
                  </Col>
                  <Col xs="12" sm="6" md="3" lg="2">
                    <Tile label="Order Number" value={`${each.orderNumber}`} />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Description"
                      value={each.complaintDescription}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="3" lg="2">
                    <Tile
                      label="Date"
                      value={moment(each.createdAt).format(
                        "MMM DD, YYYY, hh:mm a"
                      )}
                    />
                  </Col>
                  {each.file ? (
                    <Col xs="12" sm="6" md="3" lg="2">
                      <Tile label="Image" value={each.file} isImage={true} />
                    </Col>
                  ) : null}
                </Row>
              ))
            ) : (
              <Row className="no-result">
                <Col xs="12" className="text-center">
                  No Complaints found.
                </Col>
              </Row>
            )}

            {/* {!loading && data.length > 0 && (
              <Row>
                <Col xs="12">
                  <AppPagination
                    count={count}
                    params={params}
                    setParams={setParams}
                  />
                </Col>
              </Row>
            )} */}
          </div>
        </Col>
      </Row>
    </>
  );
};

ComplaintsList.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth?.user || {},
});

export default connect(mapStateToProps, { getComplaintsList })(ComplaintsList);
