import React, { Component, Fragment } from "react";
import Room from "./Room";

class RoomsManager extends Component {
    render() {
        const { rooms, muted, entities, usersInRooms, onMuteChange, onExpandChange, onDeleteChat, onSelectChat } = this.props;
        const items = rooms.map(id =>
            <Room
                key={id}
                id={id}
                muted={muted}
                entities={entities}
                usersInRooms={usersInRooms}

                onExpandChange={onExpandChange}
                onMuteChange={onMuteChange}
                onDeleteChat={onDeleteChat}
                onSelectChat={onSelectChat}
            />
        );
        return (
            <Fragment>
                <li className="item header">
                    <i className="fa fa-list-alt"></i>
                    <span>Комнаты</span>
                </li>
                {items}
            </Fragment>
        )
    }
}
export default RoomsManager;
