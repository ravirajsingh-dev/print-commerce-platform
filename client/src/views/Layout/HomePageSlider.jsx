import React from "react";
import { connect } from "react-redux";
import { Carousel, Image, Container } from "react-bootstrap";
import ImageIS from "@assets/images/projact-img3.jpg";
import { getBannersList } from "@src/actions/commonActions";
import BouncingLoader from "../spinners/BouncingLoader";

const HomePageSlider = ({
  getBannersList,
  bannersList,
  laodingBannersList,
}) => {
  React.useEffect(() => {
    getBannersList();
  }, []);

  return (
    <>
      {laodingBannersList ? (
        <BouncingLoader minHeight="300px" />
      ) : bannersList && bannersList.length > 0 ? (
        <Carousel controls={false} indicators={true}>
          {bannersList.map((slide, index) => (
            <Carousel.Item key={index} interval={3000}>
              <Image
                src={slide.image}
                // fluid
                style={
                  {
                    // maxHeight: "300px",
                    // minHeight: "300px",
                    // width: "100%",
                  }
                }
              />
              <Carousel.Caption>
                <h3>{slide.title}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
  bannersList: state.common.bannersList,
  laodingBannersList: state.common.laodingBannersList,
});

export default connect(mapStateToProps, {
  getBannersList,
})(HomePageSlider);
