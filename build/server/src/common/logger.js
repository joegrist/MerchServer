"use strict";
exports.__esModule = true;
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.log = function (message) {
        console.log(message);
    };
    Logger.prototype.err = function (message, error) {
        if (error === void 0) { error = null; }
        if (!error) {
            console.error(message);
            return;
        }
        console.error("".concat(message, ": ").concat(error.name, ": ").concat(error.message));
    };
    return Logger;
}());
exports.Logger = Logger;
