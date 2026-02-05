"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAME_MAX_LENGTH = exports.NAME_MIN_LENGTH = exports.PASSWORD_MAX_LENGTH = exports.PASSWORD_MIN_LENGTH = exports.PASSWORD_REGEX = exports.EMAIL_REGEX = void 0;
exports.EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
exports.PASSWORD_MIN_LENGTH = 8;
exports.PASSWORD_MAX_LENGTH = 128;
exports.NAME_MIN_LENGTH = 2;
exports.NAME_MAX_LENGTH = 50;
//# sourceMappingURL=validation.js.map