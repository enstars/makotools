import Link from "next/link";
import styled from "styled-components";

import {
  Footer,
  Paper,
  Title,
  Text,
  Anchor,
  Divider,
  useMantineTheme,
} from "@mantine/core";

function Header() {
  const theme = useMantineTheme();
  return (
    <Footer
      style={{
        position: "sticky",
        bottom: 0,
        zIndex: 0,
        display: "flow-root",
        borderTop: "none",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[0],
      }}
      p="md"
    >
      {/* <div className="footer-bg">
        <Image
          src={FooterImage}
          alt="starmony dorm"
          layout="responsive"
          objectFit="cover"
        />
      </div> */}
      <Text
        size="lg"
        weight="800"
        sx={{ fontFamily: theme.headings.fontFamily }}
      >
        MakoTools
      </Text>
      <Link href="/privacy-policy" passHref>
        <Anchor component="a" size="sm">
          Privacy Policy
        </Anchor>
      </Link>
      <Divider my="sm" />
      <Text size="xs" color="dimmed">
        Not official nor related to Ensemble Stars!!, Happy Elements K.K, or
        Happy Elements in any way. All assets belong to their respective owners.
        MakoTools is a collaboration project between EN:Link, The Ensemble Stars
        Wiki, Daydream Guides, and is developed by the Enstars Dev Team!
      </Text>
    </Footer>
  );
}

export default Header;
