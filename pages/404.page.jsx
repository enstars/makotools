import React, { useState, useEffect } from "react";
import Link from "next/link";
import variant404Image1 from "../assets/404/404_1.png";
import variant404Image2 from "../assets/404/404_2.png";
import variant404Image3 from "../assets/404/404_3.png";
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
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const variant = Math.floor(Math.random() * 2);
    const options = [
      {
        text: "No, this is no use… I can't find any inspiration!",
        image: variant404Image2,
      },
      {
        text: "W-what do you mean there's no page at this address?!",
        image: variant404Image3,
      },
      {
        text: "Damnit, I can't find the page you're looking for…",
        image: variant404Image1,
      },
    ];

    setMessage(options[variant]);
  }, []);

  return (
    <>
      <Title mt={64} mb="sm">
        <Text component="span" inherit color="dimmed">
          404
        </Text>{" "}
        Page Not Found
      </Title>
      {message && (
        <>
          <Image
            src={message.image.src}
            alt=""
            withPlaceholder
            height={200}
            radius="md"
            sx={{
              img: { objectFit: "cover", objectPosition: "top" },
            }}
          />
          <Text mt="xs" mb="sm" weight="500" size="sm" color="dimmed">
            {message.text}
          </Text>
          <Link href="/" passHref>
            <Button component="a" px="xl">
              Back to Home
            </Button>
          </Link>
        </>
      )}
    </>
  );
}

export default NoMatch;

import Layout from "../components/Layout";
NoMatch.getLayout = function getLayout(page) {
  return <Layout hideFooter>{page}</Layout>;
};