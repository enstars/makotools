// import React, {} from "react";
import styled from "styled-components";
const StyledInput = styled.button`
  box-shadow: var(--shadow);
  border: solid 1px var(--ritsu-600);
  background: var(--ritsu-700);
  border-radius: 0.25rem;
  overflow: hidden;
  transition: background 0.2s ease;

  color: inherit;
  padding: 0.5em 0.75em;
  margin: 0.25em 0;

  &:hover,
  &:active {
    background: var(--ritsu-600);
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;
export default StyledInput;
