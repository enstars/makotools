// import React, {} from "react";
import Input from "./Input";
import styled from "styled-components";
const StyledInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-top: 0.5em;

  ${(props) =>
    props.loading &&
    `
  mask: 0%/50% 100% repeat-x
    linear-gradient(to right, #fff2 0%, #fff5 50%, #fff2 100%);
  animation: 1s scrollMask infinite linear;
  `}

  @keyframes scrollMask {
    from {
      mask-position-x: 0%;
    }
    to {
      mask-position-x: 100%;
    }
  }
`;
const StyledInputLabel = styled.div`
  flex: 0 0 100%;
  font-size: 0.9em;
  font-weight: 500;
`;
function InputWithLabel({ loading, label, ...props }) {
  return (
    <StyledInputWrapper {...{ loading }}>
      <StyledInputLabel>{label}</StyledInputLabel>
      <Input {...props} />
    </StyledInputWrapper>
  );
}
export default InputWithLabel;
