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
  Checkbox,
  AspectRatio,
} from "@mantine/core";
import Confetti from "react-confetti";
import {
  IconCake,
  IconCards,
  IconFriends,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { Fragment, createRef, useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  Parallax,
  ParallaxProvider,
  useParallaxController,
} from "react-scroll-parallax";
import { useRouter } from "next/router";
import Link from "next/link";

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
import {
  hexToHSL,
  isColorDark,
  isColorLight,
  isGameEvent,
  primaryCharaColor,
  secondaryCharaColor,
} from "services/utilities";
import { CardCard } from "components/core/CardCard";
import { useCollections } from "services/makotools/collection";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import NameOrder from "components/utilities/formatting/NameOrder";
import IconEnstars from "components/core/IconEnstars";
import SectionTitle from "pages/events/components/SectionTitle";
import { circleKeyToName } from "data/circleKeyToName";

function CharacterMiniInfo({
  label,
  info,
}: {
  label: string;
  info: string | number | JSX.Element;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
}: {
  characters: GameCharacter[];
  character: GameCharacter;
}) {
  const theme = useMantineTheme();
  return (
    <Box id="circles">
      <SectionTitle
        id="circles"
        title="Circles"
        Icon={IconFriends}
        iconProps={{ color: secondaryCharaColor(theme, character.image_color) }}
      />
      <ResponsiveGrid width={240} sx={{}}>
        {character.circle?.map((circle) => {
          const circleMembers = characters.filter((chara) =>
            chara.circle?.includes(circle)
          );
          const isSmallCircle = circleMembers.length < 6;
          return (
            <Paper
              withBorder
              radius="sm"
              key={circle}
              sx={{
                height: "auto",
                position: "relative",
              }}
            >
              <AspectRatio ratio={1} />
              <Box
                sx={{
                  color: primaryCharaColor(theme, character.image_color),

                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  padding: "0 33%",
                  textAlign: "center",
                }}
              >
                <Title order={5} size="h3">
                  {circleKeyToName[circle as keyof typeof circleKeyToName] ??
                    circle}
                </Title>
              </Box>
              <Box
                sx={{
                  // color: textColor,

                  width: "calc(100% - 50px - 20%)",
                  height: "calc(100% - 50px - 20%)",
                  position: "absolute",
                  borderRadius: "50%",
                  top: "calc(10% + 25px)",
                  left: "calc(10% + 25px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  textAlign: "center",
                  // borderWidth: 2,
                  // borderStyle: "solid",
                  borderColor: secondaryCharaColor(
                    theme,
                    character.image_color
                  ),
                  background: secondaryCharaColor(theme, character.image_color),
                  opacity: 0.05,
                  transform: "scale(1.375)",
                }}
              />
              <Box
                sx={{
                  color: primaryCharaColor(theme, character.image_color),

                  width: "calc(100% - 50px - 20%)",
                  height: "calc(100% - 50px - 20%)",
                  position: "absolute",
                  borderRadius: "50%",
                  top: "calc(10% + 25px)",
                  left: "calc(10% + 25px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  textAlign: "center",
                  background: secondaryCharaColor(theme, character.image_color),
                  opacity: 0.05,
                  transform: "scale(1)",
                }}
              />
              {circleMembers.map((member, i) => {
                const positionInCircle = circleMembers
                  .map((c) => c.character_id)
                  .indexOf(character.character_id);
                const angle =
                  (360 * (i - positionInCircle)) / circleMembers.length - 90;
                return (
                  <Box
                    key={member.character_id}
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "right",
                      paddingRight: "10%",
                      transform: `rotate(${angle}deg)`,
                      pointerEvents: "none",
                    }}
                  >
                    <Tooltip
                      key={member.character_id}
                      label={`${member.first_name[0]}${
                        member.last_name[0] ? ` ${member.last_name[0]}` : ""
                      }`}
                      sx={{ pointerEvents: "all" }}
                      withinPortal
                    >
                      <ActionIcon
                        component={Link}
                        href={`/characters/${member.character_id}`}
                        variant="default"
                        size={50}
                        radius={25}
                        sx={{
                          background: "none",
                          border: "none",
                          pointerEvents: "all",
                          transform: `rotate(${-angle}deg) scale(${
                            isSmallCircle ? 1.25 : 1
                          })`,
                          ["&:hover"]: {
                            transform: `rotate(${-angle}deg) scale(${
                              isSmallCircle ? 1.35 : 1.1
                            })`,
                          },
                        }}
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
                  </Box>
                );
              })}
            </Paper>
          );
        })}
      </ResponsiveGrid>
    </Box>
  );
}

function CardsSection({
  cards,
  character,
  lang,
}: {
  cards: GameCard[];
  character: GameCharacter;
  lang: Lang[];
}) {
  const theme = useMantineTheme();
  const { collections, onEditCollection, onNewCollection } = useCollections();
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);

  const textColor = isColorLight(character.image_color as string)
    ? primaryCharaColor(theme, character.image_color)
    : secondaryCharaColor(theme, character.image_color);
  const bgColor = isColorLight(character.image_color as string)
    ? secondaryCharaColor(theme, character.image_color)
    : primaryCharaColor(theme, character.image_color);

  return (
    <Box id="cards">
      <SectionTitle
        id="cards"
        title="Cards"
        Icon={IconCards}
        iconProps={{ color: textColor }}
      />
      <Accordion variant="separated" defaultValue="5">
        {[5, 4, 3, 2, 1].map((rarity) => {
          const rarityCards = cards.filter((card) => card.rarity === rarity);

          return (
            rarityCards.length > 0 && (
              <Accordion.Item
                value={rarity.toString()}
                sx={{
                  borderRadius: theme.radius.md,
                  border: "none",
                  // boxShadow: theme.shadows.xs,
                  overflow: "hidden",
                  transition: "transform 250ms ease",
                  "&+&": {
                    marginTop: theme.spacing.xs,
                  },
                  "&[data-active]": {
                    // boxShadow: theme.shadows.md,
                    // transform: "scale(1.02)",
                  },
                }}
              >
                <Accordion.Control
                  sx={{
                    paddingTop: theme.spacing.xs,
                    paddingBottom: theme.spacing.xs,
                    backgroundColor: `${character.image_color}11`,
                    overflow: "hidden",
                    position: "relative",
                    color: theme.colorScheme === "dark" && isColorDark(character.image_color as string) ? bgColor : textColor,
                    "&[data-active]": {
                      backgroundColor: bgColor,
                      color: isColorLight(character.image_color as string)
                        ? textColor
                        : "#fff",

                      "& svg.deco-star": {
                        color: textColor,
                        opacity: 0.375,
                      },
                    },
                  }}
                  // icon={<IconStar />}
                >
                  <Group spacing="xs">
                    <Text size="lg" weight={700}>
                      {rarity}
                    </Text>
                    <IconStarFilled size="1rem" />
                  </Group>
                  <Group
                    sx={{
                      position: "absolute",
                      right: theme.spacing.sm,
                      bottom: -theme.spacing.xs * 1.5,
                      transform: "skew(-15deg)",
                      "& svg.deco-star": {
                        color: bgColor,
                        opacity: 0.1,
                      },
                    }}
                    spacing={0}
                  >
                    {new Array(rarity).fill(0).map((_, i) => (
                      <IconStar
                        className="deco-star"
                        strokeWidth={1.5}
                        key={i}
                        size="3.5rem"
                      />
                    ))}
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
}: {
  event: Event | Scout;
  card: GameCard;
}) {
  const { dayjs } = useDayjs();
  const theme = useMantineTheme();
  const nameRef = createRef<HTMLHeadingElement>();

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
        // width: 325,
        // height: 150,
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
          "& img": {
            transform: "scale(1.05)",
          },

          "& .rarity-stars": {
            transform: "translateX(-200px)",
          },
        },
      }}
      withBorder
    >
      <Picture
        alt={event.name[0]}
        srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
        sx={(theme) => ({
          // position: "absolute",
          // top: 0,
          // left: 0,
          width: "100%",
          height: 150,
        })}
      />
      <Paper
        className="rarity-stars"
        shadow="sm"
        px="md"
        py="xs"
        sx={{
          position: "absolute",
          top: 10,
          left: -theme.spacing.md * 1.25,
          zIndex: 4,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          transform: "skew(-15deg) translateX(0px)",
          transition: "transform 0.4s ease",
          background: "#000A",
          color: "#fff",
        }}
      >
        <Group
          spacing={theme.spacing.xs / 3}
          sx={{
            paddingLeft: 20,
            flexDirection: "row-reverse",
            transform: "skew(15deg)",
          }}
        >
          {cardRarityStars.map((star) => {
            return <IconStarFilled size={16} key={star} color="#fff" />;
          })}
        </Group>
      </Paper>
      <Box
        className="summary"
        // pos="absolute"
        sx={
          {
            // left: 8,
            // bottom: 4,
            // transform: `translateY(${summaryHeight}px)`,
            // transition: "transform 0.5s ease",
            // zIndex: 3,
          }
        }
        px="md"
        py="md"
      >
        <Text weight={700}>{event.name[0]}</Text>

        <Text weight={500} color="dimmed">
          {dayjs(event.start.en).format("ll")}
          {" - "}
          {dayjs(event.end.en).format("ll")}
        </Text>
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
    </Paper>
  );
}

function EventsScoutsSection({
  events,
  cards,
}: {
  events: Event[] | Scout[];
  cards: GameCard[];
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
      <ResponsiveGrid width={240}>
        {events.map((event) => {
          const correspondingCard = cards.filter((card) =>
            event.cards.includes(card.id)
          )[0];
          return (
            <EventScoutCard
              key={isGameEvent(event) ? event.event_id : event.gacha_id}
              event={event}
              card={correspondingCard}
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
  baseColor,
}: {
  characters: GameCharacter[];
  character: GameCharacter;
  locale: Lang[];
  units: GameUnit[];
  baseColor: string;
}) {
  const charaUnits = units.filter((u) => character.unit.includes(u.id));

  return (
    <Box id="unit-info">
      {charaUnits.map((unit, index) => {
        const otherMembers = characters.filter((c) => c.unit.includes(unit.id));
        return (
          <>
            <SectionTitle
              id={`unit-${unit.id}`}
              Icon={IconEnstars}
              iconProps={{ unit: unit.id, color: baseColor }}
              title={
                <>
                  <Text weight={400} span>
                    {character.first_name[0]} is {index !== 0 ? "also" : ""} a
                    member of{" "}
                  </Text>
                  {unit.name[0]}
                  <Text weight={400} span>
                    !
                  </Text>
                </>
              }
            />
            <ResponsiveGrid width={100}>
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

function ProfileSummary({
  character,
  renderFaded,
  setRenderFaded,
}: {
  character: GameCharacter;
  renderFaded: boolean;
  setRenderFaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { dayjs } = useDayjs();
  return (
    <Box
      id="chara-info-summary"
      sx={{
        zIndex: 3,

        position: "absolute",
        width: 350,
        right: 0,
        top: 180,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          width: 350,
        },
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          width: `75%`,
          marginRight: "25%",
          position: "relative",
          left: 0,
          top: 0,
          right: "unset",
          // minWidth: 300,
        },
      }}
    >
      <Paper
        shadow="md"
        p="md"
        radius="md"
        sx={{
          borderTop: `6px solid ${character.image_color}`,
        }}
      >
        {isMobile && (
          <Group position="right">
            <Checkbox
              size="xs"
              label="Fade render"
              checked={renderFaded}
              onChange={() => setRenderFaded(!renderFaded)}
              color={theme.colorScheme === "dark" ? "dark" : "blue"}
              sx={{
                marginBottom: theme.spacing.md,
              }}
            />
          </Group>
        )}
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
          <Reactions fullButton={false} />
        </Stack>
      </Paper>
    </Box>
  );
}

function CharaRender(
  // theme,
  // renderFaded: boolean,
  // character: GameCharacter<string[]>,
  // renderHeight: number
  {
    theme,
    renderFaded,
    character,
    renderHeight,
  }: {
    theme: ReturnType<typeof useMantineTheme>;
    renderFaded: boolean;
    character: GameCharacter<string[]>;
    renderHeight: number;
  }
) {
  const parallaxController = useParallaxController();
  return (
    <Box
      id="chara-render"
      sx={{
        width: 700,
        zIndex: 3,
        pointerEvents: "none",
        left: "50%",
        top: scrollY / 5,
        position: "absolute",
        transition: "0.2s ease",

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          marginLeft: 0,
          left: "87.5%",
          width: 500,
          top: theme.spacing.xl,
        },

        transform: renderFaded
          ? "translateX(-50%) translateX(33%)"
          : "translateX(-50%)",
        opacity: renderFaded ? 0.25 : 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          // marginLeft: "10%",
          // marginTop: "50px",
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: 500,
            margin: 0,
          },
        }}
      >
        <Parallax speed={-10}>
          <Picture
            srcB2={`render/character_full1_${character.character_id}.png`}
            transparent
            alt={character.first_name[0]}
            fill={false}
            width={renderHeight}
            height={renderHeight}
            style={{
              userSelect: "none",
              pointerEvents: "none",
            }}
            onLoad={() => {
              if (parallaxController) parallaxController.update();
            }}
          />
        </Parallax>
      </Box>
    </Box>
  );
}

function ParallaxCacheUpdater() {
  const parallaxController = useParallaxController();
  const router = useRouter();

  useEffect(() => {
    if (parallaxController) parallaxController.update();
  }, [router.asPath, parallaxController]);

  return null;
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
  const isMobile = useMediaQuery(theme.fn.smallerThan("md"));
  const user = useUser();
  const { dayjs } = useDayjs();
  const { data: character } = characterQuery;
  const { data: characters } = charactersQuery;
  const { data: cards } = cardsQuery;
  const { data: events } = eventsQuery;
  const { data: scouts } = scoutsQuery;
  const { data: units } = unitsQuery;
  const [renderFaded, setRenderFaded] = useState(false);

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

  const renderHeight = isMobile ? 500 : 700;

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

  return (
    <ParallaxProvider>
      <ParallaxCacheUpdater />
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
        sx={(theme) => ({
          width: "100%",
          height: 700,
          marginTop: 10,
          minHeight: renderHeight + 50,
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            height: "auto",
          },
        })}
      >
        <Box
          id="chara-title-info"
          sx={{
            zIndex: 2,
            position: "absolute",
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              position: "relative",
            },
          }}
        >
          <Title
            order={1}
            sx={{
              wordSpacing: "9999rem",
              fontSize: "6rem",
              lineHeight: 1.1,
              marginTop: theme.spacing.xl * 2,
              [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                fontSize: "3rem",
              },
            }}
          >
            <NameOrder {...character} locale={cardsQuery.lang[0].locale} />
          </Title>
          <Text
            weight={500}
            mt={theme.spacing.xs}
            mb={theme.spacing.lg}
            sx={{
              fontSize: "1.25rem",
              // [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              //   fontSize: "1.25rem",
              // },
            }}
          >
            CV: {character.character_voice[0]}
          </Text>
          <Text
            // weight={700}
            my={theme.spacing.md}
            sx={{
              fontFamily: theme.headings.fontFamily,
              fontSize: "1.5rem",
              maxWidth: "33%",
              display: "flex",
              "&:before": {
                content: '""',
                width: 0,
                height: 0,
                borderTop: `1em solid ${baseColor}`,
                borderLeft: `1em solid transparent`,
                position: "relative",
                top: "0.3rem",
                marginRight: theme.spacing.sm,
              },
              [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                fontSize: "1rem",
              },
              [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                maxWidth: "100%",
                marginRight: "33%",
                fontSize: "1.15rem",
              },
            }}
          >
            {character.quote[0]}
          </Text>
        </Box>
        {/* {CharaRender(theme, renderFaded, character, renderHeight)} */}
        <CharaRender
          theme={theme}
          renderFaded={renderFaded}
          character={character}
          renderHeight={renderHeight}
        />
        <ProfileSummary
          character={character}
          renderFaded={renderFaded}
          setRenderFaded={setRenderFaded}
        />
        <Box
          id="chara-name-secondaryName"
          pos="absolute"
          sx={{ zIndex: 1, width: "100%", height: "100vh", top: 0 }}
        >
          <Parallax speed={-8}>
            <Box
              sx={{
                userSelect: "none",
                position: "absolute",
                right: "1rem",
                top: "-6rem",
                width: "100vw",
                height: "100vh",
                fontSize: "4rem",
                fontWeight: 700,
                writingMode: "vertical-rl",
                color: theme.colorScheme === "dark" ? "#000" : "#fff",
                textShadow:
                  "var(--text-outline-color) 2px 0px 0px, var(--text-outline-color) 1.75517px 0.958851px 0px, var(--text-outline-color) 1.0806px 1.68294px 0px, var(--text-outline-color) 0.141474px 1.99499px 0px, var(--text-outline-color) -0.832294px 1.81859px 0px, var(--text-outline-color) -1.60229px 1.19694px 0px, var(--text-outline-color) -1.97998px 0.28224px 0px, var(--text-outline-color) -1.87291px -0.701566px 0px, var(--text-outline-color) -1.30729px -1.5136px 0px, var(--text-outline-color) -0.421592px -1.95506px 0px, var(--text-outline-color) 0.567324px -1.91785px 0px, var(--text-outline-color) 1.41734px -1.41108px 0px, var(--text-outline-color) 1.92034px -0.558831px 0px",
                ["--text-outline-color"]: baseColor,
              }}
            >
              {character.last_name[1]}
              {character.first_name[1]}
            </Box>
          </Parallax>
        </Box>
        <Box
          id="chara-bg"
          pos="absolute"
          sx={{ zIndex: 1, width: "100%", height: "100vh", top: 0 }}
        >
          <Parallax speed={-7.5}>
            <Box
              sx={{
                width: "44vw",
                height: "44vw",
                margin: "auto",
                marginTop: "-12.2vw",
                borderRadius: 120,
                border: `4px solid ${character.image_color}22`,
                transform: "rotate(45deg)",
                [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                  width: "50vh",
                  height: "50vh",
                  borderRadius: 75,
                },
              }}
            />
          </Parallax>
          <Parallax speed={-5}>
            <Box
              sx={{
                width: "44vw",
                height: "44vw",
                margin: "auto",
                marginTop: "-22vw",
                borderRadius: 120,
                backgroundColor: `${character.image_color}22`,
                transform: "rotate(45deg)",
                [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                  width: "50vh",
                  height: "50vh",
                  borderRadius: 75,
                  marginTop: "-10vh",
                },
              }}
            />
          </Parallax>
        </Box>
      </Box>
      <Box sx={{ width: "95%", margin: "auto" }} mt="xl">
        <SectionTitle
          title="Introduction"
          id="introduction"
          Icon={IconStar}
          iconProps={{ color: baseColor }}
        />
        <Text
          component="p"
          sx={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontSize: "1rem",
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
          baseColor={baseColor as string}
        />
        <CirclesSection characters={characters} character={character} />
        <CardsSection
          cards={charaCards}
          character={character}
          lang={cardsQuery.lang}
        />
        <EventsScoutsSection events={charaEvents} cards={charaCards} />
        <EventsScoutsSection events={charaScouts} cards={charaCards} />
      </Box>
    </ParallaxProvider>
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
