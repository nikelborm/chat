/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from "react";

class Participant extends PureComponent {
    render() {
        const { userName, fullName, onlineStatus } = this.props;
        return (
            <li>
                <a href="#">
                    <i className={"fa fa-circle-o " + onlineStatus} title={userName}></i>
                    <span>{fullName}</span>
                    {/* <i className="fa fa-times"></i> */}
                </a>
            </li>
        );
    }
}
export default Participant;
