/* eslint-disable no-useless-concat */
import React, { PureComponent } from "react";
import getCookie from "./getCookie";
class MyAccountInfo extends PureComponent {
    render() {
        return (
            <div className="my-account">
                <div className="image">
                    <img src={getCookie("avatarLink") || "chat/white.jpg"} title="Аватар выбирается случайно" alt="User"/>
                    <i className={"fa fa-circle " + "online"}></i>
                    {/* TODO: Сделать чтобы можно выбрать свой онлайн и он ставился после задержки: offline, online, idle */}
                </div>
                <div className="name">
                    <span id="myName" title={getCookie("userName") || "Error"}>
                        {getCookie("fullName") || "Error"}
                    </span>
                    <i className="fa fa-angle-down"></i>
                    <span className="availability">
                        {getCookie("statusText") || "Error"}
                    </span>
                </div>
            </div>
        );
    }
}
export default MyAccountInfo;
