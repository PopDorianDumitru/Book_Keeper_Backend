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
const postgresDatabase_1 = __importDefault(require("../database/postgresDatabase"));
const addRefreshToken = (token, email, username) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      INSERT INTO public.refresh_tokens (token, email, username)
      VALUES ($1, $2, $3);
    `;
    yield postgresDatabase_1.default.query(query, [token, email, username]);
});
const removeRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      DELETE FROM public.refresh_tokens
      WHERE email = $1;
    `;
    yield postgresDatabase_1.default.query(query, [email]);
});
const getRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT * FROM public.refresh_tokens
      WHERE email = $1;
    `;
    const result = yield postgresDatabase_1.default.query(query, [email]);
    if (result.rows.length == 0)
        throw Error("No tokens for that email");
    return result.rows[0];
});
exports.default = { removeRefreshToken, addRefreshToken, getRefreshToken };
