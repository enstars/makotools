import React, { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import variant404Image1 from "../../public/404_1.png";
import variant404Image2 from "../../public/404_2.png";
import variant404Image3 from "../../public/404_3.png";
import {
  Button,
  Paper,
  Text,
  Group,
  Box,
  Center,
  Title,
  Image,
} from "@mantine/core";
// import "./NoMatch.module.scss";

function NoMatch() {
  // console.log(variant404Image1);
  const location = useRouter();
  const [random404message, setRandom404message] = useState({
    text: "",
    image: variant404Image1,
  });

  useEffect(() => {
    const variant404 = Math.floor(Math.random() * 2);
    switch (variant404) {
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
    <>
      <Title mt={64} mb="sm">
        <Text component="span" inherit color="dimmed">
          404
        </Text>{" "}
        Page Not Found
      </Title>
      <Paper
        radius="md"
        sx={{
          overflow: "hidden",
          display: "flex",
          width: "100%",
          height: 200,
          img: {
            objectFit: "cover",
            objectPosition: "top",
          },
        }}
      >
        <Image src={random404message.image.src} alt="" />
      </Paper>
      <Text mt="xs" mb="sm" weight="500" size="sm" color="dimmed">
        {random404message.text}
      </Text>
      <Link href="/" passHref>
        <Button component="a" px="xl">
          Back to Home
        </Button>
      </Link>
    </>
  );
}

export default NoMatch;

import Layout from "../../components/Layout";
NoMatch.getLayout = function getLayout(page) {
  return <Layout footer={false}>{page}</Layout>;
};
