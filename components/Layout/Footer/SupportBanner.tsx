import { NavLink, Paper, PaperProps, Text } from "@mantine/core";
import { IconBrandPatreon } from "@tabler/icons";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";

function SupportBanner(props: PaperProps) {
  const { t } = useTranslation("footer");
  return (
    <>
      <Paper {...props}>
        <NavLink
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
          })}
          component={Link}
          href="https://www.patreon.com/makotools"
          color="orange"
          variant="filled"
          active
          icon={<IconBrandPatreon size={16} />}
          label={<Text weight={700}>{t("patreonTitle")}</Text>}
          description={t("patreonDesc")}
          target="_blank"
        />
      </Paper>
    </>
  );
}

export default SupportBanner;
