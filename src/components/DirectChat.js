import React, { PureComponent } from "react";

class DirectChat extends PureComponent {
    render() {
        const { isMuted, id, nickName, fullName, onlineStatus, onMuteChange, onDeleteChat, onSelectChat } = this.props;

        return (
            <li className="item" onClick={onSelectChat.bind(undefined, id)}>
                <i className={"fa fa-circle-o " + onlineStatus}></i>
                <span title={nickName}>
                    {fullName}
                </span>
                <i
                    className="far fa-trash-alt"
                    onClick={onDeleteChat.bind(undefined, id)}
                />
                <i
                    className={"far fa-bell" + (isMuted ? "-slash": "")}
                    onClick={onMuteChange.bind(undefined, id)}
                />
            </li>
        );
    }
}
export default DirectChat;
