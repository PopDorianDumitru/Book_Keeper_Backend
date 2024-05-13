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
exports.removeUserById = exports.getUsersByUsername = exports.addUser = exports.getAllUsers = exports.getUserByEmailNoPassword = exports.verifyUser = exports.getUserByEmail = exports.getUserById = void 0;
const postgresDatabase_1 = __importDefault(require("../database/postgresDatabase"));
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userRow = yield postgresDatabase_1.default.query('SELECT username, email, verified FROM public.users WHERE id = $1', [id]);
    if (userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userRow = yield postgresDatabase_1.default.query('SELECT username, email, password, verified FROM public.users WHERE email = $1', [email]);
    if (userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
});
exports.getUserByEmail = getUserByEmail;
const verifyUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('UPDATE public.users SET verified = true WHERE email = $1', [email]);
    if (result.rowCount === 0)
        throw new Error("User not found");
});
exports.verifyUser = verifyUser;
const getUserByEmailNoPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userRow = yield postgresDatabase_1.default.query('SELECT username, email, verified FROM public.users WHERE email = $1', [email]);
    if (userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
});
exports.getUserByEmailNoPassword = getUserByEmailNoPassword;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return (yield postgresDatabase_1.default.query('SELECT username, email, verified FROM public.users')).rows;
});
exports.getAllUsers = getAllUsers;
const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield postgresDatabase_1.default.query('INSERT INTO public.users (id, username, password, email, session_id, session_expiration_date, verified) VALUES ($1, $2, $3, $4, $5, $6, false)', [user.id, user.username, user.password, user.email, user.session_id, user.session_expiration_date]);
        if (result.rowCount === 0)
            throw new Error("User not added");
    }
    catch (err) {
        throw new Error("Email already in use");
    }
});
exports.addUser = addUser;
const getUsersByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const userRow = yield postgresDatabase_1.default.query('SELECT username, email, verified FROM public.users WHERE username = $1', [username]);
    if (userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
});
exports.getUsersByUsername = getUsersByUsername;
const removeUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('DELETE FROM public.users WHERE id = $1', [id]);
    if (result.rowCount === 0)
        throw new Error("User not found");
});
exports.removeUserById = removeUserById;
exports.default = { getUserById: exports.getUserById, getAllUsers: exports.getAllUsers, addUser: exports.addUser, getUsersByUsername: exports.getUsersByUsername, removeUserById: exports.removeUserById, getUserByEmail: exports.getUserByEmail, getUserByEmailNoPassword: exports.getUserByEmailNoPassword, verifyUser: exports.verifyUser };
