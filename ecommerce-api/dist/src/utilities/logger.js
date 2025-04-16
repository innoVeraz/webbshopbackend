"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const logError = (error) => {
    return error instanceof Error
        ? error.message
        : "Unknown error";
};
exports.logError = logError;
//# sourceMappingURL=logger.js.map