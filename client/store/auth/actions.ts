import { AuthEnum } from "./enum";

export const setToken = (token) => {
  return {
    type: AuthEnum.SET_TOKEN,
    token
  }
}

export const clearToken = () => {
  return {
    type: AuthEnum.CLEAR_TOKEN
  }
}