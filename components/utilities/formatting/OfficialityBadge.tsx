import { IconBadge, IconBadgeOff } from "@tabler/icons-react";
import { Group, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { useMemo } from "react";

import { Lang } from "types/makotools";
import useUser from "services/firebase/user";

function OfficialityBadge({
  langData,
  names,
  languages,
}: {
  langData: Lang;
  names?: string[];
  languages?: Lang[];
}) {
  const user = useUser();
  const showTlBadge = useMemo(() => {
    return (user.loggedIn && user?.db?.setting__show_tl_badge) || "none";
  }, [user]);

  const tooltipLabel = useMemo(() => {
    if (names && languages) {
      return (
        <Stack spacing={4}>
          {languages.map((lang, i) => (
            <Group key={i} spacing={0} noWrap align="flex-start">
              <ThemeIcon size="sm" variant="default">
                <Text inline size={8}>
                  {lang.locale.toLocaleUpperCase()}
                </Text>
              </ThemeIcon>
              <ThemeIcon size="sm" variant="default">
                {lang.source ? (
                  <IconBadge size={12} />
                ) : (
                  <IconBadgeOff size={12} />
                )}
              </ThemeIcon>
              <Text
                size="xs"
                weight={500}
                ml="xs"
                sx={{
                  maxWidth: "100%",
                  whiteSpace: "initial",
                }}
                color={i > 0 ? "dimmed" : undefined}
              >
                {names[i]}
              </Text>
            </Group>
          ))}
        </Stack>
      );
    }

    return (
      <Text size="xs" weight={500}>
        {`${langData.source ? "Official" : "Unofficial"} Translation`}
      </Text>
    );
  }, [names, languages, langData]);

  if (langData.locale !== "en") return null;
  if (showTlBadge === "none") return null;
  if (showTlBadge === "unofficial" && langData.source) return null;

  return (
    <Text
      component="span"
      inherit
      inline
      color="dimmed"
      sx={{ verticalAlign: -2, lineHeight: 0 }}
    >
      <Tooltip p="xs" label={tooltipLabel}>
        {langData.source ? (
          <IconBadge size="1em" />
        ) : (
          <IconBadgeOff size="1em" />
        )}
      </Tooltip>
    </Text>
  );
}

export default OfficialityBadge;
