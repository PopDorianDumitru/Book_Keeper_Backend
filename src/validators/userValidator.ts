import { User } from "../model/userPostgresModel";

const validUser = (user: User): boolean => {

    if(user.username.length < 2)
    throw new Error("Username must be at least 2 characters long");

    if(user.password.length < 8)
    throw new Error("Password must be at least 8 characters long");

    if(user.email.length < 2)
    throw new Error("Email must be at least 2 characters long");


    if(!/[A-Z]/.test(user.password))
        throw new Error("Password must contain at least one capital letter");

    if(!/[a-z]/.test(user.password))
        throw new Error("Password must contain at least one lowercase letter");

    if(!/[!@#$%^&*,.?:|]/.test(user.password))
        throw new Error("Password must contain at least one special character");
    if(!/[0-9]/.test(user.password))
        throw new Error("Password must contain at least one number");
    if(!/@/.test(user.email))
        throw new Error("Email must contain @");
    return true;
}
export default validUser;