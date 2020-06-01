const path = require("path");
function redirectIfNecessary(target, request, response) {
    if (!!request.session.authInfo !== (target === "/")) {
        response.sendFile(path.join(__dirname, target === "/" ? "authorize" : "build", "index.html"));
    }
    else {
        response.redirect(target === "/" ? "/chat" : "/");
    }
}
exports.redirectIfNecessary = redirectIfNecessary;
