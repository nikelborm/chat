import React, { PureComponent } from "react";
class WindowTitle extends PureComponent {
    render() {
        return (
            <div className="window-title">
                <div className="dots">
                    <i className="fa fa-circle"></i>
                    <i className="fa fa-circle"></i>
                    <i className="fa fa-circle"></i>
                </div>
                <div className="title">
                    <span>Чат</span>
                </div>
                <div className="exit" title="Выйти из аккаунта">
                    <i className="fa fa-times" onClick={() => document.location.assign("logout")}></i>
                </div>
            </div>
        );
    }
}
export default WindowTitle;
