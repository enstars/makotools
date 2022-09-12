import { Calendar } from "@mantine/dates";

import { getData, getLocalizedData } from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { useDayjs } from "../../services/dayjs";
import { getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";

function Page({ characters }: { characters: GameCharacter[] }) {
  const dayjs = useDayjs();
  const currentDate = new Date();

  return (
    <>
      <PageTitle title="Birthday Calendar" />
      <Calendar
        fullWidth
        hideOutsideDates
        size="xl"
        weekendDays={[]}
        dayStyle={(date) => {
          for (const character of characters) {
            let birthday = new Date(character.birthday);
            if (birthday.getMonth() === date.getMonth()) {
              if (date.getDate() === birthday.getDate()) {
                return {
                  background: `url(${getB2File(
                    `cards/card_full1_${
                      (twoStarIDs as any)[character.character_id]
                    }_normal.png`
                  )}) no-repeat -170px -25px`,
                  backgroundSize: "600px",
                };
              }
            }
          }
          return {};
        }}
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          day: {
            textAlign: "left",
            height: "110px",
            borderRadius: 0,
          },
        })}
      />
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedData("characters", locale);

  return {
    props: { characters: characters?.mainLang.data },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
