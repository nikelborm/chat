function isAllStrings(body) {
    let result = 1;
    for (let prop in body) {
        result &= +(typeof body[prop] === "string");
    }
    return result;
}
exports.isAllStrings = isAllStrings;
