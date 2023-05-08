"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    id: String,
    content: String,
    time: String,
    date: Date,
    from: String,
    to: String,
});
const Message = mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
