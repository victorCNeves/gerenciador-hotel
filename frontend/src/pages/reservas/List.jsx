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

function ListReservas() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : {};
    const permissao = usuario.permissao || 0;

    useEffect(() => {
        buscarReservas();
    }, []);

    const buscarReservas = async () => {
        try {
            const data = await api.get('/reservas?include=true');
            
            const ordenados = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            setReservas(ordenados);
        } catch (err) {
            console.log(err);
            toast.error("Erro ao carregar reservas.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ATENÇÃO: Deseja realmente excluir esta reserva do sistema?")) return;

        try {
            await api.delete(`/reservas/${id}`);
            toast.success('Reserva removida com sucesso!');
            setReservas(current => current.filter(r => r.id !== id));
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao deletar reserva.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMADA': return 'success';
            case 'PENDENTE': return 'warning';
            case 'CANCELADA': return 'danger';
            case 'CONCLUIDA': return 'secondary';
            default: return 'light';
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
                    <h4 className="mb-0">
                        {permissao >= 2 ? 'Gerenciar Reservas' : 'Minhas Reservas'}
                    </h4>
                    
                    <Button variant="success" size="sm" onClick={() => navigate('/reservas/novo')}>
                        + Nova Reserva
                    </Button>
                </Card.Header>

                <Card.Body>
                    {reservas.length === 0 ? (
                        <div className="text-center text-muted p-5">
                            <h4>Nenhuma reserva encontrada.</h4>
                            <p>Que tal fazer uma nova reserva agora?</p>
                            <Button variant="primary" onClick={() => navigate('/quartos')}>
                                Ver Quartos Disponíveis
                            </Button>
                        </div>
                    ) : (
                        <Table responsive hover striped className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    {permissao >= 2 && <th>#</th>}
                                    
                                    {permissao >= 2 && <th>Cliente</th>}
                                    
                                    <th>Quarto</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map(reserva => (
                                    <tr key={reserva.id}>
                                        {permissao >= 2 && <td>{reserva.id}</td>}

                                        {permissao >= 2 && (
                                            <td className="fw-bold">
                                                {reserva.cliente ? reserva.cliente.nome : <span className="text-muted small">N/A</span>}
                                            </td>
                                        )}

                                        <td>
                                            {reserva.quarto ? (
                                                <>
                                                    <strong>Nº {reserva.quarto.numero}</strong> <br/>
                                                    <small className="text-muted">{reserva.quarto.tipo}</small>
                                                </>
                                            ) : (
                                                <span className="text-muted">Quarto Excluído</span>
                                            )}
                                        </td>

                                        <td>{formatDate(reserva.data_checkin)}</td>
                                        <td>{formatDate(reserva.data_checkout)}</td>
                                        
                                        <td className="text-success fw-bold">
                                            {formatMoney(reserva.valor_total)}
                                        </td>

                                        <td>
                                            <Badge bg={getStatusBadge(reserva.status)}>
                                                {reserva.status}
                                            </Badge>
                                        </td>

                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/reservas/${reserva.id}`)}
                                                    title="Detalhes"
                                                >
                                                    👁️
                                                </Button>

                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/reservas/editar/${reserva.id}`)}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </Button>

                                                {permissao >= 2 && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(reserva.id)}
                                                        title="Excluir"
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

export default ListReservas;