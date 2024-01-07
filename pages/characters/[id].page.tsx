import {
  Box,
  Alert,
  useMantineTheme,
  Title,
  Text,
  Paper,
  Group,
  Image,
  Stack,
  Divider,
  Tooltip,
  ActionIcon,
  Accordion,
} from "@mantine/core";
import Confetti from "react-confetti";
import { IconCake, IconStar } from "@tabler/icons-react";
import { Fragment, createRef, useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

import CharacterCard from "./components/CharacterCard";

import Reactions from "components/sections/Reactions";
import { getLayout } from "components/Layout";
import { Lang, QuerySuccess } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  getData,
  getLocalizedDataArray,
  getItemFromLocalizedDataArray,
  getAssetURL,
} from "services/data";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, GameCharacter, Event, Scout, GameUnit } from "types/game";
import { getNameOrder } from "services/game";
import Picture from "components/core/Picture";
import { circleKeyToName } from "data/circleKeyToName";
import { hexToHSL, isGameEvent } from "services/utilities";
import { CardCard } from "components/core/CardCard";
import { useCollections } from "services/makotools/collection";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import NameOrder from "components/utilities/formatting/NameOrder";

function CharacterMiniInfo({
  label,
  info,
}: {
  label: string;
  info: string | number | JSX.Element;
}) {
  const isMobile = useMediaQuery("(max-width: 812px)");
  return (
    <Group>
      <Text
        fz={isMobile ? "sm" : "md"}
        sx={(theme) => ({
          fontWeight: "bold",
          paddingLeft: 10,
          borderLeft: `4px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[9]
          }`,
        })}
      >
        {label}
      </Text>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Divider
          variant="dotted"
          size="md"
          sx={(theme) => ({
            borderColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[9],
          })}
        />
      </Box>
      <Text
        fz={isMobile ? "sm" : "md"}
        sx={{
          flexBasis: "50%",
        }}
      >
        {info}
      </Text>
    </Group>
  );
}

function CirclesSection({
  characters,
  character,
  bgColor,
  textColor,
}: {
  characters: GameCharacter[];
  character: GameCharacter;
  bgColor: string;
  textColor: string;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 812px)");

  return (
    <Box id="circles">
      <Title
        order={4}
        size="h2"
        sx={{
          margin: "8vh 0px 4vh 0px",
        }}
      >
        Circles
      </Title>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {character.circle?.map((circle) => {
          const circleMembers = characters.filter((chara) =>
            chara.circle?.includes(circle)
          );
          return (
            <Stack
              key={circle}
              sx={{
                boxShadow: theme.shadows.sm,
                borderRadius: 20,
                gap: 0,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  borderRadius: "20px 20px 0px 0px",
                  padding: "12px 18px",
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                <Title order={5} size="h3">
                  {circleKeyToName[circle as keyof typeof circleKeyToName] ??
                    circle}
                </Title>
              </Box>
              <Group
                align="center"
                sx={{
                  padding: 12,
                  backgroundColor: `${character.image_color}11`,
                  justifyContent: "space-around",
                  width: "100%",
                  borderRadius: "0px 0px 20px 20px",
                }}
              >
                {circleMembers.map((member) => (
                  <Tooltip
                    key={member.character_id}
                    label={`${member.first_name[0]}${
                      member.last_name[0] ? ` ${member.last_name[0]}` : ""
                    }`}
                  >
                    <ActionIcon
                      component="a"
                      href={`/characters/${member.character_id}`}
                      variant="default"
                      size={50}
                      radius={25}
                      sx={{ background: "none", border: "none" }}
                    >
                      <Picture
                        transparent
                        srcB2={`assets/character_sd_square1_${member.character_id}.png`}
                        alt={member.first_name[0]}
                        fill={false}
                        width={50}
                        height={50}
                        sx={{
                          pointerEvents: "none",
                        }}
                      />
                    </ActionIcon>
                  </Tooltip>
                ))}
              </Group>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}

function CardsSection({
  cards,
  character,
  bgColor,
  textColor,
  lang,
}: {
  cards: GameCard[];
  character: GameCharacter;
  bgColor: string;
  textColor: string;
  lang: Lang[];
}) {
  const theme = useMantineTheme();
  const { collections, onEditCollection, onNewCollection } = useCollections();
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);

  return (
    <Box id="cards">
      <Title
        order={4}
        size="h2"
        sx={{
          margin: "8vh 0px 4vh 0px",
        }}
      >
        Cards
      </Title>
      <Accordion variant="separated" defaultValue="5">
        {[5, 4, 3, 2, 1].map((rarity) => {
          const rarityCards = cards.filter((card) => card.rarity === rarity);
          return (
            rarityCards.length > 0 && (
              <Accordion.Item
                value={rarity.toString()}
                sx={{
                  borderRadius: 20,
                  border: "none",
                  boxShadow: theme.shadows.xs,
                  overflow: "hidden",
                  transition: "transform 250ms ease",

                  "&[data-active]": {
                    boxShadow: theme.shadows.sm,
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Accordion.Control
                  sx={{
                    "&[data-active]": {
                      backgroundColor: bgColor,
                      color: textColor,
                    },
                  }}
                  icon={<IconStar />}
                >
                  <Group spacing="xs">
                    <Title order={5} size="h3">
                      {rarity}
                    </Title>
                  </Group>
                </Accordion.Control>

                <Accordion.Panel
                  sx={{
                    backgroundColor: `${character.image_color}11`,
                  }}
                >
                  <ResponsiveGrid>
                    {rarityCards.map((card) => (
                      <CardCard
                        key={card.id}
                        card={card}
                        cardOptions={{ showFullInfo: true }}
                        collections={collections}
                        lang={lang}
                        onEditCollection={onEditCollection}
                        onNewCollection={() =>
                          setNewCollectionModalOpened(true)
                        }
                      />
                    ))}
                  </ResponsiveGrid>
                </Accordion.Panel>
              </Accordion.Item>
            )
          );
        })}
      </Accordion>
    </Box>
  );
}

function EventScoutCard({
  event,
  card,
  baseColor,
}: {
  event: Event | Scout;
  card: GameCard;
  baseColor: string;
}) {
  const [summaryHeight, setSummaryHeight] = useState(4);
  const [nameHeight, setNameHeight] = useState(0);
  const summaryRef = createRef<HTMLParagraphElement>();
  const nameRef = createRef<HTMLHeadingElement>();

  useEffect(() => {
    if (summaryRef.current)
      setSummaryHeight(summaryRef.current.clientHeight + 20);
    if (nameRef.current) setNameHeight(nameRef.current.clientHeight);
  }, [summaryRef, nameRef]);

  const cardRarityStars = new Array(card.rarity);
  for (let i = 0; i < cardRarityStars.length; i++) {
    cardRarityStars[i] = i + 1;
  }
  return (
    <Paper
      component="a"
      href={`/${isGameEvent(event) ? "events" : "scouts"}/${
        isGameEvent(event) ? event.event_id : event.gacha_id
      }`}
      shadow="xs"
      sx={{
        position: "relative",
        width: 325,
        height: 150,
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",

          "& .rarity-stars": {
            transform: "translateX(-200px)",
          },

          "& .summary": {
            transform: isGameEvent(event)
              ? `translateY(${summaryHeight - 150}px)`
              : undefined,
          },

          "& .event-card-bg": {
            background: isGameEvent(event) ? "#000000dd" : undefined,
          },
        },
      }}
    >
      <Paper
        className="rarity-stars"
        shadow="sm"
        p="xs"
        sx={{
          position: "absolute",
          top: 10,
          left: -20,
          zIndex: 4,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          transform: "skew(-15deg) translateX(0px)",
          transition: "transform 0.4s ease",
        }}
      >
        <Group
          spacing="xs"
          sx={{
            paddingLeft: 20,
            flexDirection: "row-reverse",
            transform: "skew(15deg)",
          }}
        >
          {cardRarityStars.map((star) => {
            return (
              <IconStar
                size={16}
                key={star}
                color={baseColor}
                fill={baseColor}
              />
            );
          })}
        </Group>
      </Paper>
      <Box
        className="summary"
        pos="absolute"
        sx={{
          left: 8,
          bottom: 4,
          transform: `translateY(${summaryHeight}px)`,
          transition: "transform 0.5s ease",
          zIndex: 3,
        }}
      >
        <Title
          ref={nameRef}
          order={5}
          size="h4"
          sx={{
            color: "#fff",
          }}
        >
          {event.name[0]}
        </Title>
        {isGameEvent(event) && (
          <Text
            ref={summaryRef}
            fz="sm"
            component="p"
            sx={{
              color: "#fff",
              padding: 3,
            }}
          >
            {event.intro_lines ? event.intro_lines[0] : "No summary available."}
          </Text>
        )}
      </Box>
      <Box
        className="event-card-bg"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(transparent, #000000dd)",
          zIndex: 2,
          transition: "background 0.2s",
        }}
      />
      <Picture
        alt={event.name[0]}
        srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          left: 0,
          width: 325,
          height: 150,
        })}
      />
    </Paper>
  );
}

function EventsScoutsSection({
  events,
  cards,
  baseColor,
}: {
  events: Event[] | Scout[];
  cards: GameCard[];
  baseColor: string;
}) {
  return (
    <Box id="events">
      <Title
        order={4}
        size="h2"
        sx={{
          margin: "8vh 0px 4vh 0px",
        }}
      >
        {isGameEvent(events[0]) ? "Events" : "Scouts"}
      </Title>
      <ResponsiveGrid width={325}>
        {events.map((event) => {
          const correspondingCard = cards.filter((card) =>
            event.cards.includes(card.id)
          )[0];
          return (
            <EventScoutCard
              key={isGameEvent(event) ? event.event_id : event.gacha_id}
              event={event}
              card={correspondingCard}
              baseColor={baseColor}
            />
          );
        })}
      </ResponsiveGrid>
    </Box>
  );
}

function UnitSection({
  characters,
  character,
  locale,
  units,
}: {
  characters: GameCharacter[];
  character: GameCharacter;
  locale: Lang[];
  units: GameUnit[];
}) {
  const charaUnits = units.filter((u) => character.unit.includes(u.id));

  return (
    <Box id="unit-info">
      {charaUnits.map((unit, index) => {
        const otherMembers = characters.filter((c) => c.unit.includes(unit.id));
        return (
          <>
            <Title
              order={4}
              size="h2"
              sx={{
                margin: "8vh 0px 4vh 0px",
              }}
            >
              {index === 0
                ? `${character.first_name[0]} is a member of ${unit.name[0]}!`
                : `${character.first_name[0]} is also a member of ${unit.name[0]}!`}
            </Title>
            <ResponsiveGrid
              width={`${Math.round(100 / otherMembers.length) - 1}%`}
            >
              {otherMembers.map((member) => (
                <CharacterCard
                  key={member.character_id}
                  character={member}
                  locale={locale}
                />
              ))}
            </ResponsiveGrid>
            <Text component="p">{unit.description[0]}</Text>
          </>
        );
      })}
    </Box>
  );
}

function ProfileSummary({ character }: { character: GameCharacter }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 812px)");
  const { dayjs } = useDayjs();
  return (
    <Box
      id="chara-info-summary"
      pos="absolute"
      top={isMobile ? "50%" : "15%"}
      left={isMobile ? "2px" : undefined}
      right={isMobile ? undefined : "5%"}
      sx={{ zIndex: 3 }}
    >
      <Paper
        shadow="md"
        p="md"
        radius="md"
        sx={{
          borderTop: `6px solid ${character.image_color}`,
          width: isMobile ? "90vw" : "33vw",
        }}
      >
        <Group
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Title order={3} size="h3">
            Profile
          </Title>
          {character.unit.map((unit) => (
            <Image
              key={unit}
              alt={"unit"}
              src={getAssetURL(`assets/unit_logo_border_${unit}.png`)}
              width={100}
            />
          ))}
        </Group>
        <Stack spacing="xs" mt={6}>
          <CharacterMiniInfo label="Age" info={character.age as number} />
          <CharacterMiniInfo label="Height" info={`${character.height}cm`} />
          <CharacterMiniInfo label="Weight" info={`${character.weight}kg`} />
          <CharacterMiniInfo
            label="School"
            info={(character.school as string[])[0] ?? "--"}
          />
          <CharacterMiniInfo
            label="Birthday"
            info={`${dayjs(character.birthday).format("MMMM D")}`}
          />
          <CharacterMiniInfo label="Blood type" info={character.blood_type} />
          <CharacterMiniInfo info={character.hobby[0]} label="Hobby" />
          <CharacterMiniInfo
            info={character.specialty ? character.specialty[0] : "--"}
            label="Specialty"
          />
          <CharacterMiniInfo
            info={
              character.image_color ? (
                <Group align="center" spacing="xs">
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: character.image_color,
                      borderRadius: 4,
                      boxShadow: theme.shadows.xs,
                    }}
                  />
                  <Text>{character.image_color.toUpperCase()}</Text>
                </Group>
              ) : (
                "--"
              )
            }
            label="Image color"
          />
        </Stack>
      </Paper>
    </Box>
  );
}

function Page({
  characterQuery,
  charactersQuery,
  cardsQuery,
  eventsQuery,
  scoutsQuery,
  unitsQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  eventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 812px)");
  const user = useUser();
  const { dayjs } = useDayjs();
  const { data: character } = characterQuery;
  const { data: characters } = charactersQuery;
  const { data: cards } = cardsQuery;
  const { data: events } = eventsQuery;
  const { data: scouts } = scoutsQuery;
  const { data: units } = unitsQuery;

  const charaEvents = events.filter((event) => {
    for (let card of event.cards) {
      const cardData = cards.filter((c) => c.id === card)[0];
      if (!cardData) continue;
      if (cardData.character_id === character.character_id) return true;
    }
    return false;
  });

  const charaScouts = scouts.filter((scout) => {
    for (let card of scout.cards) {
      const cardData = cards.filter((c) => c.id === card)[0];
      if (!cardData) continue;
      if (cardData.character_id === character.character_id) return true;
    }
    return false;
  });

  const charaCards = cards.filter(
    (card) => card.character_id === character.character_id
  );

  if (character.character_id === 74)
    console.log("oh my god niki shiina from ensemble stars");
  if (character.character_id === 13)
    console.log("no way it's makoto yuuki from makotools");

  const hsl = hexToHSL(character.image_color as string);

  const baseColor =
    (theme.colorScheme === "light" &&
      hsl.l < 75 &&
      (hsl.h < 51 || hsl.h > 60)) ||
    (theme.colorScheme === "light" && hsl.h >= 51 && hsl.h <= 60 && hsl.l < 40)
      ? hexToHSL(character.image_color as string).hsl
      : `hsla(${hsl.h - 2 < 0 ? 360 - (hsl.h - 2) : hsl.h - 2}, ${
          hsl.s - 5
        }%, ${hsl.l - 5}%, ${theme.colorScheme === "light" ? 1 : 0.7})`;

  const bgColor =
    (theme.colorScheme === "light" &&
      hsl.l < 75 &&
      (hsl.h < 51 || hsl.h > 60)) ||
    (theme.colorScheme === "light" && hsl.h >= 51 && hsl.h <= 60 && hsl.l < 40)
      ? hexToHSL(character.image_color as string).hsl
      : `hsla(${hsl.h - 2 < 0 ? 360 - (hsl.h - 2) : hsl.h - 2}, ${
          hsl.s - 5
        }%, ${hsl.l - 5}%, ${theme.colorScheme === "light" ? 1 : 0.7})`;

  const textColor =
    theme.colorScheme == "dark" ||
    (theme.colorScheme === "light" &&
      hsl.l < 75 &&
      (hsl.h < 51 || hsl.h > 60)) ||
    (theme.colorScheme === "light" && hsl.h >= 51 && hsl.h <= 60 && hsl.l < 40)
      ? "#fff"
      : `hsl(${hsl.h - 6 < 0 ? 360 - (hsl.h - 6) : hsl.h - 6}, ${
          hsl.s - 10
        }%, ${hsl.l - 55 < 20 ? 20 : hsl.l - 55}%)`;

  return (
    <>
      {dayjs(character.birthday).year(new Date().getFullYear()).isToday() && (
        <>
          <Confetti
            width={1200}
            height={1000}
            recycle={false}
            style={{ margin: "auto", marginTop: "-10%" }}
          />
          <Alert
            icon={<IconCake />}
            color={theme.primaryColor}
            sx={{ margin: "10px 0px", fontSize: "12pt" }}
          >
            Today is {character.first_name[0]}&apos;s birthday!
          </Alert>
        </>
      )}

      <Box
        id="chara-summary-container"
        pos="relative"
        sx={{
          width: "100%",
          height: "100vh",
          marginTop: 10,
        }}
      >
        <Box
          id="chara-title-info"
          pos="absolute"
          sx={{
            zIndex: 2,
          }}
        >
          <Title
            order={1}
            sx={{
              wordSpacing: "9999rem",
              fontSize: isMobile ? "3rem" : "6rem",
              lineHeight: 1,
            }}
          >
            <NameOrder {...character} locale={cardsQuery.lang[0].locale} />
          </Title>
          <Text
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem",
            }}
          >
            CV: {character.character_voice[0]}
          </Text>
          <Title
            order={3}
            size="h2"
            sx={{
              fontSize: isMobile ? "1.2rem" : "26px",
              marginTop: "4%",
              width: isMobile ? "60%" : "33%",
              maxWidth: "33%",
              display: "flex",
              gap: "25px",
              alignItems: "flex-start",
              "&:before": {
                content: '""',
                width: 0,
                height: 0,
                borderTop: `40px solid ${baseColor}`,
                borderLeft: `40px solid transparent`,
              },
            }}
          >
            {character.quote[0]}
          </Title>
        </Box>
        <Box
          id="chara-render"
          pos="absolute"
          sx={{
            width: "100%",
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              marginLeft: "10%",
              marginTop: "50px",
              width: isMobile ? 500 : 700,
            }}
          >
            <Picture
              srcB2={`render/character_full1_${character.character_id}.png`}
              transparent
              alt={character.first_name[0]}
              fill={false}
              width={isMobile ? 500 : 700}
              height={isMobile ? 500 : 700}
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
        <ProfileSummary character={character} />
        <Box
          id="chara-bg"
          pos="absolute"
          sx={{ zIndex: 1, width: "100%", height: "100vh" }}
        >
          <Box
            sx={{
              width: isMobile ? "50vh" : "44vw",
              height: isMobile ? "50vh" : "44vw",
              margin: "auto",
              marginTop: "-12.2vw",
              borderRadius: isMobile ? 50 : 120,
              border: `2px solid ${character.image_color}22`,
              transform: "rotate(45deg)",
            }}
          />
          <Box
            sx={{
              width: isMobile ? "50vh" : "44vw",
              height: isMobile ? "50vh" : "44vw",
              margin: "auto",
              marginTop: isMobile ? "-25vh" : "-22vw",
              borderRadius: isMobile ? 50 : 120,
              backgroundColor: `${character.image_color}22`,
              transform: "rotate(45deg)",
            }}
          />
        </Box>
      </Box>
      <Box mt={isMobile ? "5vh" : undefined}>
        <Reactions />
      </Box>
      <Box sx={{ width: "95%", margin: "20vh auto 0 auto" }}>
        <Title order={4} size="h2">
          Introduction
        </Title>
        <Text
          component="p"
          sx={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontSize: isMobile ? "1rem" : "1.25rem",
            "&:before": {
              content: "'“'",
              fontSize: "4.5rem",
              fontFamily: "'Sora', sans serif",
              color: baseColor,
            },
          }}
        >
          {character.introduction[0]}
        </Text>
        <UnitSection
          characters={characters}
          character={character}
          locale={characterQuery.lang}
          units={units}
        />
        <CirclesSection
          characters={characters}
          character={character}
          bgColor={bgColor as string}
          textColor={textColor}
        />
        <CardsSection
          cards={charaCards}
          character={character}
          bgColor={bgColor as string}
          textColor={textColor}
          lang={cardsQuery.lang}
        />
        <EventsScoutsSection
          events={charaEvents}
          cards={charaCards}
          baseColor={bgColor as string}
        />
        <EventsScoutsSection
          events={charaScouts}
          cards={charaCards}
          baseColor={bgColor as string}
        />
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params, db }) => {
    const characters = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );
    const charsEN = await getData<GameCharacter<string>[]>("characters", "en");
    if (!characters || charsEN.status === "error") return { notFound: true };
    const { data: charactersEN } = charsEN;

    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const lastSegment = params?.id?.toLocaleLowerCase();
    const characterID = parseInt(lastSegment, 10);
    const isName = isNaN(characterID);

    const characterEN = charactersEN.find(
      isName
        ? (item) =>
            `${item.last_name} ${item.first_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name} ${item.last_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name}`.toLocaleLowerCase() === lastSegment
        : (item) => item.character_id === characterID
    );

    if (typeof characterEN === "undefined") {
      return {
        notFound: true,
      };
    }

    const character = getItemFromLocalizedDataArray<GameCharacter>(
      characters,
      characterEN.character_id,
      "character_id"
    );

    if (character.status === "error") {
      return {
        notFound: true,
      };
    }

    const characterName = getNameOrder(
      character.data,
      db?.setting__name_order,
      locale
    );

    const breadcrumbs = ["characters", characterName];

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
      "character_id",
    ]);

    const events = await getLocalizedDataArray<Event>(
      "events",
      locale,
      "event_id"
    );

    const scouts = await getLocalizedDataArray<Scout>(
      "scouts",
      locale,
      "gacha_id"
    );

    const units = await getLocalizedDataArray<GameUnit>("units", locale, "id");

    return {
      props: {
        characterQuery: character,
        charactersQuery: characters,
        cardsQuery: cards,
        eventsQuery: events,
        scoutsQuery: scouts,
        unitsQuery: units,
        breadcrumbs,
      },
    };
  }
);
Page.getLayout = getLayout({
  wide: true,
});
export default Page;
