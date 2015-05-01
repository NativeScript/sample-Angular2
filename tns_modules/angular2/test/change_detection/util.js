var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var lang_1 = require('angular2/src/facade/lang');
function iterableChangesAsString(_a) {
    var collection = _a.collection, previous = _a.previous, additions = _a.additions, moves = _a.moves, removals = _a.removals;
    if (lang_1.isBlank(collection))
        collection = [];
    if (lang_1.isBlank(previous))
        previous = [];
    if (lang_1.isBlank(additions))
        additions = [];
    if (lang_1.isBlank(moves))
        moves = [];
    if (lang_1.isBlank(removals))
        removals = [];
    return "collection: " + collection.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
}
exports.iterableChangesAsString = iterableChangesAsString;
function kvChangesAsString(_a) {
    var map = _a.map, previous = _a.previous, additions = _a.additions, changes = _a.changes, removals = _a.removals;
    if (lang_1.isBlank(map))
        map = [];
    if (lang_1.isBlank(previous))
        previous = [];
    if (lang_1.isBlank(additions))
        additions = [];
    if (lang_1.isBlank(changes))
        changes = [];
    if (lang_1.isBlank(removals))
        removals = [];
    return "map: " + map.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
}
exports.kvChangesAsString = kvChangesAsString;
