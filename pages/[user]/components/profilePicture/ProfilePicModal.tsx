/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconFlower, IconFlowerOff, IconSearch } from "@tabler/icons-react";
import Cropper from "react-easy-crop";
import { Point } from "react-easy-crop/types";
import useTranslation from "next-translate/useTranslation";

import { GameCard } from "types/game";
import { ProfilePicture, User, UserData } from "types/makotools";
import { getAssetURL } from "services/data";

function ProfilePicModal({
  opened,
  openedFunction,
  cards,
  user,
  profile,
  externalSetter,
  profileState,
}: {
  opened: boolean;
  openedFunction: any;
  cards: GameCard[];
  user: User;
  profile: UserData;
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  const { t } = useTranslation("user");
  const [currentPic, setCurrentPic] = useState<ProfilePicture>(
    profileState.profile__picture
      ? profileState.profile__picture
      : {
          id: 0,
          crop: { x: 0, y: 0, width: 50, height: 50 },
        }
  );

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const bloomed = currentPic.id > 0;

  useEffect(() => {
    if (user.loggedIn && user.db && user.db.profile__picture)
      setCurrentPic(user.db.profile__picture);
  }, [user]);

  return (
    <Modal
      opened={opened}
      size="md"
      onClose={() => openedFunction(false)}
      title={t("editAvatar")}
    >
      <Select
        aria-label={t("avatarCardCg")}
        placeholder={t("avatarSearchPlaceholder")}
        value={currentPic.id ? Math.abs(currentPic.id).toString() : null}
        searchable
        limit={25}
        data={[
          {
            value: "0",
            label: t("defaultAvatar"),
          },
          ...cards
            .filter((c) => c.title)
            .map((c) => ({
              value: c.id.toString(),
              label: `(${c.title[0]}) ${c.name && c.name[0]}`,
            })),
        ]}
        onChange={(value) => {
          setCurrentPic({
            ...currentPic,
            id: bloomed
              ? parseInt(value as string)
              : parseInt(value as string) * -1,
          });
        }}
        icon={<IconSearch size={16} />}
        rightSectionWidth={62}
        rightSection={
          <Switch
            size="md"
            sx={{ alignSelf: "center" }}
            onChange={() =>
              setCurrentPic((currentPic) => ({
                ...currentPic,
                id: currentPic.id * -1,
              }))
            }
            checked={bloomed}
            onLabel={<IconFlower size={16} />}
            offLabel={<IconFlowerOff size={16} />}
            disabled={!currentPic.id}
            color="mao_pink"
          />
        }
      />
      {currentPic.id !== 0 ? (
        <Paper
          mt="xs"
          radius="sm"
          withBorder
          sx={{
            minHeight: 240,
            padding: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Cropper
            image={getAssetURL(
              `assets/card_still_full1_${Math.abs(currentPic.id as number)}_${
                (currentPic.id as number) > 0 ? "evolution" : "normal"
              }.png`
            )}
            minZoom={0.8}
            maxZoom={8}
            cropSize={{ width: 180, height: 180 }}
            aspect={1}
            cropShape="round"
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, cap) => {
              setCurrentPic({
                ...currentPic,
                crop: croppedArea,
              });
            }}
            onMediaLoaded={(mediaSize) => {
              if (!currentPic.crop) return;

              const currentCrop = currentPic.crop;
              // this was fucking hell to figure out this took me 2 hours please end my suffering
              const scale =
                (100 / currentCrop.height) * (180 / mediaSize.height);
              const crop = {
                x:
                  ((currentCrop.x + 0.5 * currentCrop.width - 50) / 100) *
                  mediaSize.width *
                  -1 *
                  scale,
                y:
                  ((currentCrop.y + 0.5 * currentCrop.height - 50) / 100) *
                  mediaSize.height *
                  -1 *
                  scale,
              };
              setZoom(scale);
              setCrop(crop);
            }}
          />
        </Paper>
      ) : (
        <Paper mt="xs" radius="sm" withBorder p="sm">
          <Text color="dimmed" align="center" size="xs">
            {t("defaultAvatarNotice")}
          </Text>
        </Paper>
      )}
      <Group position="right">
        <Button
          mt="xs"
          onClick={() => {
            externalSetter({ ...profileState, profile__picture: currentPic });
            openedFunction(false);
          }}
        >
          {t("save")}
        </Button>
      </Group>
    </Modal>
  );
}

export default ProfilePicModal;
