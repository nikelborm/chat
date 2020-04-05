import React, { Component } from "react";
import shallowEqual from "../tools/shallowEqual";

class Participant extends Component {
    // shouldComponentUpdate(nextProps) {
    //     shallowEqual(this.props.userInfo, nextProps.userInfo);
    // }
    render() {
        const { userName, fullName, onlineStatus } = this.props.userInfo;
        const { isDirect, isMuted, onMuteChange, onDeleteChat } = this.props;
        if (isDirect) {
            return (
                <li className="item" >
                    <i className={"fa fa-circle-o " + onlineStatus}></i>
                    <span title={userName}>{fullName}</span>
                    <i
                        className="far fa-trash-alt"
                        onClick={onDeleteChat.bind(undefined, userName)}
                    />
                    <i
                        className={"far fa-bell" + (isMuted ? "-slash": "")}
                        onClick={onMuteChange.bind(undefined, userName)}
                    />
                </li>
            );
        } else {
            return (
                <li className="item tabbed" >
                    <i className={"fa fa-circle-o " + onlineStatus} title={userName}></i>
                    <span>{fullName}</span>
                </li>
            );
        }
    }
}
export default Participant;
