/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Container,
  Divider,
  Group,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconSun, IconSunOff } from "@tabler/icons";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

import MaoBanned from "../MaoBanned.png";

import { GameCard } from "types/game";
import { ProfilePicture, User, UserData } from "types/makotools";
import { getAssetURL } from "services/data";

function ProfilePicModal({
  opened,
  openedFunction,
  cards,
  user,
  profile,
}: {
  opened: boolean;
  openedFunction: any;
  cards: GameCard[];
  user: User;
  profile: UserData;
}) {
  const [picObj, setPicObj] = useState<ProfilePicture>(
    (user.loggedIn && user.db?.profile__picture) || {
      id: undefined,
      crop: { x: undefined, y: undefined, w: undefined, h: undefined },
    }
  );

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [bloomed, setBloomed] = useState<boolean>(true);

  const previewRef = useRef(null);

  useEffect(() => {
    if (picObj.id) {
      let newId;
      if (bloomed) newId = picObj.id > 0 ? picObj.id : picObj.id * -1;
      else newId = picObj.id > 0 ? picObj.id * -1 : picObj.id;
      setPicObj({ ...picObj, id: newId });
    }
  }, [bloomed]);

  const onCropComplete = useCallback(
    (area: Area, areaPixels: Area) => {
      console.log("picObj.id: ", picObj.id);
      if (picObj.id !== undefined) {
        setPicObj({
          ...picObj,
          crop: { x: area.x, y: area.y, w: area.width, h: area.height },
        });
        // console.log("picObj 2: ", picObj);
      }
    },
    [picObj]
  );

  return (
    <Modal
      opened={opened}
      size="lg"
      onClose={() => openedFunction(false)}
      title={<Title order={2}>Update avatar</Title>}
      styles={(theme) => ({
        modal: { height: "100%", minHeight: "100%" },
      })}
    >
      <Text size="xl" weight="bold" py={10}>
        Choose an image
      </Text>
      <Group align="flex-start">
        <Box sx={{ flex: "0 1 120" }}>
          <Image
            ref={previewRef}
            src={
              picObj && picObj.id
                ? getAssetURL(
                    `assets/card_still_full1_${Math.abs(picObj.id)}_${
                      picObj.id > 0 ? "evolution" : "normal"
                    }.webp`
                  )
                : MaoBanned.src
            }
            alt={"User avatar"}
            fit="none"
            width={picObj.id ? "auto" : 120}
            height={picObj.id ? "auto" : 120}
            radius={60}
            styles={(theme) => ({
              imageWrapper: {
                position: "relative",
                width: 120,
                height: 120,
                overflow: !picObj ? "visible" : "clip",
                borderRadius: 60,
              },
              image: {
                position: "absolute",
                borderRadius: !picObj ? 60 : 0,
                width: "auto",
                height: "auto",
                marginTop: picObj.crop.y ? `${picObj.crop.y * -1}%` : 0,
                marginLeft: picObj.crop.x ? `${picObj.crop.x * -1}%` : 0,
              },
            })}
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
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Container>
      )}
    </Modal>
  );
}

export default ProfilePicModal;
