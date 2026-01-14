import { Link } from "react-router-dom"
import type { SignInBody } from "../../interfaces";
import { signInRequest } from "../../api/managerRequests";
import appStoreB from '../../assets/app-store-b.png';
import { useState } from "react";
import type { AxiosResponse } from "axios";


const RegisterManager = () => {
    const [message, setMessage] = useState<string>('');
    
    const signInManager = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const form = e.currentTarget;
        const signInData: SignInBody = { 
            email: form.email.value,
            username: form.username.value,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value
        }

        const res: AxiosResponse<number> = await signInRequest(signInData)
        
        if(res.data.resMessage === 1){
            window.location.href = "/login";
        }

        return setMessage('El usuario ya existe');
    }    

    return(
        <>
        {message.length > 0 && <p className="text-red-500 text-center">{message}</p>}
        <div className="">
            <img className="mx-auto mb-10" src={appStoreB}></img>
            <div className="h-full center-content">
                <form className="secondary-background p-6 w-[500px] max-[700px]:w-full rounded-2xl border-gray-700 border-2" onSubmit={(e) => signInManager(e)}>
                    <div className="mb-6 text-center">
                        <h3 className="title title-font-a text-4xl">NovaStore</h3>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" name="email"></input>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Nombre de usuario</label>
                        <input className="form-input" type="text" name="username"></input>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input className="form-input" type="password" name="password"></input>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Confirmar contraseña</label>
                        <input className="form-input" type="password" name="confirmPassword"></input>
                    </div>
                    <div className="py-6 text-center">
                        <p>¿Ya tienes cuenta? <Link className="text-purple-400 font-medium" to="/login">Ingresa aqui</Link></p>
                    </div>
                    <button className="important-element py-2 font-medium w-full" type="submit">Registrarse</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default RegisterManager
/** email:string,
    contraseña:string,
    completeName:string,
    subscriptionPlan:number,  //1. free, 2. simple, 3. plus
    storesQuantity?:number,
    active:boolean,
    payment?: number,
    paymentDate?: Date,
    managerId: string,
    cardToken: string */