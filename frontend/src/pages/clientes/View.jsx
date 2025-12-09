import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

function ViewCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const usuarioLogado = localStorage.getItem('usuario');
    const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : {}; 
    const token = localStorage.getItem('token');
    const [cliente, setCliente] = useState(null); 
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await api.get(`/clientes/${id}`);
                setReservas(data.reservas || []); 
                setCliente(data); 

            } catch (err) {
                console.log(err);
                toast.error(err.message);
                navigate('/clientes');
            }
        }
        fetchCliente();
    }, [id, token, navigate]);

    const handleDelete = async () => {
        if(!window.confirm("Tem certeza que deseja deletar este cliente?")) return;

        try {
            await api.delete(`/clientes/${id}`);
            toast.success('Cliente deletado');
            navigate('/clientes');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!cliente) return <p>Carregando...</p>;

    return (
        <>
            <div>
                <h1>{cliente.nome}</h1>
                {usuario && usuario.permissao > 1 && <p>ID: {cliente.id}</p>}
                
                <p>CPF: {cliente.cpf}</p>
                <p>Telefone: {cliente.telefone}</p>
                <button onClick={() => navigate(`/clientes/editar/${cliente.id}`)}>Editar</button>
                {usuario && usuario.permissao > 2 && (
                     <button onClick={handleDelete}>Deletar</button>
                )}

                <h3>Reservas:</h3>
                {reservas.length === 0 ? (
                    <p>Nenhuma reserva encontrada.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                {usuario && usuario.permissao > 1 && <th>ID</th>}
                                <th>Data Check In</th>
                                <th>Data Check Out</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    {usuario && usuario.permissao > 1 && <td>{reserva.id}</td>}
                                    <td>{reserva.dataCheckIn}</td>
                                    <td>{reserva.dataCheckOut}</td>
                                    <td>{reserva.valorTotal}</td>
                                    <td>{reserva.status}</td>
                                    <td>
                                        <button onClick={() => navigate(`/reservas/editar/${reserva.id}`)}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default ViewCliente;