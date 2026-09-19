import React from "react";
import { Img } from "react-image";

// import NotFoundImage from "src/assets/images/404-computer.svg";

const NotFoundInner = () => {
  return (
    <div className="flex items-center justify-center content-center mt-20">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="flex justify-center items-center">
              {/* <Img src={NotFoundImage} width={400} height={500} /> */}
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">404 Not Found</h1>
        <p className="text-lg mb-6">Whoops! That page doesn’t exist.</p>
        <div className="flex justify-center space-x-4"></div>
      </div>
    </div>
  );
};

export default NotFoundInner;
