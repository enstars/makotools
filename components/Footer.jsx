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
        Ensemble Square
      </Text>
      <Link href="/privacy-policy" passHref>
        <Anchor component="a">Privacy Policy</Anchor>
      </Link>
      <Divider my="sm" />
      <Text size="xs" color="dimmed">
        Not official nor related to Ensemble Stars!!, Happy Elements K.K, or
        Happy Elements in any way. All assets belong to their respective owners.
      </Text>
    </Footer>
  );
}

export default Header;
