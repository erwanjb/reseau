import { getToken, getUserConnected } from "../store/auth/selectors";
import { useSelector } from 'react-redux';
import { User } from "../store/auth/selectors";

const useToken = () => useSelector(getToken);

export const useUserConnected = () => useSelector(getUserConnected);

export default useToken;