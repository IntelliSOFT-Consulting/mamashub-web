"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//Import routes 
const main_1 = __importDefault(require("./routes/main"));
const users_1 = __importDefault(require("./routes/users"));
const app = express_1.default();
const PORT = 8080;
app.use('/', main_1.default);
app.use('/auth', users_1.default);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
