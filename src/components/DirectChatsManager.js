import React, { Component, Fragment } from "react";
import DirectChat from "./DirectChat";

class DirectChatsManager extends Component {
    render() {
        const { directChats, muted, entities, onMuteChange, onDeleteChat, onSelectChat } = this.props;
        const items = directChats.map(id =>
            <DirectChat
                key={id}
                id={id}
                isMuted={muted.includes(id)}
                nickName={entities[id].nickName}
                fullName={entities[id].fullName}
                onlineStatus={entities[id].onlineStatus}

                onMuteChange={onMuteChange}
                onDeleteChat={onDeleteChat}
                onSelectChat={onSelectChat}
            />
        );
        return (
            <Fragment>
                <li className="item header">
                    <i className="fa fa-list-alt"></i>
                    <span>Прямые чаты</span>
                </li>
                {items}
            </Fragment>
        )
    }
}
export default DirectChatsManager;
