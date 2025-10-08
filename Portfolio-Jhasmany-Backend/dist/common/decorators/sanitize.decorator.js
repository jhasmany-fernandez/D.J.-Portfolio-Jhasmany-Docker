"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeHtml = SanitizeHtml;
exports.SanitizeEmail = SanitizeEmail;
exports.SanitizeText = SanitizeText;
const class_transformer_1 = require("class-transformer");
function SanitizeHtml() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .trim();
    });
}
function SanitizeEmail() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value.toLowerCase().trim();
    });
}
function SanitizeText() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        return value.trim().replace(/\s+/g, ' ');
    });
}
//# sourceMappingURL=sanitize.decorator.js.map