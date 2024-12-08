import {
  Box,
  Modal,
  Stack,
  TextInput,
  Text,
  Group,
  Button,
  ActionIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import PRIVACY_LEVELS from "components/collections/privacyLevels";
import { IconCheck, IconStar } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { EditingFriendCodesState, FriendCode } from "types/makotools";
import { GameRegion } from "types/game";
import { gameRegionsWithBasic } from "services/makotools/friendCodes";

function RegionTextInput({
  icon,
  region,
  code,
  error,
  primary,
  setFriendCodes,
}: {
  icon: React.ReactNode;
  region: keyof EditingFriendCodesState;
  code: string;
  error: boolean | string;
  primary: boolean;
  setFriendCodes: Dispatch<SetStateAction<EditingFriendCodesState>>;
}) {
  const theme = useMantineTheme();
  const [debouncedCode] = useDebouncedValue(code, 300);

  const jpSchema = z
    .string()
    .length(8)
    .regex(/^[a-z0-9]+$/i);
  const globalSchema = z.string().length(10).regex(/^\d+$/);

  useEffect(() => {
    setFriendCodes((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        error: false,
      },
    }));

    if (code.length > 0) {
      if (region === "jp" || region === "ba") {
        const validateCode = jpSchema.safeParse(code);
        if (!validateCode.success) {
          setFriendCodes((prev) => ({
            ...prev,
            [region]: {
              ...prev[region],
              error:
                "Friend code must be 8 characters long and only contain alphanumeric characters",
            },
          }));
        }
      } else {
        const validateCode = globalSchema.safeParse(code);
        if (!validateCode.success) {
          setFriendCodes((prev) => ({
            ...prev,
            [region]: {
              ...prev[region],
              error:
                "Friend code must be 10 characters long and only contain numbers",
            },
          }));
        }
      }
    }
  }, [debouncedCode]);

  return (
    <>
      <TextInput
        icon={icon}
        placeholder={`${
          region === "ba" ? "Basic" : region.toUpperCase()
        } Friend Code`}
        value={code}
        onChange={(event) =>
          setFriendCodes((prev) => ({
            ...prev,
            [region]: {
              ...prev[region],
              code: event.target.value,
            },
          }))
        }
        error={error}
        rightSection={
          <Tooltip label="Mark as primary server">
            <ActionIcon
              color={theme.primaryColor}
              variant={primary ? "filled" : "default"}
              onClick={() =>
                setFriendCodes((prev) => ({
                  ...prev,
                  [region]: {
                    ...prev[region],
                    primary: !prev[region].primary,
                  },
                }))
              }
            >
              <IconStar size={16} />
            </ActionIcon>
          </Tooltip>
        }
      />
    </>
  );
}

export default function FriendCodes({
  setFriendCodeError,
  friendCodeState,
  setFriendCodeState,
}: {
  friendCodeError: boolean;
  setFriendCodeError: Dispatch<SetStateAction<boolean>>;
  friendCodeState: EditingFriendCodesState;
  setFriendCodeState: Dispatch<SetStateAction<EditingFriendCodesState>>;
}) {
  const { t } = useTranslation("user");
  const [privacyModalOpened, privacyModalHandlers] = useDisclosure(false);

  const privacyLevelIcons = PRIVACY_LEVELS.map((lvl) => <lvl.icon />);

  useEffect(() => {
    if (Object.values(friendCodeState).some((code) => code.error)) {
      setFriendCodeError(true);
    } else {
      setFriendCodeError(false);
    }
  }, [friendCodeState]);

  return (
    <>
      <Modal
        opened={privacyModalOpened}
        onClose={privacyModalHandlers.close}
        withCloseButton={false}
        centered
        size="xs"
      >
        <Text mb="xs" weight={500} size="sm">
          {t("collections.privacySetting")}
        </Text>
        <Group
          sx={{
            "& > *": {
              flex: "1 1 0",
              minWidth: 0,
            },
            "&&&&&": {
              flexWrap: "wrap",
            },
          }}
          spacing="xs"
        >
          {PRIVACY_LEVELS.map((privacyLevel) => (
            <Button
              key={privacyLevel.value}
              variant={
                privacyLevel.value ===
                (Object.values(friendCodeState)[1] as FriendCode).privacyLevel
                  ? "filled"
                  : "light"
              }
              sx={{ height: 100, alignItems: "start", minWidth: 90 }}
              p="xs"
              pt="md"
              styles={{ label: { alignItems: "start" } }}
              color={privacyLevel.color}
              onClick={() => {
                setFriendCodeState((prev) => ({
                  jp: {
                    ...prev.jp,
                    privacyLevel: privacyLevel.value,
                  },
                  kr: {
                    ...prev.kr,
                    privacyLevel: privacyLevel.value,
                  },
                  cn: {
                    ...prev.cn,
                    privacyLevel: privacyLevel.value,
                  },
                  tw: {
                    ...prev.tw,
                    privacyLevel: privacyLevel.value,
                  },
                  en: {
                    ...prev.en,
                    privacyLevel: privacyLevel.value,
                  },
                  ba: {
                    ...prev.ba,
                    privacyLevel: privacyLevel.value,
                  },
                }));
              }}
            >
              <Stack align="center" sx={{ minWidth: 0, maxWidth: "100%" }}>
                <privacyLevel.icon size={32} />
                <Text
                  weight={700}
                  size="xs"
                  sx={{ minWidth: 0, maxWidth: "100%", whiteSpace: "normal" }}
                  align="center"
                >
                  {privacyLevel.title}
                </Text>
              </Stack>
            </Button>
          ))}
        </Group>
        <Group position="right" mt="xs">
          <Button
            leftIcon={<IconCheck size={16} />}
            onClick={() => {
              privacyModalHandlers.close();
            }}
          >
            {t("done")}
          </Button>
        </Group>
      </Modal>
      <Box>
        <Stack>
          {gameRegionsWithBasic.map((region) => {
            const regionState =
              friendCodeState[region.value as keyof typeof friendCodeState];
            return (
              <RegionTextInput
                key={region.value}
                region={region.value as GameRegion | "ba"}
                icon={region.icon}
                error={regionState.error}
                primary={regionState.primary}
                code={regionState.code}
                setFriendCodes={setFriendCodeState}
              />
            );
          })}
          <Button
            leftIcon={
              privacyLevelIcons[Object.values(friendCodeState)[0].privacyLevel]
            }
            variant="outline"
            onClick={() => privacyModalHandlers.open()}
          >
            Who can view my friend codes?
          </Button>
        </Stack>
      </Box>
    </>
  );
}
