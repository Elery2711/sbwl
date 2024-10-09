import React, { ReactNode } from "react";
import "./styles.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center mt-24 min-h-[calc(100vh-96px)] layout-container">
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;