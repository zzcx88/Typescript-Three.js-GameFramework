"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingletoneBase = /** @class */ (function () {
    function SingletoneBase() {
    }
    SingletoneBase.getInstance = function () {
        if (!this.instance) {
            this.instance = new this;
        }
        return this;
    };
    return SingletoneBase;
}());
exports.SingletoneBase = SingletoneBase;
//# sourceMappingURL=SingletoneBase.js.map