import { Link } from "react-router-dom"
import type { SignInBody } from "../../interfaces";
import { signInRequest } from "../../api/managerRequests";
import appStoreB from '../../assets/app-store-b.png';
import { useState } from "react";
import type { AxiosResponse } from "axios";


const RegisterManager = () => {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const signInManager = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsLoading(true);
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
            return;
        }
         setIsLoading(false);
        return setMessage('El usuario ya existe');
    }    

    return(
        <>
                   <div className="register-root">
                <div className="bg-glow bg-glow-1" />
                <div className="bg-glow bg-glow-2" />
                <div className="bg-grid" />
 
                <div className="register-card">
                    <div className="card-top-line" />
 
                    <div className="logo-area">
                        <img className="logo-img" src={appStoreB} alt="NovaStore" />
                        <h1 className="brand-name">NovaStore</h1>
                        <p className="brand-tagline">Crear cuenta</p>
                    </div>
 
                    {message && (
                        <div className="error-msg">
                            <span>⚠</span>
                            {message}
                        </div>
                    )}
 
                    <form onSubmit={signInManager}>
                        <div className="field-group">
                            <label className="field-label" htmlFor="email">Email</label>
                            <input
                                className="field-input"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
 
                        <div className="field-group">
                            <label className="field-label" htmlFor="username">Nombre de usuario</label>
                            <input
                                className="field-input"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="tu_usuario"
                                required
                            />
                        </div>
 
                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label" htmlFor="password">Contraseña</label>
                                <input
                                    className="field-input"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="confirmPassword">Confirmar</label>
                                <input
                                    className="field-input"
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
 
                        <div className="divider">
                            <span className="divider-line" />
                            <span className="divider-text">continuar</span>
                            <span className="divider-line" />
                        </div>
 
                        <div className="login-link">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login">Ingresa aquí</Link>
                        </div>
 
                        <button className="submit-btn" type="submit" disabled={isLoading}>
                            {isLoading && <span className="spinner" />}
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
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