import styled from "styled-components";
import Breadcrumbs from "./Header/Breadcrumbs";
const StyledWrapper = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  padding: 1.25rem;
  background: var(--ritsu-700);

  color: white;
  user-select: none;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;

  h1 {
    margin: 0;
    font-size: 2.5em;
    position: relative;
    z-index: 10;
    font-weight: 900;
    font-family: "Metropolis";
    line-height: 1;
  }

  margin: var(--content-margin);
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
