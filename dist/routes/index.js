"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controller = require("../controllers");
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const rootRouter = (0, express_1.Router)();
rootRouter.post("/login", Controller.login, errorHandler_1.default);
rootRouter.get("/search/:name", Controller.searchUserByName, errorHandler_1.default);
exports.default = rootRouter;
