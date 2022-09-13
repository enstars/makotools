import { Text, Image, Accordion, Box, Card, createStyles } from "@mantine/core";
import {
  IconCake,
  IconZodiacAquarius,
  IconZodiacAries,
  IconZodiacCancer,
  IconZodiacCapricorn,
  IconZodiacGemini,
  IconZodiacLeo,
  IconZodiacLibra,
  IconZodiacPisces,
  IconZodiacSagittarius,
  IconZodiacScorpio,
  IconZodiacTaurus,
  IconZodiacVirgo,
} from "@tabler/icons";
import Link from "next/link";

import { twoStarIDs } from "../../data/characterIDtoCardID";
import { useDayjs } from "../../services/dayjs";
import { getB2File } from "../../services/ensquare";
import styles from "../../styles/BirthdayPreview.module.scss";

interface CharIDAndBirthday {
  id: number;
  birthday: string;
}

function retrieveClosestBirthdays(
  characters: GameCharacter[]
): CharIDAndBirthday[] {
  const dayjs = useDayjs();
  const todaysDate = dayjs(new Date()).format("YYYY-MM-DD");

  const todaysDateObj = {
    id: 0,
    birthday: todaysDate,
  };

  // today's date
  let charIDsBirthdays: CharIDAndBirthday[] = [todaysDateObj];

  // place birthdays and character ids in a smaller array
  characters.forEach((character: GameCharacter) => {
    if (character.birthday) {
      // TODO: remove once iso dates are synced]
      let obj: CharIDAndBirthday = {
        id: character.character_id,
        birthday: character.birthday,
      };
      charIDsBirthdays.push(obj);
    }
  });

  // sort array by birthday
  charIDsBirthdays.sort((a: CharIDAndBirthday, b: CharIDAndBirthday) => {
    let splitA = dayjs(a.birthday).format("M/DD").split("/");
    let splitB = dayjs(b.birthday).format("M/DD").split("/");

    if (parseInt(splitA[0]) - parseInt(splitB[0]) !== 0) {
      return parseInt(splitA[0]) - parseInt(splitB[0]);
    } else {
      return parseInt(splitA[1]) - parseInt(splitB[1]);
    }
  });

  // find today's date in array and retrieve the next 5 dates
  let todayIndex = charIDsBirthdays.indexOf(todaysDateObj);
  todayIndex++;

  let newArray: CharIDAndBirthday[] = [];

  while (newArray.length < 3) {
    newArray.push(charIDsBirthdays[todayIndex]);
    if (todayIndex === charIDsBirthdays.length - 1) {
      todayIndex = -1;
    }
    todayIndex++;
  }

  return newArray;
}
/* END FUNCTION */

// choose horoscope from value
function HoroscopeSymbol({ ...props }) {
  switch (props.horoscope) {
    case 0:
      return <IconZodiacAries className={props.className} size={48} />;
      break;
    case 1:
      return <IconZodiacTaurus className={props.className} size={48} />;
      break;
    case 2:
      return <IconZodiacGemini className={props.className} size={48} />;
      break;
    case 3:
      return <IconZodiacCancer className={props.className} size={48} />;
      break;
    case 4:
      return <IconZodiacLeo className={props.className} size={48} />;
      break;
    case 5:
      return <IconZodiacVirgo className={props.className} size={48} />;
      break;
    case 6:
      return <IconZodiacLibra className={props.className} size={48} />;
      break;
    case 7:
      return <IconZodiacScorpio className={props.className} size={48} />;
      break;
    case 8:
      return <IconZodiacSagittarius className={props.className} size={48} />;
      break;
    case 9:
      return <IconZodiacCapricorn className={props.className} size={48} />;
      break;
    case 10:
      return <IconZodiacAquarius className={props.className} size={48} />;
      break;
    case 11:
      return <IconZodiacPisces className={props.className} size={48} />;
      break;
    default:
      return null;
      break;
  }
}

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "block",
    width: "300px",
    height: "100px",
    backgroundColor: "transparent",
  },
  alignImage: {
    margin: 0,
    position: "absolute",
    left: "-14%",
    top: "-4%",
  },
  horoscope: {
    position: "absolute",
    top: "2%",
    right: 0,
    zIndex: 2,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.gray[1],
  },
}));

// create individual birthday card
function BirthdayCard({ ...props }) {
  const { classes } = useStyles();
  const dayjs = useDayjs();
  const formattedDate = dayjs(props.character.birthday).format("MMM D");
  return (
    <Accordion.Panel>
      <Link href={`/calendar`} passHref>
        <Card withBorder component="a" className={classes.wrapper}>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "100%",
              height: "100%",
              padding: "16px",
              background: `linear-gradient(45deg, transparent 73%, ${props.character.image_color}99 83%)`,
              zIndex: 2,
            }}
          ></Box>
          <HoroscopeSymbol
            className={classes.horoscope}
            horoscope={props.character.horoscope}
          />
          <Image
            className={`${classes.alignImage}`}
            src={getB2File(
              `cards/card_full1_${
                (twoStarIDs as any)[props.character.character_id]
              }_normal.png`
            )}
            alt={`${props.character.first_name} ${props.character.last_name}`}
            width={500}
          />
          <Text>{formattedDate}</Text>
          <Text size="lg" weight={700}>
            {props.character.first_name} {props.character.last_name}
          </Text>
        </Card>
      </Link>
    </Accordion.Panel>
  );
}

function BirthdayPreview({ ...props }) {
  return (
    <Accordion variant="contained" defaultValue="birthday">
      <Accordion.Item value="birthday">
        <Accordion.Control icon={<IconCake size={18} />}>
          <Text inline weight={500}>
            Upcoming Birthdays
          </Text>
        </Accordion.Control>
        {retrieveClosestBirthdays(props.characters).map(
          (c: CharIDAndBirthday) => {
            let character = props.characters.find((char: GameCharacter) => {
              return char.character_id === c.id;
            });
            return <BirthdayCard key={c.id} character={character} />;
          }
        )}
      </Accordion.Item>
    </Accordion>
  );
}

export default BirthdayPreview;
