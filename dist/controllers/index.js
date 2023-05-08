"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../Model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
class Controller {
    static async login(req, res, next) {
        try {
            const { name, password } = req.body;
            const foundUser = await User_1.default.findOne({ name }).exec();
            // ? Check user is exist or not by phone
            if (foundUser) {
                // * Case Exist
                const isMatchPassword = foundUser.password === password;
                switch (isMatchPassword) {
                    case true: {
                        const { id, name } = foundUser;
                        const tokenPayload = {
                            id,
                            name,
                        };
                        const jwtSecretKey = config_1.default.get("jwt_secret_key");
                        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecretKey, {
                            expiresIn: "3d",
                        });
                        res.status(201).send({
                            status: "Login Success",
                            token,
                        });
                        break;
                    }
                    case false: {
                        res.status(403).send({
                            status: "Fail",
                            message: `Password is in-correct ! Please check it and try again!`,
                        });
                        break;
                    }
                }
            }
            else {
                // * Case does not exist
                res.status(404).send({
                    status: "Not found",
                    message: `User with name: ${name} doesn't exist ! Please check it and try again!`,
                });
            }
        }
        catch (err) {
            next(err);
        }
    }
    static async searchUserByName(req, res, next) {
        try {
            const { name } = req.params;
            const userList = await User_1.default.find({ name: new RegExp(name, "i") });
            res.status(201).send(userList);
        }
        catch (err) {
            next(err);
        }
    }
}
module.exports = Controller;
