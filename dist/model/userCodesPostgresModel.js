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
exports.getVerificationByEmail = exports.removeVerificationByEmail = exports.addVerification = void 0;
const postgresDatabase_1 = __importDefault(require("../database/postgresDatabase"));
const addVerification = (verification) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO public.verify_user_codes (email, verify_code, expiration_date)
        VALUES ($1, $2, $3);
    `;
    yield postgresDatabase_1.default.query(query, [verification.email, verification.verify_code, verification.expiration_date]);
});
exports.addVerification = addVerification;
const removeVerificationByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        DELETE FROM public.verify_user_codes
        WHERE email = $1;
    `;
    yield postgresDatabase_1.default.query(query, [email]);
});
exports.removeVerificationByEmail = removeVerificationByEmail;
const getVerificationByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM public.verify_user_codes WHERE email = $1;`;
    const result = yield postgresDatabase_1.default.query(query, [email]);
    if (result.rows.length == 0)
        throw Error("No verification code for that email");
    return result.rows[0];
});
exports.getVerificationByEmail = getVerificationByEmail;
exports.default = { addVerification: exports.addVerification, removeVerificationByEmail: exports.removeVerificationByEmail, getVerificationByEmail: exports.getVerificationByEmail };
