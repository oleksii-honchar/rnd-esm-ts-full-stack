import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet]".cyan;
blablo.cleanLog(logHeader, "'Externals' loaded");

export const externalsConfig: {} = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    moment: "moment",
  },
};
