"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyUser = exports.getUserByEmail = exports.logOutUser = exports.logInUsingEmailAndPassword = exports.removeUserById = exports.getUsersByUsername = exports.sendVerificationEmail = exports.addUser = exports.getUserById = exports.getAccessToken = exports.authenticateUser = exports.getAllUsers = void 0;
const userPostgresModel_1 = __importDefault(require("../model/userPostgresModel"));
const crypto_1 = require("crypto");
const userValidator_1 = __importDefault(require("../validators/userValidator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const refreshTokenController_1 = __importDefault(require("./refreshTokenController"));
const userCodesPostgresModel_1 = __importDefault(require("../model/userCodesPostgresModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userCodesPostgresModel_2 = __importDefault(require("../model/userCodesPostgresModel"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userPostgresModel_1.default.getAllUsers();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});
exports.getAllUsers = getAllUsers;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const defaultReturnObject = { authenticated: false, user: null };
    try {
        const token = String((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
        if (!token) {
            res.status(401).json(defaultReturnObject);
            return;
        }
        const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY);
        res.status(200).json({ authenticated: true, user: { email: user.email, username: user.username } });
    }
    catch (err) {
        res.status(401).json(defaultReturnObject);
    }
});
exports.authenticateUser = authenticateUser;
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            res.status(400).json("Bad token request. Missing refresh token");
            return;
        }
        let payload = "";
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { ignoreExpiration: true });
                if (decodedToken && decodedToken.email) {
                    yield refreshTokenController_1.default.RemoveRefreshToken(decodedToken.email);
                }
                res.status(401).json("Token expired");
                return;
            }
            else {
                throw err;
            }
        }
        if (typeof payload !== 'object') {
            res.status(400).json("Bad token");
            return;
        }
        const user = payload;
        const hashedToken = yield refreshTokenController_1.default.getHashedRefreshToken(user.email);
        if (!hashedToken) {
            res.status(400).json("Invalid token");
            return;
        }
        const match = yield bcrypt_1.default.compare(refreshToken, hashedToken.token);
        if (!match) {
            res.status(400).json("Invalid token");
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email, username: user.username }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_VALIDITY + "s" });
        res.status(200).json({ accessToken });
    }
    catch (err) {
        res.status(400).json(err.message);
    }
});
exports.getAccessToken = getAccessToken;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json("ID is required");
        return;
    }
    try {
        const user = yield userPostgresModel_1.default.getUserById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.getUserById = getUserById;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.body;
    try {
        user.id = (0, crypto_1.randomUUID)();
        (0, userValidator_1.default)(user);
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(user.password, saltRounds);
        user.password = hashedPassword;
        yield userPostgresModel_1.default.addUser(user);
        const email = user.email;
        const domain = email.split('@')[1];
        let transporter = nodemailer_1.default.createTransport({
            host: `smtp.gmail.com`,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const verify_code = jsonwebtoken_1.default.sign({ email: email }, process.env.SECRET_JWT_KEY);
        const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verify_code}`;
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Account verification Book Keeper",
            text: `Please click the following link to verify your account: ${verificationLink}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return;
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
        const minutes = Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000;
        yield userCodesPostgresModel_1.default.addVerification({ email: user.email, verify_code: yield bcrypt_1.default.hash(verify_code, 10), expiration_date: new Date(Date.now() + minutes) });
        res.status(201).end();
    }
    catch (err) {
        res.status(400).json(err.message);
    }
});
exports.addUser = addUser;
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (!email) {
        res.status(400).json("Email is required");
        return;
    }
    try {
        const user = yield userPostgresModel_1.default.getUserByEmail(email);
        if (!user) {
            res.status(404).json("User not found");
            return;
        }
        yield userCodesPostgresModel_1.default.removeVerificationByEmail(email);
        const domain = email.split('@')[1];
        let transporter = nodemailer_1.default.createTransport({
            host: `smtp.gmail.com`,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const verify_code = jsonwebtoken_1.default.sign({ email: email }, process.env.SECRET_JWT_KEY);
        const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verify_code}`;
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Account verification Book Keeper",
            text: `Please click the following link to verify your account: ${verificationLink}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return;
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
        const minutes = Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000;
        yield userCodesPostgresModel_1.default.addVerification({ email: user.email, verify_code: yield bcrypt_1.default.hash(verify_code, 10), expiration_date: new Date(Date.now() + minutes) });
        res.status(200).end();
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const getUsersByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    if (!username) {
        res.status(400).json("Username is required");
        return;
    }
    try {
        const user = yield userPostgresModel_1.default.getUsersByUsername(username);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.getUsersByUsername = getUsersByUsername;
const isSixDigitCode = (code) => {
    return /^\d{6}$/.test(code);
};
const removeUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(400).json("ID is required");
        return;
    }
    try {
        yield userPostgresModel_1.default.removeUserById(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.removeUserById = removeUserById;
const logInUsingEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, code } = req.body;
    if (!email || !password) {
        res.status(400).json("Email and password are required");
        return;
    }
    try {
        const user = yield userPostgresModel_1.default.getUserByEmail(email);
        if (!user) {
            res.status(404).json("User not found");
            return;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(400).json("Invalid password");
            return;
        }
        delete user.password;
        if (!user.verified) {
            res.status(403).json({ message: "That email has not been verified!" });
            return;
        }
        if (!code) {
            const domain = email.split('@')[1];
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            let transporter = nodemailer_1.default.createTransport({
                host: `smtp.gmail.com`,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Book Keeper Log In Code",
                text: `Your code to log in is: ${verificationCode}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return;
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
            yield userCodesPostgresModel_2.default.removeVerificationByEmail(email);
            yield userCodesPostgresModel_2.default.addVerification({ verify_code: verificationCode, expiration_date: new Date(Date.now() + Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000), email: email });
            res.status(200).json({ message: "Verification code sent", secondFactorAuthenticationRequired: true });
        }
        else {
            if (!isSixDigitCode(code)) {
                res.status(400).json({ message: "Invalid code" });
                return;
            }
            const verification = yield userCodesPostgresModel_2.default.getVerificationByEmail(email);
            if (verification.verify_code != code) {
                res.status(400).json({ message: "Code is not correct" });
                return;
            }
            if (verification.expiration_date < Date.now()) {
                res.status(400).json({ message: "Code is expired" });
                return;
            }
            const token = jsonwebtoken_1.default.sign(user, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_VALIDITY + "s" });
            const refreshToken = jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_VALIDITY + "s" });
            yield userCodesPostgresModel_2.default.removeVerificationByEmail(email);
            refreshTokenController_1.default.AddRefreshToken(refreshToken, user.email, user.username);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_VALIDITY) * 1000 });
            res.status(200).json({ user, token });
        }
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.logInUsingEmailAndPassword = logInUsingEmailAndPassword;
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const token = String((_d = (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.authorization) === null || _d === void 0 ? void 0 : _d.replace('Bearer ', ''));
    if (!token) {
        res.status(401).json("No token provided");
        return;
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY);
        console.log("Got here");
        yield refreshTokenController_1.default.RemoveRefreshToken(user.email);
        res.clearCookie('refreshToken');
        res.status(200).json("Logged out");
    }
    catch (err) {
        res.status(401).json("Invalid token");
    }
});
exports.logOutUser = logOutUser;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (!email) {
        res.status(400).json("Email is required");
        return;
    }
    try {
        const user = yield userPostgresModel_1.default.getUserByEmailNoPassword(email);
        if (!user)
            res.status(404).json("User not found");
        else
            res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.getUserByEmail = getUserByEmail;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.query.token;
    let decodedToken = "";
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY);
    }
    catch (err) {
        res.status(400).json("Invalid token");
        return;
    }
    if (typeof decodedToken !== 'object') {
        res.status(400).json("Invalid token");
        return;
    }
    const email = decodedToken.email;
    if (!token) {
        res.status(400).json("Token is required");
        return;
    }
    if (!email) {
        res.status(400).json("Email is required");
        return;
    }
    try {
        try {
            const user = yield userPostgresModel_1.default.getUserByEmailNoPassword(email);
        }
        catch (err) {
            res.status(404).json({ message: "Could not find any account linked to this email… Maybe sign up first?" });
            return;
        }
        const verification = yield userCodesPostgresModel_1.default.getVerificationByEmail(email);
        if (!verification) {
            res.status(404).json("Verification not found");
            return;
        }
        // if(verification.expiration_date < Date.now())
        // {
        //   res.status(400).json("Verification token expired");
        //   return;
        // }
        const match = yield bcrypt_1.default.compare(token, verification.verify_code);
        if (!match) {
            res.status(400).json("Invalid verification token");
            return;
        }
        yield userPostgresModel_1.default.verifyUser(verification.email);
        yield userCodesPostgresModel_1.default.removeVerificationByEmail(verification.email);
        res.status(201).end();
    }
    catch (err) {
        res.status(404).json(err.message);
    }
});
exports.verifyUser = verifyUser;
exports.default = { getAllUsers: exports.getAllUsers, getUserById: exports.getUserById, addUser: exports.addUser, getUsersByUsername: exports.getUsersByUsername, removeUserById: exports.removeUserById, logInUsingEmailAndPassword: exports.logInUsingEmailAndPassword, authenticateUser: exports.authenticateUser, getAccessToken: exports.getAccessToken, logOutUser: exports.logOutUser, getUserByEmail: exports.getUserByEmail, sendVerificationEmail: exports.sendVerificationEmail, verifyUser: exports.verifyUser };
