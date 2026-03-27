import { Link } from "react-router-dom"
import type { LoginBody } from "../../interfaces";
import { loginRequest } from "../../api/managerRequests";
import appStoreB from '../../assets/app-store-b.png';
import { useState } from "react";

const Login = () => {

    const [message, setMessage] = useState<string>('');
    const [role, setRole] = useState<'manager' | 'cashier'>('manager');
    const [isLoading, setIsLoading] = useState(false);
 
    const loginManager = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsLoading(true);
        const form = e.currentTarget;
        const signInData: LoginBody = { 
            email: form.email?.value ?? '',
            username: form.username?.value ?? '',
            password: form.password.value,
            userRole: role
        }
        console.log(signInData)
        const res = await loginRequest(signInData)
        
          if(res.data.token){
            await localStorage.setItem('manager', JSON.stringify(res.data.manager))
            await localStorage.setItem('token', res.data.token)
            await localStorage.setItem('role', role);
            window.location.href = "/";
            return;
        }
        
          setIsLoading(false);
        setMessage('El usuario o contraseña son incorrectos');
        return; 
    }    

     return (
        <>
          
            <div className="login-root">
                <div className="bg-glow bg-glow-1" />
                <div className="bg-glow bg-glow-2" />
                <div className="bg-grid" />
 
                <div className="login-card">
                    <div className="card-top-line" />
 
                    <div className="logo-area">
                        <img className="logo-img" src={appStoreB} alt="NovaStore" />
                        <h1 className="brand-name">NovaStore</h1>
                        <p className="brand-tagline">Panel de gestión</p>
                    </div>
 
                    {/* Role selector */}
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${role === 'manager' ? 'active' : ''}`}
                            onClick={() => setRole('manager')}
                        >
                            <span className="role-icon">👑</span>
                            Soy dueño
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'cashier' ? 'active' : ''}`}
                            onClick={() => setRole('cashier')}
                        >
                            <span className="role-icon">🧾</span>
                            Soy cajero
                        </button>
                    </div>
 
                    {message && (
                        <div className="error-msg">
                            <span>⚠</span>
                            {message}
                        </div>
                    )}
 
                    <form onSubmit={loginManager}>
                        <div className="field-group">
                            <label className="field-label" htmlFor={`${role === "manager" ? "email" : "username"}`}>{role === "manager" ? 'Email' : 'Usuario'}</label>
                            <input
                                className="field-input"
                                id={`${role === "manager" ? "email" : "username"}`}
                                type={`${role === "manager" ? "email" : "text"}`}
                                name={`${role === "manager" ? "email" : "username"}`}
                                placeholder={role === "manager" ? 'tu@email.com' : 'Tu nombre de usuario'}
                                required
                            />
                        </div>
 
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
 
                        <div className="divider">
                            <span className="divider-line" />
                            <span className="divider-text">continuar</span>
                            <span className="divider-line" />
                        </div>
 
                        {role === "manager" &&<div className="register-link">
                            ¿No tienes cuenta?{' '}
                             <Link to="/signIn">Registrate aquí</Link>
                        </div>
                        }
 
                        <button className="submit-btn" type="submit" disabled={isLoading}>
                            {isLoading && <span className="spinner" />}
                            {isLoading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login