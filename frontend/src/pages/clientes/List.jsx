import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ListClientes() {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();
    
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : {}; 

    useEffect(() => {
        const buscarClientes = async () => {
            try {
                const data = await api.get('/clientes');
                setClientes(data);
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao buscar clientes");
            }
        };

        buscarClientes();
    }, []);

    const handleDelete = async (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este cliente permanentemente?");
        
        if (!confirmacao) return;

        try {
            await api.delete(`/clientes/${id}`);
            toast.success('Cliente deletado com sucesso');
            
            setClientes(current => current.filter(c => c.id !== id));
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao deletar");
        }
    };

    return (
        <Container className="mt-4">
            <Card className="shadow border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Clientes</h4>
                    {usuario.permissao >= 2 && (
                        <Button variant="success" size="sm" onClick={() => navigate('/clientes/novo')}>
                            + Novo Cliente
                        </Button>
                    )}
                </Card.Header>

                <Card.Body>
                    {clientes.length === 0 ? (
                        <div className="text-center text-muted p-3">
                            Nenhum cliente encontrado.
                        </div>
                    ) : (
                        <Table responsive hover striped className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    {usuario.permissao > 1 && <th>ID</th>}
                                    <th>Nome</th>
                                    <th>Telefone</th>
                                    <th>CPF</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map(cliente => (
                                    <tr key={cliente.id}>
                                        {usuario.permissao > 1 && <td>{cliente.id}</td>}
                                        <td className="fw-bold">{cliente.nome}</td>
                                        <td>{cliente.telefone}</td>
                                        <td>{cliente.cpf}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                                                    title="Visualizar"
                                                >
                                                    👁️
                                                </Button>

                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </Button>

                                                {usuario.permissao > 2 && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(cliente.id)}
                                                        title="Deletar"
                                                    >
                                                        🗑️
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ListClientes;