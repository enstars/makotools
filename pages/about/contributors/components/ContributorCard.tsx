import { Card, createStyles, Divider } from "@mantine/core";

const useStyles = createStyles((theme, params: any, getRef) => ({
  // card: {
  //   ref: getRef("card"),
  //   height: 180,
  //   display: "flex",
  //   justifyContent: "center",
  //   [`&:hover .${getRef("background")}`]: {
  //     backgroundPosition: "right",
  //   },
  //   [`&:hover .${getRef("picture")}`]: {
  //     flexBasis: 600,
  //     height: 200,
  //   },
  //   [`&:hover .${getRef("pictureBloomed")}`]: {
  //     display: "block",
  //   },
  // },
  // background: {
  //   ref: getRef("background"),
  //   position: "absolute",
  //   width: "100%",
  //   height: "100%",
  //   left: 0,
  //   top: 0,
  //   background: `left / 250% 100% no-repeat
  //   linear-gradient(
  //     -45deg,
  //     ${params.color} 30%,
  //     ${params.color}33 30%,
  //     ${params.color}33 50%,
  //     transparent 50%
  //   )`,
  //   transition: theme.other.transition,
  // },
  // pictureWrapper: {
  //   ref: getRef("picture"),
  //   flexBasis: 400,
  //   height: 180,
  //   position: "relative",
  //   flexShrink: 0,
  //   transition: theme.other.transition,
  //   left: 0,
  // },
  // picture: {
  //   height: "100%",
  //   objectFit: "contain",
  // },
  // pictureBloomed: {
  //   ref: getRef("pictureBloomed"),
  //   top: "-100%",
  //   display: "none",
  // },
  // title: {
  //   fontSize: theme.fontSizes.sm,
  //   position: "absolute",
  //   width: "100%",
  //   right: 0,
  //   bottom: 0,
  //   background:
  //     theme.colorScheme === "dark"
  //       ? theme.colors.dark[7] + "A0"
  //       : theme.white + "A",
  //   padding: theme.spacing.xs / 1.25,
  //   textAlign: "end",
  //   lineHeight: 1,
  // },
  contributor: {
    ref: getRef("contributor"),
    // color: "green",
    // fontFamily: "Comic Sans MS, cursive",
    // border: "1px solid orange",
  },
  name: {
    ref: getRef("name"),
    // backgroundColor: "pink",
  },
  translation: {
    ref: getRef("translation"),
    backgroundColor: "ivory",
  },
  data: {
    ref: getRef("data"),
    backgroundColor: "palegreen",
  },
  design: {
    ref: getRef("design"),
    backgroundColor: "mistyrose",
  },
  dev: {
    ref: getRef("dev"),
    backgroundColor: "lavender",
  },
  admin: {
    ref: getRef("admin"),
    backgroundColor: "lightskyblue",
  },
  contributorInfo: {
    ref: getRef("contributorInfo"),
    [`&.${getRef("name")}`]: {
      borderBottom: "5px solid purple",
      margin: "0 0 .5em",
    },
  },
  contributorInfoSection: {
    ref: getRef("contributorInfoSection"),
  },
  personalInfo: {
    ref: getRef("personalInfo"),
  },
  rolesInfo: {
    ref: getRef("rolesInfo"),
    display: "flex",
    flexWrap: "wrap",
    gap: ".25em",
    alignItems: "stretch",
    [`> .${getRef("contributorInfo")}`]: {
      border: "2px solid magenta",
      borderRadius: ".5em",
      padding: ".25em",
    },
  },
  rolesHeading: {
    ref: getRef("rolesHeading"),
    margin: 0,
  },
  makotools: {
    ref: getRef("makotools"),
  },
  credit: {
    ref: getRef("credit"),
  },
}));

function makeLanguageArray(languagesString: string) {
  const languageArray = languagesString.split(", ");
  console.log("language array:", languageArray);
  return languageArray;
}

function ContributorLanguages({
  contributor,
  lang,
}: {
  contributor: any;
  lang: string;
}) {
  const { classes, cx } = useStyles({});
  return (
    <div className={cx(classes.contributorInfo, classes.translation)}>
      TL:{lang}
    </div>
  );
}

function ContributorCard({ contributor }: { contributor: any }) {
  const { classes, cx } = useStyles({});
  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        key={contributor.name + contributor.makotools}
      >
        {/* <Card.Section> */}
        <section>
          <h3 className={cx(classes.contributorInfo, classes.name)}>
            {contributor.name === "Sei"
              ? `${contributor.name}, Keito Eater`.toUpperCase()
              : contributor.name}
          </h3>
          {contributor.makotools && (
            <a
              href={`https://enstars.link/${contributor.makotools}`}
              className={cx(classes.contributorInfo, classes.makotools)}
            >
              {contributor.makotools}
            </a>
          )}
          {contributor.credit && (
            <a
              href={
                contributor.credit.startsWith("http")
                  ? contributor.credit
                  : `https://${contributor.credit}`
              }
              target="blank"
              className={cx(classes.contributorInfo, classes.credit)}
            >
              {contributor.credit}
            </a>
          )}
        </section>
        {/* </Card.Section> */}
        <Divider mt="xs" size="xs" />

        {/* <Card.Section> */}
        <section
          className={cx(classes.contributorInfoSection, classes.rolesInfo)}
        >
          <h4 className={classes.rolesHeading}>Roles:</h4>
          {contributor.admin && (
            <div className={cx(classes.contributorInfo, classes.admin)}>
              Admin
            </div>
          )}
          {contributor.dev && (
            <div className={cx(classes.contributorInfo, classes.dev)}>Dev</div>
          )}
          {contributor.design && (
            <div className={cx(classes.contributorInfo, classes.design)}>
              Design
            </div>
          )}
          {contributor.data && (
            <div className={cx(classes.contributorInfo, classes.data)}>
              Data
            </div>
          )}
          {contributor.translation &&
            makeLanguageArray(contributor.lang).map((lang) => {
              return (
                <ContributorLanguages
                  key={`${contributor.name}_${lang}`}
                  contributor={contributor}
                  lang={lang}
                />
              );
            })}
        </section>
        {/* </Card.Section> */}
      </Card>
    </>
  );
}

export default ContributorCard;
