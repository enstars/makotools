import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";

const StyledWrapper = styled.div`
  /* color: white; */

  .es-content__wrapper {
    margin: auto;
    display: flow-root;
    max-width: 1100px;
    position: relative;
  }

  .es-content {
    margin-left: 200px;
    padding: 0px;
  }
  a {
    color: var(--hokuto-100);
  }

  .es-mainContent {
    min-height: 100vh;
    /* min-height: max(350px, 60vh); */
    display: flow-root;
    position: relative;
  }

  .content-text {
    padding: 10px 20px 20px;
  }

  --content-margin: 0.5rem;

  @media only screen and (min-width: 600px) {
    --content-margin: 1rem;
  }
`;

function Layout({ children: Component, footer = true }) {
  const location = useRouter();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
    // console.log(currentPath);
  }, [location]);
  return (
    <StyledWrapper>
      <div className="es-content__wrapper">
        <Sidebar />
        <div className="es-content">
          <Header />
          <main className="es-mainContent">
            <ErrorBoundary>{Component}</ErrorBoundary>
          </main>
          {footer ? <Footer /> : null}
        </div>
      </div>
    </StyledWrapper>
  );
}
export default Layout;
