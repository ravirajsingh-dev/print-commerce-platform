import React from "react";
import Body from "./HomeComponents/Body";
import Sidebar from "./Sidebar/Sidebar";
import HomePageSlider from "./HomePageSlider";

const Home = () => {
  return (
    <div>
      <Sidebar />
      <HomePageSlider />
      <Body />
    </div>
  );
};

export default Home;
