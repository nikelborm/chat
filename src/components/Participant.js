import React, { PureComponent } from "react";

class Participant extends PureComponent {
    render() {
        const { id, nickName, fullName, onlineStatus, onSelectChat } = this.props;
        return (
            <li className="item tabbed" onClick={onSelectChat.bind(undefined, id)}>
                <i className={"fa fa-circle-o " + onlineStatus}></i>
                <span title={nickName}>
                    {fullName}
                </span>
            </li>
        );
    }
}
export default Participant;
