(this.webpackJsonpnews=this.webpackJsonpnews||[]).push([[0],{16:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),c=t(8),r=t(1),s=t(2),i=t(4),m=t(3),o=t(5),u=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("ul",{className:"tabs-container"},l.a.createElement("li",{className:"active"},l.a.createElement("ul",{className:"member-list"},l.a.createElement("li",null,l.a.createElement("span",{className:"status online"},l.a.createElement("i",{className:"fa fa-circle-o"})),l.a.createElement("span",null,"Kristi Galeeva")),l.a.createElement("li",null,l.a.createElement("span",{className:"status online"},l.a.createElement("i",{className:"fa fa-circle-o"})),l.a.createElement("span",null,"Segey Bondar")),l.a.createElement("li",null,l.a.createElement("span",{className:"status idle"},l.a.createElement("i",{className:"fa fa-circle-o"})),l.a.createElement("span",null,"Gleb Kavrasky"),l.a.createElement("span",{className:"time"},"10:45 pm")),l.a.createElement("li",null,l.a.createElement("span",{className:"status offline"},l.a.createElement("i",{className:"fa fa-circle-o"})),l.a.createElement("span",null,"David Barto")))),l.a.createElement("li",null),l.a.createElement("li",null))}}]),a}(n.Component),f=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"right-tabs"},l.a.createElement("ul",{className:"tabs"},l.a.createElement("li",{className:"active"},l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-users"}))),l.a.createElement("li",null,l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-paperclip"}))),l.a.createElement("li",null,l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-link"})))),l.a.createElement(u,null),l.a.createElement("i",{className:"fa fa-cog"}))}}]),a}(n.Component);function p(e){var a=e.data,t=a.author,n=a.text,c=a.time;return l.a.createElement("li",{className:"rrr"===t?"me":""},l.a.createElement("div",{className:"name"},l.a.createElement("span",{className:""},t)),l.a.createElement("div",{className:"message"},l.a.createElement("p",null,n.replace(/@(\w{1,50})/g,'<a href="domain.com/$1">$&</a>').replace(/#[\w\u0410-\u042f\u0430-\u044f\u0401\u0451]{1,50}/g,'<a href="#" class="hashtag">$&</a>')),l.a.createElement("span",{className:"msg-time"},c)))}var E=t(6),h=t.n(E),d=(t(14),t(15),function(e){function a(e){var t;return Object(r.a)(this,a),(t=Object(i.a)(this,Object(m.a)(a).call(this,e))).chatList=Object(n.createRef)(),t}return Object(o.a)(a,e),Object(s.a)(a,[{key:"componentDidUpdate",value:function(){var e=this;h()((function(){console.log("\u0443\u0441\u043f\u0435\u0445"),e.props.reserve=h()(".chat-area").html(),h()(".chat-list").jScrollPane({mouseWheelSpeed:30}),document.getElementsByClassName("jspContainer")[0].scrollTo(0,document.getElementById("down").offsetTop);var a=document.getElementsByClassName("jspDrag")[0],t=document.getElementsByClassName("jspTrack")[0].offsetHeight,n=document.getElementsByClassName("jspPane")[0];a.style.top=t-a.offsetHeight+"px",n.style.top=t-n.offsetHeight+"px"}))}},{key:"shouldComponentUpdate",value:function(){return h()(".chat-list").html(this.props.reserve),!0}},{key:"render",value:function(){var e=this.props.data;return console.log(e),l.a.createElement("div",{className:"chat-list",ref:this.chatList},l.a.createElement("ul",null,e.map((function(e){return l.a.createElement(p,{key:e._id,data:e})}))),!e.length&&l.a.createElement("strong",null,"\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442, \u043d\u043e \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u044d\u0442\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u0438\u0442\u044c!"),l.a.createElement("span",{id:"down"}))}}]),a}(n.Component)),b=function(e){function a(){var e,t;Object(r.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(t=Object(i.a)(this,(e=Object(m.a)(a)).call.apply(e,[this].concat(l)))).state={msgList:[],isLoading:!1},t.sendMsgInChat=function(){},t}return Object(o.a)(a,e),Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch(document.location.origin+"/loadChatHistory",{method:"post",body:JSON.stringify({room:"global"}),headers:new Headers({"Content-Type":"application/json"})}).then((function(e){return e.json()})).then((function(a){console.log(a);var t=a.reply;a.report.isError||0===t.length||e.setState({msgList:t})}))}},{key:"render",value:function(){var e=this.state.msgList;return l.a.createElement("div",{className:"chat-area"},l.a.createElement("div",{className:"title"},l.a.createElement("b",null," \u041f\u0435\u0440\u0435\u043f\u0438\u0441\u043a\u0430 "),l.a.createElement("i",{className:"fa fa-search"})),l.a.createElement(d,{data:e}),l.a.createElement("div",{className:"input-area"},l.a.createElement("div",{className:"input-wrapper"},l.a.createElement("input",{type:"text",defaultValue:"",id:"inputArea"}),l.a.createElement("i",{className:"fa fa-smile-o"}),l.a.createElement("i",{className:"fa fa-paperclip"})),l.a.createElement("input",{type:"button",defaultValue:">",id:"send",onclick:this.sendMsgInChat,className:"send-btn"})))}}]),a}(n.Component);function N(e){var a=e.data,t=a.userName,n=a.onlineStatus;return l.a.createElement("li",null,l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-circle-o "+n}),l.a.createElement("span",null,t),l.a.createElement("i",{className:"fa fa-times"})))}var j=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this.props.listOfUsers;return l.a.createElement("ul",null,l.a.createElement("li",{className:"item"},l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-list-alt"}),l.a.createElement("span",null,"\u0423\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u0438"))),l.a.createElement("li",{className:"item active"},l.a.createElement("a",{href:"#"},l.a.createElement("i",{className:"fa fa-user"}),l.a.createElement("span",null,"\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u0447\u0430\u0442\u0430"),l.a.createElement("i",{className:"fa fa-times"}))),l.a.createElement("ul",null,e.map((function(e){return l.a.createElement(N,{key:e.id,data:e})}))),!e.length&&l.a.createElement("strong",null,"\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442, \u043d\u043e \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u044d\u0442\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u0438\u0442\u044c!"))}}]),a}(n.Component);var v=function(e){var a=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return a?decodeURIComponent(a[1]):void 0},O=function(e){function a(){var e,t;Object(r.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(t=Object(i.a)(this,(e=Object(m.a)(a)).call.apply(e,[this].concat(l)))).state={imgIsLoading:!0,imgLink:""},t}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this,a=v("userName"),t=v("fullName"),n=v("statusText");return this.state.imgIsLoading&&fetch("https://randomuser.me/api/?results=1&inc=picture&noinfo").then((function(e){return e.json()})).then((function(a){e.setState({imgLink:a.results[0].picture.large,imgIsLoading:!1})})),l.a.createElement("div",{className:"my-account"},l.a.createElement("div",{className:"image"},l.a.createElement("img",{src:this.state.imgIsLoading?"chat/white.jpg":this.state.imgLink,title:"\u0410\u0432\u0430\u0442\u0430\u0440 \u0432\u044b\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044f \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e",alt:"User"}),l.a.createElement("i",{className:"fa fa-circle online"})),l.a.createElement("div",{className:"name"},l.a.createElement("span",{id:"myName"},t," (",a,")"),l.a.createElement("i",{className:"fa fa-angle-down"}),l.a.createElement("span",{className:"availability"},n)))}}]),a}(n.Component),g=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){var e=this.props.listOfUsers;return l.a.createElement("div",{className:"conversation-list"},l.a.createElement(j,{listOfUsers:e}),l.a.createElement(O,null))}}]),a}(n.Component),y=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"window-area"},l.a.createElement(g,{listOfUsers:[{userName:"\u0414\u0430\u0432\u0438\u0434 \u0411\u0430\u0440\u0442\u043e",onlineStatus:"online"},{userName:"\u0421\u0435\u0440\u0433\u0435\u0439 \u0411\u043e\u043d\u0434\u0430\u0440\u044c",onlineStatus:"idle"},{userName:"\u0413\u043b\u0435\u0431 \u041a\u0430\u0432\u0440\u0430\u0441\u043a\u0438\u0439",onlineStatus:"offline"}]}),l.a.createElement(b,null),l.a.createElement(f,null))}}]),a}(n.Component),k=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"title"},l.a.createElement("span",null,"\u0427\u0430\u0442"))}}]),a}(n.Component),C=function(e){function a(){return Object(r.a)(this,a),Object(i.a)(this,Object(m.a)(a).apply(this,arguments))}return Object(o.a)(a,e),Object(s.a)(a,[{key:"render",value:function(){return l.a.createElement("div",{className:"window-title"},l.a.createElement("div",{className:"dots"},l.a.createElement("i",{className:"fa fa-circle"}),l.a.createElement("i",{className:"fa fa-circle"}),l.a.createElement("i",{className:"fa fa-circle"})),l.a.createElement(k,null),l.a.createElement("div",{className:"expand"},l.a.createElement("i",{className:"fa fa-expand"})))}}]),a}(n.Component),w=function(e){function a(){var e,t;Object(r.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(t=Object(i.a)(this,(e=Object(m.a)(a)).call.apply(e,[this].concat(l)))).state={myName:"rrr"},t}return Object(o.a)(a,e),Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return l.a.createElement(l.a.Fragment,null,l.a.createElement(C,null),l.a.createElement(y,null))}}]),a}(n.Component);Object(c.render)(l.a.createElement(w,null),document.getElementById("root"))},9:function(e,a,t){e.exports=t(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.5bd122b6.chunk.js.map