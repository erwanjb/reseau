import jwt from 'jsonwebtoken';

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

export const getToken = state => {
    return state.token.token;
}

export const getUserConnected = state => {
    return jwt.verify(state.token.token, process.env.JWT_SECRET) as User;
}