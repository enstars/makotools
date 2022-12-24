import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { ReactNode } from "react";

import useUser from "services/firebase/user";
import { emotionCache } from "services/libraries/emotion";

export const themeColors = {
  toya_default: [
    "#edf2ff",
    "#dbe4ff",
    "#bac8ff",
    "#91a7ff",
    "#748ffc",
    "#5c7cfa",
    "#4c6ef5",
    "#4263eb",
    "#3b5bdb",
    "#364fc7",
  ],
  hokke_blue: [
    "#CCE2F3",
    "#AFD2EE",
    "#9FCEF2",
    "#4DA6E9",
    "#2E99EB",
    "#0F8CEC",
    "#097FD8",
    "#0479D2",
    "#0068B7",
    "#005299",
  ],
  subaru_orange: [
    "#FDECDC",
    "#FCE3CC",
    "#FBDCC0",
    "#F9BE89",
    "#F8B579",
    "#F79D5D",
    "#FA944B",
    "#FB8434",
    "#FB6B0B",
    "#DA560C",
  ],
  makoto_green: [
    "#F1FDE8",
    "#EAF9DE",
    "#E3F7D4",
    "#C8ECAE",
    "#B4E491",
    "#9ED774",
    "#8DCC60",
    "#82C351",
    "#65AB31",
    "#4F8B23",
  ],
  mao_pink: [
    "#FEE0EE",
    "#FDD6E9",
    "#F9B8D7",
    "#F594C2",
    "#EF76B0",
    "#E95EA1",
    "#DF4890",
    "#CF3880",
    "#B9266C",
    "#941F57",
  ],
};

function MantineTheme({
  colorScheme,
  children,
  setAppColorScheme,
  toggleAppColorScheme,
}: {
  colorScheme: "light" | "dark";
  children: ReactNode;
  setAppColorScheme: (c: any) => void;
  toggleAppColorScheme: () => void;
}) {
  const user = useUser();
  return (
    <MantineProvider
      emotionCache={emotionCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        components: {
          NavLink: {
            styles: (theme) => ({
              root: {
                "& > *:last-child": {
                  margin: 0,
                },
              },
            }),
          },
        },
        colors: {
          dark: [
            "#D3D6E0",
            "#AAB1C2",
            "#8E97AD",
            "#5F6982",
            "#3A4259",
            "#2C3347",
            "#212736",
            "#191C27",
            "#171921",
            "#12141C",
          ],
          lightblue: [
            "#e7f5ff",
            "#d0ebff",
            "#a5d8ff",
            "#74c0fc",
            "#4dabf7",
            "#339af0",
            "#228be6",
            "#1c7ed6",
            "#1971c2",
            "#1864ab",
          ],
          toya_default: [
            "#edf2ff",
            "#dbe4ff",
            "#bac8ff",
            "#91a7ff",
            "#748ffc",
            "#5c7cfa",
            "#4c6ef5",
            "#4263eb",
            "#3b5bdb",
            "#364fc7",
          ],
          hokke_blue: [
            "#CCE2F3",
            "#AFD2EE",
            "#9FCEF2",
            "#4DA6E9",
            "#2E99EB",
            "#0F8CEC",
            "#097FD8",
            "#0479D2",
            "#0068B7",
            "#005299",
          ],
          subaru_orange: [
            "#FDECDC",
            "#FCE3CC",
            "#FBDCC0",
            "#F9BE89",
            "#F8B579",
            "#F79D5D",
            "#FA944B",
            "#FB8434",
            "#FB6B0B",
            "#DA560C",
          ],
          makoto_green: [
            "#F1FDE8",
            "#EAF9DE",
            "#E3F7D4",
            "#C8ECAE",
            "#B4E491",
            "#9ED774",
            "#8DCC60",
            "#82C351",
            "#65AB31",
            "#4F8B23",
          ],
          mao_pink: [
            "#FEE0EE",
            "#FDD6E9",
            "#F9B8D7",
            "#F594C2",
            "#EF76B0",
            "#E95EA1",
            "#DF4890",
            "#CF3880",
            "#B9266C",
            "#941F57",
          ],
        },
        primaryColor:
          user.loggedIn &&
          user.db?.user__theme &&
          Object.keys(themeColors).includes(user.db?.user__theme)
            ? user.db?.user__theme
            : "toya_default",
        primaryShade: { light: 6, dark: 5 },
        lineHeight: 1.5,
        fontFamily:
          "Inter var, Inter, system-ui, Noto Sans JP, IBM Plex Sans Thai, sans-serif",
        headings: {
          fontFamily:
            "SoraVariable, Sora, InterVariable, Inter, system-ui, Noto Sans JP, IBM Plex Sans Thai, sans-serif",
          fontWeight: 800,
        },
        other: {
          transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
          setAppColorScheme,
          toggleAppColorScheme,
          dimmed: colorScheme === "dark" ? "#8E97AD" : "#868e96",
        },
      }}
    >
      <NotificationsProvider position="top-center">
        <NavigationProgress />
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MantineTheme;
