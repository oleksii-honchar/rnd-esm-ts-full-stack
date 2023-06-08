import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet] ".cyan;
blablo.log(logHeader, "loading ", "'Externals'".white.bold).finish();

export const externalsConfig: {} = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    moment: "moment",
  },
};
