import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

function ViewCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const usuarioLogado = localStorage.getItem('usuario');
    const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : {}; 
    
    const [cliente, setCliente] = useState(null); 
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await api.get(`/clientes/${id}?include=true`);
                setCliente(data);
                setReservas(data.reservas || []); 
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao carregar dados.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        }
        fetchCliente();
    }, [id, navigate]);

    const handleDelete = async () => {
        if(!window.confirm("Tem certeza que deseja deletar este cliente permanentemente?")) return;

        try {
            await api.delete(`/clientes/${id}`);
            toast.success('Cliente deletado com sucesso');
            navigate('/clientes');
        } catch (err) {
            toast.error(err.message || "Erro ao deletar.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // --- LÓGICA DAS BADGES (CORES) ---
    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMADA': return 'success';  
            case 'PENDENTE':   return 'warning';  
            case 'CANCELADA':  return 'danger';   
            case 'CONCLUIDA':  return 'secondary';
            default:           return 'light';    
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Carregando detalhes...</p>
            </Container>
        );
    }

    if (!cliente) return null;

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white border-bottom-0 d-flex justify-content-between align-items-center pt-3 px-4">
                    <h2 className="mb-0 text-primary">{cliente.nome}</h2>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/clientes')}>
                        Voltar
                    </Button>
                </Card.Header>
                
                <Card.Body className="px-4 pb-4">
                    <Row className="mb-3">
                        {usuario && usuario.permissao > 1 && (
                            <Col md={2}>
                                <small className="text-muted d-block">ID</small>
                                <strong>#{cliente.id}</strong>
                            </Col>
                        )}
                        <Col md={3}>
                            <small className="text-muted d-block">CPF</small>
                            <span className="fs-5">{cliente.cpf}</span>
                        </Col>
                        <Col md={3}>
                            <small className="text-muted d-block">Telefone</small>
                            <span className="fs-5">{cliente.telefone}</span>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2 border-top pt-3">
                        <Button variant="warning" onClick={() => navigate(`/clientes/editar/${cliente.id}`)}>
                            ✏️ Editar
                        </Button>
                        {usuario && usuario.permissao > 2 && (
                            <Button variant="danger" onClick={handleDelete}>
                                🗑️ Deletar
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            <h4 className="mb-3 text-secondary">Histórico de Reservas</h4>
            
            {reservas.length === 0 ? (
                <Card className="text-center p-5 bg-light border-0">
                    <p className="text-muted mb-0">Este cliente ainda não possui reservas.</p>
                </Card>
            ) : (
                <Card className="shadow-sm border-0">
                    <Table responsive hover striped className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                {usuario && usuario.permissao > 1 && <th>ID</th>}
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th className="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    {usuario && usuario.permissao > 1 && <td>#{reserva.id}</td>}
                                    
                                    <td>{formatDate(reserva.data_checkin)}</td>
                                    <td>{formatDate(reserva.data_checkout)}</td>
                                    
                                    <td className="fw-bold text-dark">
                                        {formatCurrency(reserva.valor_total)}
                                    </td>
                                    
                                    <td>
                                        <Badge bg={getStatusBadge(reserva.status)} className="p-2">
                                            {reserva.status}
                                        </Badge>
                                    </td>
                                    
                                    <td className="text-end">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            onClick={() => navigate(`/reservas/editar/${reserva.id}`)}
                                        >
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}
        </Container>
    );
}

export default ViewCliente;