import { Anchor, Box, Button, Group, Paper, Text } from "@mantine/core";
import { AQ } from "country-flag-icons/react/3x2";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { openModal, closeAllModals } from "@mantine/modals";

import { gameRegions } from "pages/settings/content/Region";
import useUser from "services/firebase/user";
import { GameRegion } from "types/game";

export default function RegionInfo({ region }: { region: GameRegion }) {
  const { t } = useTranslation("regions");
  const router = useRouter();
  const user = useUser();

  // get region name from the router
  const regionName = router.query.region?.[0] as string;

  // if there is no region in the router, hide component and log error
  if (!regionName) {
    console.error("No region in the router");
    return null;
  }

  const userRegionSetting =
    (user.loggedIn && user.db?.setting__game_region) || "en";

  const isCorrectRegion = user.loggedIn
    ? userRegionSetting === regionName
    : true;

  const RegionIcon = gameRegions.find((r) => r.value === regionName)?.icon || (
    <AQ height={16} style={{ borderRadius: 3 }} />
  );

  const pathWithoutRegion = router.asPath.replace(
    `/${router.query.region?.[0] as string}`,
    ""
  );

  return (
    <>
      <Text size="xs" my="xs" color="dimmed">
        <Trans
          i18nKey="regions:default_region_info"
          components={[
            <Text inherit sx={{ fontWeight: 700 }} span key={0} />,
            <Text
              inherit
              span
              component={Link}
              href="/settings"
              sx={{ textDecoration: "underline" }}
              key={1}
            />,
          ]}
          values={{
            region: t(`region.${userRegionSetting}`),
          }}
        />
      </Text>
      <Paper shadow="xs" radius="md" my="md" withBorder>
        <Group p="xs" spacing="xs" position="right">
          <Box
            sx={{
              "&&&": {
                flexGrow: 1,
                flexBasis: 300,
                display: "flex",
                alignItems: "center",
                justifySelf: "stretch",
              },
            }}
          >
            {RegionIcon}

            {isCorrectRegion ? (
              <Text size="sm" mx="sm" color="dimmed">
                {t(`current_region`, {
                  region: t(`region.${region}`),
                })}
              </Text>
            ) : (
              <Box>
                <Text size="sm" mx="sm">
                  <Trans
                    i18nKey="regions:incorrect_region"
                    components={[
                      <Text inherit sx={{ fontWeight: 700 }} span key={0} />,
                    ]}
                    values={{
                      region: t(`region_shorthand.${region}`),
                    }}
                  />
                </Text>
              </Box>
            )}
          </Box>
          <Box>
            {!isCorrectRegion && (
              <Button
                size="xs"
                component={Link}
                href={`/${pathWithoutRegion}/${userRegionSetting}`}
              >
                {t(`switch_to_correct_region`, {
                  region: t(`region.${userRegionSetting}`),
                })}
              </Button>
            )}
            <Button
              size="xs"
              variant="light"
              ml={4}
              onClick={() => {
                console.log(openModal);
                openModal({
                  title: t("change_region"),
                  children: (
                    <>
                      {gameRegions
                        .filter((r) => r.value !== regionName)
                        .map((r) => (
                          <Button
                            fullWidth
                            onClick={() => {
                              router.push(`/${pathWithoutRegion}/${r.value}`);
                              closeAllModals();
                            }}
                            key={r.value}
                            mt="xs"
                            leftIcon={r.icon}
                            color="gray"
                            variant="light"
                          >
                            {t(`region.${r.value}`)}
                          </Button>
                        ))}

                      <Anchor
                        onClick={() => {
                          closeAllModals();
                        }}
                        mt="lg"
                        align="center"
                        color="dimmed"
                        size="xs"
                        sx={{
                          display: "block",
                        }}
                      >
                        {t("stay_on_same_region", {
                          region: t(`region.${regionName}`),
                        })}
                      </Anchor>
                    </>
                  ),
                  centered: true,
                });
              }}
            >
              {t(`change_region_shorthand`)}
            </Button>
          </Box>
        </Group>
      </Paper>
    </>
  );
}
