import styled from "styled-components";
const contentWidth = 900;
const MainContent = styled.main`
  margin: var(--content-margin);
`;
function Main({ fullWidth, children }) {
  if (fullWidth) return <MainContent>{children}</MainContent>;
  return (
    <MainContent style={{ maxWidth: contentWidth, margin: "auto" }}>
      {children}
    </MainContent>
  );
}
export default Main;
