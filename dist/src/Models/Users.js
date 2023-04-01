"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Can't be blank"],
        index: true,
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {},
    },
    status: {
        type: String,
        default: "online",
    },
}, { minimize: false });
exports.default = UserSchema;
