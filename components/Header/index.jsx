import { useState, useEffect } from "react";
import styled from "styled-components";
import Breadcrumbs from "./Breadcrumbs";

const HeaderWrapper = styled.header`
  /* border-bottom: solid 1px hsla(0, 0%, 100%, 0.2); */
  padding: 5px 10px;
  display: flex;
  align-items: center;
  height: 30px;
  position: fixed;
  z-index: 100;
  width: calc(100% - 200px);
  background: hsla(var(--ritsu-900--hsl), 0.8);
  transition: transform 0.2s ease;
`;

function Header() {
  const [scrollPastHeader, setScrollPastHeader] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollPastHeader(window.scrollY > 40);
    });
  }, []);
  return (
    <HeaderWrapper
      style={{ transform: `translate(0%, ${scrollPastHeader ? 0 : -100}%)` }}
    >
      <Breadcrumbs />
    </HeaderWrapper>
  );
}

export default Header;
