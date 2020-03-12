/* eslint-disable no-useless-concat */
import React, { Component } from "react";
import getCookie from "./getCookie";
class MyAccountInfo extends Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const userName = getCookie("userName");
        const fullName = getCookie("fullName");
        const statusText = getCookie("statusText");
        return (
            <div className="my-account">
                <div className="image">
                    <img src={getCookie("avatarLink") || "chat/white.jpg"} title="Аватар выбирается случайно" alt="User"/>
                    <i className={"fa fa-circle " + "online"}></i>
                    {/* TODO: Сделать чтобы можно выбрать свой онлайн и он ставился после задержки: offline, online, idle */}
                </div>
                <div className="name">
                    <span id="myName" style={{overflow:"hidden"}} title={userName}>
                    {fullName}
                    </span>
                    <i className="fa fa-angle-down"></i>
                    <span className="availability">{statusText}</span>
                </div>
            </div>
        );
    }
}
export default MyAccountInfo;
