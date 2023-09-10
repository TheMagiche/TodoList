import React from "react";

const FooterComponent: React.FC = () => {
  return (
    <>
      <div className="footer-container">
        <p>&#169; Mark Chege {new Date().getFullYear()}</p>
      </div>
    </>
  );
};

export default FooterComponent;
