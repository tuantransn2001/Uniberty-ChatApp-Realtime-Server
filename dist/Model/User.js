"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    id: { type: String },
    name: { type: String },
    password: { type: String },
    contactList: { type: [String] },
    status: {
        type: String,
        default: "offline",
    },
}, { minimize: false });
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
