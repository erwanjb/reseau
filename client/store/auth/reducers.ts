// Store/Reducers/favoriteReducer.js
import { AuthEnum } from "./enum";

interface Auth {
    token: string
}
const initialState: Auth = { token: '' }

const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case AuthEnum.SET_TOKEN:
            return { token: action.token }
            break;
        case AuthEnum.CLEAR_TOKEN:
            return { token: ''};
            break;
        default:
            return {...state};
    }
}

export default tokenReducer;