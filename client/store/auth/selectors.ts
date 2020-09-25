import jwt from 'jsonwebtoken';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
}

export const getToken = state => {
    return state.token.token;
}

export const getUserConnected = state => {
    try {
        return jwt.verify(state.token.token, process.env.JWT_SECRET) as User;
    } catch (err) {
        return null;
    }
}