import { ActionIcon, Anchor, Button, Text } from "@mantine/core";
import { AQ } from "country-flag-icons/react/3x2";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { openModal, closeAllModals } from "@mantine/modals";
import { useCallback, useEffect } from "react";

import { gameRegions } from "pages/settings/content/Region";
import useUser from "services/firebase/user";
import { GameRegion } from "types/game";
import notify from "services/libraries/notify";

export function RegionSwitcher() {
  const { t } = useTranslation("regions");
  const router = useRouter();

  // get region name from the router
  const regionName = router.query.region?.[0] as string;

  const pathWithoutRegion = router.asPath.replace(
    `/${router.query.region?.[0] as string}`,
    ""
  );

  const openRegionSwitcher = useCallback(() => {
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
      size: "xs",
    });
  }, [pathWithoutRegion, regionName, router, t]);

  // if there is no region in the router, hide component and log error
  if (!regionName) {
    console.error("No region in the router");
    return null;
  }

  const RegionIcon = gameRegions.find((r) => r.value === regionName)?.icon || (
    <AQ height={16} style={{ borderRadius: 3 }} />
  );

  return (
    <ActionIcon
      size="md"
      sx={{ display: "inline-block", verticalAlign: 4, marginRight: 8 }}
      onClick={openRegionSwitcher}
    >
      {RegionIcon}
    </ActionIcon>
  );
}

export default function RegionInfo({ region }: { region: GameRegion }) {
  const { t } = useTranslation("regions");
  const router = useRouter();
  const { userDB } = useUser();

  // get region name from the router
  const regionName = router.query.region?.[0] as string;

  const userRegionSetting = (userDB && userDB?.setting__game_region) || "en";

  useEffect(() => {
    if (localStorage.getItem("mktls__notices__defaultRegionInfoShown")) return;

    notify("info", {
      message: (
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
      ),
      onClose: () => {
        localStorage.setItem("mktls__notices__defaultRegionInfoShown", "true");
      },
      autoClose: false,
    });
  }, [userRegionSetting, t]);

  // if there is no region in the router, hide component and log error
  if (!regionName) {
    console.error("No region in the router");
    return null;
  }

  const isCorrectRegion = userDB ? userRegionSetting === regionName : true;

  const pathWithoutRegion = router.asPath.replace(
    `/${router.query.region?.[0] as string}`,
    ""
  );

  if (isCorrectRegion) return null;
  return (
    <Text color="dimmed" size="sm" my="xs">
      <Trans
        i18nKey="regions:incorrect_region"
        components={[<Text inherit sx={{ fontWeight: 700 }} span key={0} />]}
        values={{
          region: t(`region_shorthand.${region}`),
        }}
      />{" "}
      <Anchor
        weight={700}
        span
        color="dimmed"
        component={Link}
        href={`/${pathWithoutRegion}/${userRegionSetting}`}
      >
        {t(`switch_to_correct_region`, {
          region: t(`region.${userRegionSetting}`),
        })}
      </Anchor>
    </Text>
  );
}
