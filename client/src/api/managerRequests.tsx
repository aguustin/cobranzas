import axios from "axios";
import type { SignInBody } from "../interfaces";

export const signInRequest = (signInData: SignInBody) => axios.post('http://localhost:4000/signIn_manager', signInData)