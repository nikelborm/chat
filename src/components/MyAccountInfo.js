/* eslint-disable no-useless-concat */
import React, { Component } from 'react';
import getCookie from './getCookie';
class MyAccountInfo extends Component {
    state = {
        imgIsLoading: true,
        imgLink: ""
    }
    componentDidMount = () => {
        fetch('https://randomuser.me/api/?results=1&inc=picture&noinfo')
            .then(function (response) {
                return response.json()
            }).then((data) => {
                this.setState({
                    imgLink: data.results[0].picture.large,
                    imgIsLoading: false
                })
            });
    };
    render() {
        const userName = getCookie("userName");
        const fullName = getCookie("fullName");
        const statusText = getCookie("statusText");
        return (
            <div className="my-account">
                <div className="image">
                    <img src={this.state.imgIsLoading ? "chat/white.jpg" : this.state.imgLink} title="Аватар выбирается случайно" alt="User"/>
                    <i className={"fa fa-circle " + "online"}></i>
                    {/* TODO: Сделать чтобы можно выбрать свой онлайн и он ставился после задержки: offline, online, idle */}
                </div>
                <div className="name">
                    <span id="myName">
                    {fullName} ({userName})
                    </span>
                    <i className="fa fa-angle-down"></i>
                    <span className="availability">{statusText}</span>
                </div>
            </div>
        );
    }
}
export default MyAccountInfo;
