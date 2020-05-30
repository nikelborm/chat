import React, { PureComponent } from "react";

class RoomHeader extends PureComponent {
    render() {
        const { id, nickName, fullName, isExpanded, isMuted, onSelectChat, onExpandChange, onDeleteChat, onMuteChange } = this.props;

        return (
            <li className="item" onClick={onSelectChat.bind(undefined, id)}>
                <i className="fas fa-user-alt"></i>
                <span title={nickName}>
                    {fullName}
                </span>
                <i
                    className={"fa fa-angle-down" + (isExpanded ? " reversed": "")}
                    onClick={onExpandChange.bind(undefined, id)}
                />
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
export default RoomHeader;
