import React, { PureComponent } from 'react';

class Welcome extends PureComponent {
    render() {
        const { avatarLink, fullName } = this.props;
        return (
            <div className="welcome-container">
                <div id="cover-photo"></div>
                <div id="profile-photo" style={ avatarLink ? { backgroundImage: 'url(' + avatarLink + ')' } : {} }></div>
                <h1 id="welcome">Welcome,<br/>{ fullName }</h1>
            </div>
        );
    }
}

export default Welcome;
