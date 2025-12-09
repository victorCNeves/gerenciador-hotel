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

function ViewQuarto() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const usuarioLogado = localStorage.getItem('usuario');
    const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : null;
    const permissao = usuario ? usuario.permissao : 0; 

    const [quarto, setQuarto] = useState(null); 
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuarto = async () => {
            try {
                const includeReservas = permissao >= 2 ? '?include=true' : '';
                const data = await api.get(`/quartos/${id}${includeReservas}`);
                
                setQuarto(data);
                setReservas(data.reservas || []); 
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao carregar quarto.");
                navigate('/quartos');
            } finally {
                setLoading(false);
            }
        }
        fetchQuarto();
    }, [id, navigate, permissao]);

    const handleDelete = async () => {
        if(!window.confirm("Tem certeza que deseja deletar este quarto?")) return;

        try {
            await api.delete(`/quartos/${id}`);
            toast.success('Quarto removido com sucesso!');
            navigate('/quartos');
        } catch (err) {
            toast.error(err.message || "Erro ao deletar.");
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
        switch (status?.toUpperCase()) {
            case 'CONFIRMADA': return 'success';
            case 'PENDENTE':   return 'warning';
            case 'CANCELADA':  return 'danger';
            case 'CONCLUIDA':  return 'secondary';
            default:           return 'light';
        }
    };

    const getTipoBadge = (tipo) => {
        const t = tipo?.toLowerCase() || '';
        if (t.includes('suíte') || t.includes('luxo')) return 'warning';
        if (t.includes('casal')) return 'success';
        return 'primary';
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!quarto) return null;

    return (
        <Container className="mt-4">
            
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white border-bottom-0 d-flex justify-content-between align-items-center pt-3 px-4">
                    <div className="d-flex align-items-center gap-3">
                        <h2 className="mb-0 text-primary">Quarto {quarto.numero}</h2>
                        <Badge bg={getTipoBadge(quarto.tipo)} className="fs-6">
                            {quarto.tipo}
                        </Badge>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/quartos')}>
                        Voltar
                    </Button>
                </Card.Header>
                
                <Card.Body className="px-4 pb-4">
                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="text-muted mb-1">Preço da Diária</h5>
                            <span className="display-6 fw-bold text-success">
                                {formatMoney(quarto.preco)}
                            </span>
                        </Col>
                    </Row>

                    {permissao >= 2 && (
                        <div className="d-flex gap-2 border-top pt-3">
                            <Button variant="warning" onClick={() => navigate(`/quartos/editar/${quarto.id}`)}>
                                ✏️ Editar Quarto
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                🗑️ Deletar Quarto
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {permissao >= 2 && (
                <>
                    <h4 className="mb-3 text-secondary">Histórico de Reservas</h4>
                    
                    {reservas.length === 0 ? (
                        <Card className="text-center p-5 bg-light border-0">
                            <p className="text-muted mb-0">Nenhuma reserva registrada para este quarto.</p>
                        </Card>
                    ) : (
                        <Card className="shadow-sm border-0">
                            <Table responsive hover striped className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Status</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map((reserva) => (
                                        <tr key={reserva.id}>
                                            <td>#{reserva.id}</td>
                                            
                                            <td>
                                                {reserva.cliente ? (
                                                    <span 
                                                        style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                                                        onClick={() => navigate(`/clientes/${reserva.cliente.id}`)}
                                                    >
                                                        {reserva.cliente.nome}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">Cliente Excluído</span>
                                                )}
                                            </td>
                                            
                                            <td>{formatDate(reserva.data_checkin)}</td>
                                            <td>{formatDate(reserva.data_checkout)}</td>
                                            
                                            <td>
                                                <Badge bg={getStatusBadge(reserva.status)}>
                                                    {reserva.status}
                                                </Badge>
                                            </td>
                                            
                                            <td className="text-end">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/reservas/${reserva.id}`)}
                                                >
                                                    Visualizar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    )}
                </>
            )}
        </Container>
    );
}

export default ViewQuarto;