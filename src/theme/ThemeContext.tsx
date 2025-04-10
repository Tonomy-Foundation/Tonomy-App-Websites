import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  adjustColor,
  getContrastTextColor,
  hexToRGB,
} from "../accounts/utils/color";

interface ThemeContextType {
  updateThemeColors: (accent?: string, background?: string) => void;
  appAccent: string;
  appBackground: string;
}

const defaultAccent = "#2563EB";
const defaultBackground = "#F9FAFB";

const ThemeContext = createContext<ThemeContextType>({
  updateThemeColors: () => {},
  appAccent: defaultAccent,
  appBackground: defaultBackground,
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [appAccent, setAppAccent] = useState(defaultAccent);
  const [appBackground, setAppBackground] = useState(defaultBackground);

  const updateThemeColors = (accent?: string, background?: string) => {
    setAppAccent(accent ?? defaultAccent);
    setAppBackground(background ?? defaultBackground);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: appAccent,
          },
          secondary: {
            main: getContrastTextColor(appBackground),
          },
          background: {
            default: appBackground,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ":root": {
                "--app-background": appBackground,
                "--app-background-active": adjustColor(appBackground, 10),
                "--app-accent": appAccent,
                "--app-accent-hover": adjustColor(appAccent, 10),
                "--app-accent-active": adjustColor(appAccent, -10),
                "--accent": getContrastTextColor(appBackground),
                "--accent-rgb": hexToRGB(getContrastTextColor(appBackground)),

                "--gray-50": "#fdfeff",
                "--gray-100": "#f9f9f9",
                "--gray-200": "#f3f6f3",
                "--gray-300": "#e4e4e4",
                "--gray-400": "#d2ddec",
                "--gray-500": "#bebebe",
                "--gray-600": "#939393",
                "--gray-700": "#5b6261",
                "--gray-800": "#474d4c",
                "--gray-900": "#313938",

                "--border-default": "#e4ebf6",

                "--black": "#000000",
                "--white": "#ffffff",

                "--text-secondary": "#6e84a3",
                "--success": "#4caf50",

                "--swiper-bullet-active": "#607eaa",
                "--swiper-background": "#F6F9FB",

                "--blue": "#0057b2",

                "--light-blue-gradient": "#e0f7fc",
                "--blue-gradient": "#8be1f1",
                "--main-light-gradient": "#c1eef8",
                "--main-blue-gradient": "#67d7ed",
              },
              body: {
                backgroundColor: "var(--app-background)",
                color: "var(--accent)",
                fontFamily: "'Epilogue', sans-serif",
              },
              "*": {
                fontFamily: "'Epilogue', sans-serif",
              },
            },
          },
        },
        typography: {
          fontFamily: "'Epilogue', sans-serif",
        },
      }),
    [appAccent, appBackground]
  );

  return (
    <ThemeContext.Provider
      value={{ updateThemeColors, appAccent, appBackground }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
