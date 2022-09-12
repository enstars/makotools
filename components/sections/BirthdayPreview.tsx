import { Text, Image, Accordion, Box, Card } from "@mantine/core";
import { IconCake } from "@tabler/icons";
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

// create individual birthday card
function BirthdayCard({ ...props }) {
  const dayjs = useDayjs();
  const formattedDate = dayjs(props.character.birthday).format("MMM D");
  return (
    <Accordion.Panel>
      <Link href={`/birthdays`} passHref>
        <Card
          withBorder
          component="a"
          className={styles.wrapper}
          sx={{
            background: `linear-gradient(135deg, transparent 70%, ${props.character.image_color}4f 71%)`,
          }}
        >
          <Image
            className={`${styles.alignImage}`}
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