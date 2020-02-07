/* eslint-disable no-undef */
function id(id) {
    return document.getElementById(id);
}
function changeActiveCard(activeCardId, inActiveCardId) {
    id(activeCardId).classList.add("active");
    id(activeCardId).classList.remove("inactive");
    id(inActiveCardId).classList.remove("active");
    id(inActiveCardId).classList.add("inactive");
}
tippy.setDefaultProps({
    ignoreAttributes: true,
    placement : "bottom",
    showOnCreate : true,
    trigger : "manual"
});

id("signin").onclick = function () {
    changeActiveCard("signin", "signup");

    id("form-signin").classList.remove("form-signin-left");
    id("form-signup").classList.remove("form-signup-left");
    id("frame").classList.remove("frame-long");
    id("forgot").classList.remove("forgot-left");
}
id("signup").onclick = function () {
    changeActiveCard("signup", "signin");

    id("form-signin").classList.add("form-signin-left");
    id("form-signup").classList.add("form-signup-left");
    id("frame").classList.add("frame-long");
    id("forgot").classList.add("forgot-left");
}
id("form-signin").onsubmit = function (event) {
    event.preventDefault();
    const data = {
        userNameOrEmail: id("userNameOrEmail").value,
        password: id("passwordLogin").value
    };
    fetch(document.location.origin + '/canIlogin', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data)
        const { isError, info } = data.report;
        const { fullName, avatarLink, errorField } = data.reply;
        if (isError) {
            // TODO: Сделать нормальную всплывающую подсказку
            tippy(id(errorField), {
                content: info
            });
        } else {
            id("profile-photo").style.backgroundImage = `url(${avatarLink})` ;
            id("welcome").textContent = `Welcome, ${fullName}` ;
            id("btn-animate").classList.add("btn-animate-grow");
            id("welcome").classList.add("welcome-left");
            id("cover-photo").classList.add("cover-photo-down");
            id("frame").classList.add("frame-short");
            id("profile-photo").classList.add("profile-photo-down");
            id("forgot").classList.add("forgot-fade");
            setTimeout( function () {
                document.location.href = document.location.origin + "/chat";
            }, 3000);
        }
    });
}

id("form-signup").onsubmit = function (event) {
    event.preventDefault();
    const data = {
        userName: id("userName").value,
        password: id("passwordRegister").value,
        confirmPassword: id("confirmPassword").value,
        email: id("email").value,
        fullName: id("fullName").value
    };
    fetch(document.location.origin + '/canIregister', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data)
        const { isError, info } = data.report;
        const { errorField } = data.reply;
        if (isError) {
            // TODO: Сделать нормальную всплывающую подсказку
            tippy(id(errorField), {
                content: info
            });
        } else {
            id("nav").classList.add("nav-up");
            id("form-signup").classList.add("form-signup-down");
            id("success").classList.add("success-left");
            id("frame").classList.add("frame-short");
            setTimeout( function () {
                document.location.href = document.location.origin + "/chat";
            }, 3000);
        }
    });
}