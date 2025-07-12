import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import App from "./app/App";

// third party style
import "perfect-scrollbar/css/perfect-scrollbar.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/poultry-hub">
    <App />
  </BrowserRouter>
);

serviceWorker.unregister();
