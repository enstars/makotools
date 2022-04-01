// import React, {} from "react";
import styled from "styled-components";
const StyledInput = styled.input`
  background: none;
  color: inherit;
  padding: 0.5em 0.75em;
  margin: 0.25em 0;
  border-radius: 0.25rem;
  border: solid 1px var(--ritsu-600);
  transition: 0.2s ease;
  width: 100%;
  flex: 1 1 0;

  &:hover {
    border-color: var(--ritsu-500);
  }
  &:focus {
    border-color: var(--ritsu-400);
    outline: none;
    padding-left: 1em;
  }
`;

function Input({ customInput, label, after, ...props }) {
  return (
    <>
      {customInput || <StyledInput {...props} />}
      {after}
    </>
  );
}
export default Input;
