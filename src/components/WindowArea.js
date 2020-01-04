import React, { Component } from 'react';
import { RightTabs } from "./RightTabs";
import { ChatArea } from "./ChatArea";
import { ConversationList } from "./ConversationList";
export class WindowArea extends Component {
    render() {
        return (<div className="window-area">
            <ConversationList listOfUsers={[{userName:"Давид Барто", onlineStatus:"online"},{userName:"Сергей Бондарь", onlineStatus:"idle"},{userName:"Глеб Кавраский", onlineStatus:"offline"}]}/>
            <ChatArea />
            <RightTabs />
        </div>);
    }
}
