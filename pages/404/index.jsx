import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import variant404Image1 from "../../public/404_1.png";
import variant404Image2 from "../../public/404_2.png";
import variant404Image3 from "../../public/404_3.png";
// import "./NoMatch.module.scss";

const Styled404 = styled.div`
  height: 100vh;

  .es-404__content {
    position: absolute;
    z-index: 2;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding: 30px;
    /* border-radius: 10px; */
    color: white;
    filter: drop-shadow(0px 0px 10px hsla(0, 0%, 0%, 1));

    h1 {
      margin: 0 0 0.5em;
      line-height: 1.15;
    }

    a {
      display: inline-block;
      background: white;
      color: black;
      text-decoration: none;
      font-weight: 800;
      padding: 10px 15px;
      border-radius: 5px;
      transition: 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(1);
      }
    }
  }

  .es-404__image {
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    /* border-radius: 10px; */

    background: linear-gradient(
        to bottom,
        transparent 40%,
        hsla(0, 0%, 0%, 0.7) 100%
      ),
      center/cover no-repeat var(--es-splash-image),
      center/cover no-repeat var(--es-splash-image--blur), #2a2c8e;
  }
`;

function NoMatch() {
  // console.log(variant404Image1);
  const location = useRouter();
  const [random404message, setRandom404message] = useState({
    text: "",
    image: variant404Image1,
  });

  useEffect(() => {
    const variant404 = Math.floor(Math.random() * 3);
    switch (variant404) {
      case 0:
        setRandom404message({
          text: "Damnit, I can't find the page you're looking for…",
          image: variant404Image1,
        });
        break;
      case 1:
        setRandom404message({
          text: "No, this is no use… I can't find any inspiration!",
          image: variant404Image2,
        });
        break;
      case 2:
        setRandom404message({
          text: "W-what do you mean there's no page at this address?!",
          image: variant404Image3,
        });
        break;
      default:
        setRandom404message({
          text: "Damnit, I can't find the page you're looking for…",
          image: variant404Image1,
        });
    }
  }, [location]);

  return (
    <Styled404>
      <div className="es-404__content">
        <h1>{random404message.text}</h1>
        <Link href="/">
          <a>Back to Home</a>
        </Link>
      </div>
      <div
        className="es-404__image"
        style={{
          "--es-splash-image": `url("${random404message.image.src}")`,
          "--es-splash-image--blur": `url("${random404message.image.blurDataURL}")`,
        }}
      />
    </Styled404>
  );
}

export default NoMatch;

import Layout from "../../components/Layout";
NoMatch.getLayout = function getLayout(page) {
  return <Layout footer={false}>{page}</Layout>;
};
