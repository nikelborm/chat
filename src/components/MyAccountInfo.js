/* eslint-disable no-useless-concat */
import React, { PureComponent } from "react";
import getCookie from "../tools/getCookie";
import emptyAvatar from "../styles/white.jpg";

class MyAccountInfo extends PureComponent {
    shouldComponentUpdate() {
        return false;
        // TODO: Как только добавится возможность редактировать свои данные, обновить это
    }
    render() {
        return (
            <div className="my-account">
                <div className="image">
                    <img src={getCookie("avatarLink") || emptyAvatar} title="Аватар выбирается случайно" alt="User"/>
                    <i className={"fa fa-circle " + "online"}></i>
                    {/* TODO: Сделать чтобы можно выбрать свой онлайн и он ставился после задержки: offline, online, idle */}
                </div>
                <div className="name">
                    <span id="myName" title={getCookie("userName") || "Error"}>
                        {getCookie("fullName") || "Error"}{" "}
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
