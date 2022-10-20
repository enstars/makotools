import Link from "next/link";
import {
  Footer,
  Text,
  Anchor,
  useMantineTheme,
  Stack,
  Group,
  Box,
  Container,
} from "@mantine/core";

import { CONSTANTS } from "../../../services/makotools/constants";
import Affiliates from "../../../assets/Affiliates/affiliates.svg";

import SvgBackground from "./mkt_bg.svg";
import SupportBanner from "./SupportBanner";

function PageFooter({ wide, textOnly }: { wide: boolean; textOnly: boolean }) {
  const theme = useMantineTheme();
  return (
    <Footer
      style={{
        top: 0,
        zIndex: 0,
        display: "flow-root",
        borderTop: "none",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[0],
        position: "relative",
        overflow: "hidden",
      }}
      pt="xl"
      p="md"
      height="auto"
    >
      <Text
        color="dimmed"
        sx={{
          svg: {
            position: "absolute",
            // height: "100%",
            // width: "100%",
            right: 0,
            bottom: 0,
            strokeWidth: 10,
            objectPosition: "right",
            objectFit: "cover",
            maskImage: "linear-gradient(135deg, transparent 70%, #fff6 100%)",
            pointerEvents: "none",

            width: "200%",
            height: "140%",
          },
        }}
      >
        <SvgBackground
          viewBox="0 0 5266 5266"
          preserveAspectRatio="xMaxYMax meet"
        />
      </Text>
      <Container
        size={"sm"}
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
            <SupportBanner mb="xs" sx={{ width: "100%" }} />
            <Link href="/issues" passHref>
              <Anchor component="a" size="sm">
                Issues and Suggestions
              </Anchor>
            </Link>
            <Link href={`mailto:${CONSTANTS.MAKOTOOLS.EMAIL}`} passHref>
              <Anchor component="a" size="sm">
                Contact Us
              </Anchor>
            </Link>
            <Link href="/about" passHref>
              <Anchor component="a" size="sm">
                About MakoTools
              </Anchor>
            </Link>
            <Text color="dimmed" size="xs" mt="xs">
              <Link href="/about/terms" passHref>
                <Anchor component="a" inherit color="dimmed">
                  Terms of Service
                </Anchor>
              </Link>
              {" · "}
              <Link href="/about/privacy" passHref>
                <Anchor component="a" inherit color="dimmed">
                  Privacy Policy
                </Anchor>
              </Link>
            </Text>
          </Stack>

          <Box sx={{ flexGrow: 0.1 }} />
          <Box sx={{ flex: "1 1 350px", maxWidth: 560 }}>
            {!textOnly && (
              <Text
                color="dimmed"
                mb="xs"
                sx={{
                  svg: {
                    maxWidth: 500,
                    minWidth: 250,
                    width: "60%",
                  },
                }}
              >
                <Affiliates viewBox="0 0 898 239" height={"auto"} />
              </Text>
            )}
            <Text size="xs" color="dimmed" mt="xs">
              MakoTools is a non-commercial open-sourced fan project. Makotools
              is not official nor related to Ensemble Stars!!, Cacalia Studio,
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
