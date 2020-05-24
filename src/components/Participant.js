import React, { Component } from "react";
import shallowEqual from "../tools/shallowEqual";

class Participant extends Component {
    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props.userInfo, nextProps.userInfo) ||
        this.props.isMuted !== nextProps.isMuted;
    }
    render() {
        const { nickName, fullName, onlineStatus } = this.props.userInfo;
        const { isDirect, isMuted, onMuteChange, onDeleteChat, onSelectChat } = this.props;
        if (isDirect) {
            return (
                <li className="item" onClick={onSelectChat.bind(undefined, nickName)}>
                    <i className={"fa fa-circle-o " + onlineStatus}></i>
                    <span title={nickName}>{fullName}</span>
                    <i
                        className="far fa-trash-alt"
                        onClick={onDeleteChat.bind(undefined, nickName)}
                    />
                    <i
                        className={"far fa-bell" + (isMuted ? "-slash": "")}
                        onClick={onMuteChange.bind(undefined, nickName)}
                    />
                </li>
            );
        } else {
            return (
                <li className="item tabbed" onClick={onSelectChat.bind(undefined, nickName)}>
                    <i className={"fa fa-circle-o " + onlineStatus} title={nickName}></i>
                    <span>{fullName}</span>
                </li>
            );
        }
    }
}
export default Participant;
