import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Chat from "./pages/Chat";
// import Authorize from "./pages/Authorize";

render(
    <React.StrictMode>
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
