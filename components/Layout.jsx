import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";

const StyledWrapper = styled.div`
  color: white;

  .es-content__wrapper {
    margin: auto;
    display: flow-root;
    max-width: 1100px;
    position: relative;

    &::before {
      content: "";
      display: block;
      position: fixed;
      width: calc((100vw - 1100px) / 2);
      /* background: red; */
      top: 0px;
      /* left: 0px; */
      transform: translate(-100%, 0);
      height: 30px;
      box-sizing: border-box;
      border-bottom: solid 1px hsla(0, 0%, 100%, 0.2);
    }
  }

  .es-content {
    margin-left: 200px;
    padding: 0px;
  }
  a {
    color: #b7e5f4;
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

  @media only screen and (min-width: 1100px) {
    .es-content__wrapper {
      border-right: solid 1px hsla(0, 0%, 100%, 0.2);
    }
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
