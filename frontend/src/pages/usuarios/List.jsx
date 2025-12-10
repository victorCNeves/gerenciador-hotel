import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

function ListUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const buscarUsuarios = async () => {
            try {
                const data = await api.get('/usuarios');
                const ordenados = data.sort((a, b) => a.id - b.id);
                setUsuarios(ordenados);
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao carregar usuários.");
            } finally {
                setLoading(false);
            }
        };

        buscarUsuarios();
    }, []);

    const handleDelete = async (id) => {
        const confirmacao = window.confirm("ATENÇÃO: Excluir um usuário impede que ele faça login.\n\nTem certeza?");
        
        if (!confirmacao) return;

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success('Usuário removido com sucesso!');
            setUsuarios(current => current.filter(u => u.id !== id));
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao deletar usuário.");
        }
    };

    const getBadgeVariant = (tipo) => {
        switch (tipo) {
            case 'ADMIN': return 'danger';       
            case 'FUNCIONARIO': return 'primary';
            case 'CLIENTE': return 'success';    
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Gerenciar Usuários</h4>
                    <Button variant="success" size="sm" onClick={() => navigate('/usuarios/novo')}>
                        + Novo Usuário
                    </Button>
                </Card.Header>

                <Card.Body>
                    {usuarios.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            Nenhum usuário encontrado.
                        </div>
                    ) : (
                        <Table responsive hover striped className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Login (Username)</th>
                                    <th>Tipo de Acesso</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td className="fw-bold">{user.nome}</td>
                                        <td className="font-monospace">{user.login}</td>
                                        
                                        <td>
                                            <Badge bg={getBadgeVariant(user.tipo)}>
                                                {user.tipo}
                                            </Badge>
                                        </td>
                                        
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/usuarios/${user.id}`)}
                                                    title="Ver Perfil"
                                                >
                                                    👁️
                                                </Button>

                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/usuarios/editar/${user.id}`)}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </Button>

                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Excluir Acesso"
                                                >
                                                    🗑️
                                                </Button>
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

export default ListUsuarios;