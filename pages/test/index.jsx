import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Title from "../../components/PageTitle";
import Main from "../../components/Main";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("../../components/Homepage3D"), {
  ssr: false,
});

const StyledWrapper = styled.div``;

function Characters() {
  return (
    <>
      <StyledWrapper>
        <Title title="Test"></Title>
        <Main fullWidth={true}>
          <Spline />
        </Main>
      </StyledWrapper>
    </>
  );
}

export default Characters;

import Layout from "../../components/Layout";
Characters.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
