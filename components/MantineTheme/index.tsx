import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

import { emotionCache } from "services/libraries/emotion";

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
          hokke: [
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
        },
        primaryColor: "hokke",
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
      {children}
    </MantineProvider>
  );
}

export default MantineTheme;
