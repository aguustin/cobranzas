import { Link } from "react-router-dom"
import type { SignInBody } from "../../interfaces";
import { signInRequest } from "../../api/managerRequests";
import appStoreB from '../../assets/app-store-b.png';

const LoginManager = () => {

    const signInManager = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        const form = e.currentTarget;
        const signInData: SignInBody = { 
            email: form.email.value,
            username: form.username.value,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value
        }

        signInRequest(signInData)
    }    

    return(
        <>
        <div className="">
            <img className="mx-auto mb-10" src={appStoreB}></img>
            <div className="h-full center-content">
                <form className="secondary-background p-6 w-[500px] max-[700px]:w-full rounded-2xl border-gray-700 border-2" onSubmit={(e) => signInManager(e)}>
                    <div className="mb-6 text-center">
                        <h3 className="title title-font-a text-4xl">NovaStore</h3>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email"></input>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input className="form-input" type="email"></input>
                    </div>
                    <div className="py-6 text-center">
                        <p>¿No tienes cuenta? <Link className="text-purple-400 font-medium" to="/login">Registrare aqui</Link></p>
                    </div>
                    <button className="important-element py-2 font-medium w-full" type="submit">Ingresar</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default LoginManager