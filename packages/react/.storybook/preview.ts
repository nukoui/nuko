import { semanticColor } from "@nuko/variable";
import { themes } from "@storybook/theming";
import "@nuko/variable/css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.dark,
  },
  backgrounds: {
    default: "dark",
    values: [
      { name: "light", value: semanticColor.light.background.secondary },
      { name: "dark", value: semanticColor.dark.background.secondary },
    ],
  },
};

const withTheme = (StoryFn, context) => {
  if (context.globals.backgrounds) {
    const theme = context.globals.backgrounds.value === semanticColor.light.background.secondary ? "light" : "dark";
    document.documentElement.setAttribute("data-color-scheme", theme);
  }

  return StoryFn();
};

export const decorators = [withTheme];
