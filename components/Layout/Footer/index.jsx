import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

import {
  Footer,
  Text,
  Anchor,
  Divider,
  useMantineTheme,
  Stack,
  Group,
  Box,
  Container,
} from "@mantine/core";

import { MAKOTOOLS } from "../../../services/constants";
import MakotoolsLight from "../../../assets/Logo/mkt_light.svg?url";
import MakotoolsDark from "../../../assets/Logo/mkt_dark.svg?url";
import Affiliates from "../../../assets/Affiliates/affiliates.svg";

import SupportBanner from "./SupportBanner";

function PageFooter({ wide, textOnly }) {
  const theme = useMantineTheme();
  return (
    <Footer
      style={{
        // position: "sticky",
        top: 0,
        // bottom: 0,
        zIndex: 0,
        display: "flow-root",
        borderTop: "none",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.fn.lighten(theme.colors.gray[0], 0.3),
      }}
      pt="xl"
      p="md"
    >
      <Container
        size={wide ? "xl" : "sm"}
        px="xl"
        py="md"
        sx={(theme) => ({
          width: "100%",
          "@media (max-width: 768px)": {
            padding: theme.spacing.md,
          },
        })}
      >
        <Group
          sx={{
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
          spacing="xs"
        >
          <Stack
            spacing={3}
            sx={{
              flexBasis: 150,
              maxWidth: 350,
              flexGrow: 1,
              alignItems: "flex-start",
            }}
            mb="xl"
          >
            {!textOnly && (
              <>
                <Image
                  src={
                    theme.colorScheme === "dark"
                      ? MakotoolsDark
                      : MakotoolsLight
                  }
                  alt="MakoTools site logo"
                  width={125}
                  height={44}
                  objectFit="contain"
                />
                <Divider
                  my="sm"
                  mb="xs"
                  size="xs"
                  sx={{ alignSelf: "stretch" }}
                />
              </>
            )}
            <SupportBanner mb="xs" sx={{ width: "100%" }} />
            <Link href="/issues" passHref>
              <Anchor component="a" size="sm">
                Issues and Suggestions
              </Anchor>
            </Link>
            <Link href={`mailto:${MAKOTOOLS.EMAIL}`} passHref>
              <Anchor component="a" size="sm">
                Contact Us
              </Anchor>
            </Link>
            <Link href="/about/acknowledgements" passHref>
              <Anchor component="a" size="sm">
                Acknowledgements
              </Anchor>
            </Link>
            <Divider my="xs" sx={{ width: "100%" }} />
            <Link href="/about/translations" passHref>
              <Anchor component="a" size="sm">
                About Translations
              </Anchor>
            </Link>
            <Link href="/about/terms" passHref>
              <Anchor component="a" size="sm">
                Terms of Service
              </Anchor>
            </Link>
            <Link href="/about/privacy" passHref>
              <Anchor component="a" size="sm">
                Privacy Policy
              </Anchor>
            </Link>
          </Stack>

          <Box sx={{ flexGrow: 0.1 }}></Box>
          <Box sx={{ flex: "1 1 350px", maxWidth: 560 }}>
            {!textOnly && (
              <Text
                color="dimmed"
                mb="xs"
                sx={{
                  svg: {
                    maxWidth: "calc(100% - var(--mantine-navbar-width))",
                    aspectRatio: "270/72",
                  },
                }}
              >
                <Affiliates viewBox="0 0 898 239" width={270} height={72} />
              </Text>
            )}
            <Text size="xs" color="dimmed">
              MakoTools is a collaboration project between{" "}
              <Anchor
                inherit
                href="https://twitter.com/enstars_link"
                target="_blank"
              >
                EN:Link
              </Anchor>
              , The{" "}
              <Anchor
                inherit
                href="https://ensemble-stars.fandom.com"
                target="_blank"
              >
                English
              </Anchor>
              {" / "}
              <Anchor
                inherit
                href="https://ensemblestars.huijiwiki.com"
                target="_blank"
              >
                Chinese
              </Anchor>{" "}
              Ensemble Stars Wiki,{" "}
              <Anchor
                inherit
                href="https://twitter.com/DaydreamGuides"
                target="_blank"
              >
                Daydream Guides
              </Anchor>
              , and is developed by the{" "}
              <Anchor inherit href="https://github.com/enstars" target="_blank">
                Enstars Dev Team
              </Anchor>
              !
            </Text>
            <Text size="xs" color="dimmed" mt="xs">
              Not official nor related to Ensemble Stars!!, Cacalia Studio,
              Happy Elements K.K, or Happy Elements in any way. All assets
              belong to their respective owners.
            </Text>
          </Box>
        </Group>
      </Container>
    </Footer>
  );
}

export default PageFooter;
