"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = req.query;
    if (!name) {
        res.statusCode = 403;
        res.send({ error: "Invalid name" });
    }
    try {
        let user = yield prisma_1.default.user.create({
            data: {
                email: `${name}@fakemail.oo`,
                password: "password",
            },
        });
        console.log(user);
        res.send({ data: user, status: "success" });
    }
    catch (error) {
        res.statusCode = 401;
        if (error.code == 'P2002') {
            res.send({ status: "error", message: "User already exists" });
        }
    }
}));
exports.default = router;
