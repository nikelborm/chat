/* eslint-disable no-useless-concat */
import React, { Component } from 'react';
export class MyAccountInfo extends Component {
    render() {
        return (
            <div className="my-account">
                <div className="image">
                    <img src="de76e03aa6b5b0bf675c1e8a990da52f.jpg" alt="User" />
                    {/* TODO: Сделать чтобы фотка профиля подгружалась */}
                    <i className={"fa fa-circle " + "offline"}></i>
                    {/* TODO: Сделать чтобы можно выбрать свой онлайн и он ставился после задержки: offline, online, idle */}
                </div>
                <div className="name">
                    <span id="myName">
                    {/* TODO: Сделать чтобы сюда вставлялся свой никнейм */}Ева
                    </span>
                    <i className="fa fa-angle-down"></i>
                    <span className="availability">{/* TODO: Сделать чтобы сюда вставлялся свой статус */}</span>
                </div>
            </div>
        );
    }
}