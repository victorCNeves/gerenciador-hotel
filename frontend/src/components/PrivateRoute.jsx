import { Navigate, Outlet } from 'react-router-dom';
import { toast } from "react-toastify";

function PrivateRoute({nivel=1}){
    const token = localStorage.getItem('token');
    let usuario = localStorage.getItem('usuario');
    usuario = usuario ? JSON.parse(usuario) : null; 

    if(!token || !usuario){
        return <Navigate to="/login" />;
    }

    if(usuario.permissao<nivel){
        toast.error("Você não tem permissão para acessar a página.");
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}

export default PrivateRoute;