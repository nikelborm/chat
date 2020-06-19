function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
function hasIntersections(setA, setB) {
    for (const elem of setB) {
        if (setA.has(elem)) return true;
    }
    return false;
}
exports.hasIntersections = hasIntersections;
exports.intersection = intersection;
