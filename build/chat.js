var report; // в неё будут помещаться отчёты от сервера (на потом)
// Чётные reportCode означают успешные события, нечётные - ошибки
var reply; // в ней будут остальные данные присылаемые сервером
// Данные в reply и report могут быстро перезаписываться, это некий буфер, так что их следует обрабатывать в callBack функциях
// this в callBack функциях подразумевает используемый обьект XMLHttpRequest(), при событии onreadystatechange
var data;

function send_JSON_to_server(data, handler, callBack) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', handler, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status != 200) {
                // ошибка соединения
                report = this.status + ': ' + this.statusText; // пример вывода: 404: Not Found
                console.error((this.status == 0) ? "Вы не подключены к сети" : report);
            } else {
                console.log(this);
                callBack.call(this);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

window.onload = function () {

    cometApi.start({
        dev_id: 2375,
        /* user_id:1, user_key:"userHash",*/ node: "app.comet-server.ru"
    });
    cometApi.subscription("globalChat.messages", function (e) {
        console.log(e);
        var reply = e.data;
        var result = '<li class="' + ((myName.textContent == reply.author) ? 'me' : '') + '"><div class="name"><span class="">' + reply.author + '</span></div><div class="message"><p>' + reply.text + '</p><span class="msg-time">' + reply.time + '</span></div></li>';
        // TODO: избавиться от столь примитивного вывода
        document.getElementById("history").innerHTML += result;
        window.location.hash = "";
        $(function () {
            $('.chat-area > .chat-list').jScrollPane({
                mouseWheelSpeed: 30
            });
        });
        // setTimeout(() => { // добавили задержку
        //     window.location.hash = "#goToLastMsg";
        // }, 200);
        const block = document.getElementById("goToLastMsg");
        block.scrollTop = block.scrollHeight;
    });
    cometApi.subscription("track_globalChat.unsubscription", function (e) {
        console.log(e);
    });




    var sendCallBack = function () {
        report = JSON.parse(this.responseText).report; // responseText  текст ответа.
        if (report.status) {
            console.info("Отчёт об успехе: " + report.text + " Код состояния: " + report.code);
        } else {
            console.error("Отчёт об ошибке: " + report.text + " Код состояния: " + report.code);
        }
    };
    send.onclick = function () {
        var data = {
            target: "send",
            message: inputArea.value.replace(/"/g, '”'),
            to: 'будущая возможность указать адресата'
        };
        send_JSON_to_server(data, 'chat_handler.php', sendCallBack);
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var loadCallBack = function () {
        data = JSON.parse(this.responseText);
        report = data.report;
        reply = data.reply;
        if (report.status) {
            console.info("Отчёт об успехе: " + report.text + " Код состояния: " + report.code);
            // обработка данных, которые хранятся в reply
            var result = '';
            for (var message in reply) {
                result += '<li class="' + ((myName.textContent == reply[message].author) ? 'me' : '') + '"><div class="name"><span class="">' + reply[message].author + '</span></div><div class="message"><p>' + reply[message].text + '</p><span class="msg-time">5:00 pm</span></div></li>';
                // TODO: избавиться от столь примитивного вывода
            }
            document.getElementById("history").innerHTML = result;
            // window.location.hash = "";
            // window.location.hash = "#goToLastMsg";
            // в будущем запросы будут построены так, что сервер будет сам присылать данные и только в виде неких "обновлений" или непрочитанных, а не всю историю чата
            $(function () {
                $('.chat-area > .chat-list').jScrollPane({
                    mouseWheelSpeed: 30
                });
            });
            const block = document.getElementById("#goToLastMsg");
            block.scrollTop = block.scrollHeight;
        } else {
            console.error("Отчёт об ошибке: " + report.text + " Код состояния: " + report.code);
        }
    };
    var loadFun = function () {
        var data = {
            target: "load"
        };
        send_JSON_to_server(data, 'chat_handler.php', loadCallBack);
    };
    loadFun(); // TODO: эта функция первоначально должна загружать только последние несколько сообщений
    load.onclick = loadFun;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    logout.onclick = function () {
        document.location.href = "logout.php";
    };
};