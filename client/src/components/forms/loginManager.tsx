import { Link } from "react-router-dom"
import type { LoginBody } from "../../interfaces";
import { loginRequest } from "../../api/managerRequests";
import appStoreB from '../../assets/app-store-b.png';
import { useState } from "react";

const LoginManager = () => {

    const [message, setMessage] = useState<string>('');

    const signInManager = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const form = e.currentTarget;
        const signInData: LoginBody = { 
            email: form.email.value,
            password: form.password.value
        }

        const res = await loginRequest(signInData)
        
          if(res.data.manager){
            await localStorage.setItem('manager', JSON.stringify(res.data.manager))
            window.location.href = "/";
            return;
        }
        setMessage('El usuario o contraseña son incorrectos');
        return; 
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
                        <label className="form-label">Contraseña</label>
                        <input className="form-input" type="password" name="password"></input>
                    </div>
                    <div className="py-6 text-center">
                        <p>¿No tienes cuenta? <Link className="text-purple-400 font-medium" to="/signIn">Registrare aqui</Link></p>
                    </div>
                    <button className="important-element py-2 font-medium w-full" type="submit">Ingresar</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default LoginManager