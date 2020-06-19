function clearCookies(response, ...params) {
    for (const param of params) {
        response.clearCookie(param);
    }
}
exports.clearCookies = clearCookies;
