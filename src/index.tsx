import { render, h, ContainerNode } from "preact";
import "./stylesheets/index.pcss";

const App = () => {
  console.info("Starting app...");
  return <h1>Hello World!</h1>;
};

render(<App />, document.querySelector("#app-root") as ContainerNode);
