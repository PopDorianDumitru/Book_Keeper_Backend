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
exports.getHashedRefreshToken = exports.RemoveRefreshToken = exports.AddRefreshToken = void 0;
const refreshTokenPostgresModel_1 = __importDefault(require("../model/refreshTokenPostgresModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AddRefreshToken = (token, email, username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || !email || !username) {
        throw Error("Invalid arguments");
    }
    let hashedToken = yield bcrypt_1.default.hash(token, 10);
    try {
        yield refreshTokenPostgresModel_1.default.addRefreshToken(hashedToken, email, username);
    }
    catch (err) {
        throw new Error("Error adding refresh token");
    }
});
exports.AddRefreshToken = AddRefreshToken;
const RemoveRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield refreshTokenPostgresModel_1.default.removeRefreshToken(email);
    }
    catch (err) {
        throw new Error("Error removing refresh token");
    }
});
exports.RemoveRefreshToken = RemoveRefreshToken;
const getHashedRefreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken = "";
    try {
        refreshToken = yield refreshTokenPostgresModel_1.default.getRefreshToken(email);
        return refreshToken;
    }
    catch (err) {
        throw Error("Refresh token not found");
    }
});
exports.getHashedRefreshToken = getHashedRefreshToken;
exports.default = { AddRefreshToken: exports.AddRefreshToken, RemoveRefreshToken: exports.RemoveRefreshToken, getHashedRefreshToken: exports.getHashedRefreshToken };
