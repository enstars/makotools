import styled from "styled-components";

const StyledCard = styled.div`
  box-shadow: var(--shadow);
  border: solid 1px var(--ritsu-600);
  background: var(--ritsu-700);
  border-radius: 0.25rem;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
  &:active {
    transform: scale(1.01);
  }
`;

export default StyledCard;
