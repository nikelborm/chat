import React from "react";
import WindowArea from "./WindowArea";
import WindowTitle from "./layout/WindowTitle";

function Chat() {
    return (
        <div className="window-wrapper">
            <WindowTitle />
            <WindowArea />
        </div>
    );
}
export default Chat;
