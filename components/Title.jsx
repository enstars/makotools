import styled from "styled-components";
import Breadcrumbs from "./Breadcrumbs";
const StyledWrapper = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  padding: 10px 20px 10px;
  --backgroundColor: #0e2dc8;

  background: linear-gradient(
    315deg,
    var(--backgroundColor) -50%,
    transparent 100%
  );
  color: white;
  user-select: none;
  /* border-radius: 5px 5px 0px 0px; */
  overflow: hidden;
  position: relative;

  h1 {
    margin: 0;
    font-size: 2.5em;
    position: relative;
    z-index: 10;
  }
`;
function Title({ title, color = "#0e2dc8", children }) {
  return (
    <StyledWrapper style={{ "--backgroundColor": color }}>
      <Breadcrumbs />
      <h1>{title}</h1>
      {children}
    </StyledWrapper>
  );
}
export default Title;
