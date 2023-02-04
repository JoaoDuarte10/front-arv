import styled from "styled-components";

export const ContainerFilter = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  width: 500px;
  box-shadow: 2px 2px 4px 2px lightgray;
  position: absolute;
  z-index: 1;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

export const ContainerRowsFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 5px 10px;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`;

export const ContainerColumnSelectorFilter = styled.div`
  width: 80%;

  @media (max-width: 600px) {
    width: 100%;
  }
`;
