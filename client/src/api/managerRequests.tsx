import axios from "axios";
import type { LoginBody , SignInBody } from "../interfaces";

export const getAllManagers = () => axios.get('http://localhost:4000/get_all_managers')

export const signInRequest = (signInData: SignInBody) => axios.post('http://localhost:4000/signIn_manager', {signInData})

export const loginRequest = (loginData: LoginBody) => axios.post('http://localhost:4000/login_manager', loginData)