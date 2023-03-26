import ReactDOM from "react-dom/client";
import "./index.css";
import { MyRoutes } from "./routes";
import { WebsiteContainer } from "./templates/WebsiteContainer";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<WebsiteContainer>{MyRoutes}</WebsiteContainer>);
