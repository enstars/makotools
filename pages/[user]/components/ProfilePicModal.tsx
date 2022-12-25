/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Input,
  Modal,
  Select,
  Space,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconSun, IconSunOff } from "@tabler/icons";
import Cropper from "react-easy-crop";
import { Point } from "react-easy-crop/types";

import MaoBanned from "../MaoBanned.png";

import ProfileAvatar from "./ProfileAvatar";

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
  const [picObj, setPicObj] = useState<ProfilePicture>(
    (user.loggedIn && user.db?.profile__picture) || {
      id: undefined,
      crop: undefined,
    }
  );

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [bloomed, setBloomed] = useState<boolean>(true);

  useEffect(() => {
    if (picObj.id) {
      let newId;
      if (bloomed) newId = picObj.id > 0 ? picObj.id : picObj.id * -1;
      else newId = picObj.id > 0 ? picObj.id * -1 : picObj.id;
      setPicObj({ ...picObj, id: newId });
    }
  }, [bloomed]);

  return (
    <Modal
      opened={opened}
      size="lg"
      onClose={() => openedFunction(false)}
      title={
        <Group>
          <Title order={2}>Update avatar</Title>{" "}
          <Button
            sx={{
              visibility: picObj.crop ? "visible" : "hidden",
              marginTop: 10,
            }}
            onClick={() => {
              externalSetter({ ...profileState, profile__picture: picObj });
              openedFunction(false);
            }}
          >
            Save
          </Button>
        </Group>
      }
      styles={(theme) => ({
        modal: { height: "100%", minHeight: "100%" },
      })}
    >
      <Text size="xl" weight="bold" py={10}>
        Choose an image
      </Text>
      <Group align="flex-start">
        <Box sx={{ flex: "0 1 120" }}>
          <ProfileAvatar
            src={
              picObj && picObj.id
                ? getAssetURL(
                    `assets/card_still_full1_${Math.abs(picObj.id)}_${
                      picObj.id > 0 ? "evolution" : "normal"
                    }.png`
                  )
                : MaoBanned.src
            }
            crop={picObj.crop}
          />
        </Box>
        <Stack sx={{ flex: "1 0 30%" }}>
          <Input.Wrapper label="Avatar image">
            <Select
              placeholder="Type to search for a card"
              defaultValue={Math.abs(picObj.id as number).toString() || null}
              searchable
              limit={25}
              data={[
                {
                  value: "-",
                  label: "Start typing to search for a card...",
                  disabled: true,
                },
                ...cards
                  .filter((c) => c.title)
                  .filter(
                    (c) => Math.abs(c.id) !== Math.abs(picObj?.id as number)
                  )
                  .map((c) => ({
                    value: c.id.toString(),
                    label: `(${c.title[0]}) ${c.name && c.name[0]}`,
                  })),
              ]}
              onChange={(value) =>
                setPicObj({
                  ...picObj,
                  id: bloomed
                    ? parseInt(value as string)
                    : parseInt(value as string) * -1,
                })
              }
            />
          </Input.Wrapper>
          <Input.Wrapper label="Bloomed?">
            <Switch
              size="lg"
              sx={{ alignSelf: "center" }}
              onChange={() => {
                setBloomed(!bloomed);
              }}
              defaultChecked={bloomed}
              onLabel={<IconSun />}
              offLabel={<IconSunOff />}
              disabled={!picObj.id}
            />
          </Input.Wrapper>
        </Stack>
      </Group>
      <Space h="xl" />
      <Divider />
      <Text size="xl" weight="bold" py={10}>
        Crop icon
      </Text>
      {picObj.id && (
        <Container
          sx={{ minHeight: "350px", padding: 0, position: "relative" }}
        >
          <Cropper
            image={getAssetURL(
              `assets/card_still_full1_${Math.abs(picObj.id as number)}_${
                (picObj.id as number) > 0 ? "evolution" : "normal"
              }.png`
            )}
            aspect={1}
            cropSize={{ width: 120, height: 120 }}
            cropShape="round"
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropAreaChange={(croppedArea) => {
              setPicObj({
                ...picObj,
                crop: croppedArea,
              });
            }}
          />
        </Container>
      )}
    </Modal>
  );
}

export default ProfilePicModal;
