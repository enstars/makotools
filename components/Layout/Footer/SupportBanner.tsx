import { Box, Button, Divider, Paper, Text } from "@mantine/core";
import { IconBrandPatreon } from "@tabler/icons";
import Link from "next/link";
import React from "react";

function SupportBanner(props: any) {
  return (
    <>
      <Paper withBorder radius="sm" p="xs" {...props}>
        <Link href="https://www.patreon.com/makotools" passHref>
          <Button
            sx={{ width: "100%" }}
            size="xs"
            component="a"
            color="orange"
            variant="light"
            leftIcon={<IconBrandPatreon size={14} />}
          >
            Support us on Patreon!
          </Button>
        </Link>
        <Text size="xs" color="dimmed" mt="xs" weight={500}>
          We&apos;re in need of server funds!
        </Text>
      </Paper>
    </>
  );
}

export default SupportBanner;
