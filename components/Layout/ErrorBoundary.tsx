import React from "react";
import { Anchor, Center, Box, Text, Button, Stack } from "@mantine/core";
import Router from "next/router";
import Image from "next/image";

import Jun from "assets/ErrorBoundary/Jun.webp";

interface ErrorState {
  hasError: boolean;
}

interface ErrorProps {
  children: any;
}

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Center sx={{ width: "100%", height: "100%" }}>
          <Box sx={{ maxWidth: 250, marginTop: 24 }}>
            <Image src={Jun} width={36} height={36} alt="Jun eating a roll" />
            <Text size="md" weight="700">
              Ah fuck—an error occured!
            </Text>
            <Text size="sm">
              Hopefully we know about this one.{" "}
              <Anchor inherit href="/issues">
                Wanna help report the bug to us anyways?
              </Anchor>
            </Text>
            <Stack align="end" mt="sm">
              <Stack align="center" spacing={0}>
                <Button onClick={() => Router.reload()}>GODDAMN!</Button>
                <Text size="xs" color="dimmed" mt={5}>
                  (Refresh the page)
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Center>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
