import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

function ViewReserva() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : {};
    const permissao = usuario.permissao || 0;

    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const data = await api.get(`/reservas/${id}?include=true`);
                setReserva(data);
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao carregar reserva.");
                navigate('/reservas');
            } finally {
                setLoading(false);
            }
        };
        fetchReserva();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("ATENÇÃO: Deseja realmente excluir esta reserva?")) return;

        try {
            await api.delete(`/reservas/${id}`);
            toast.success('Reserva cancelada/excluída com sucesso!');
            navigate('/reservas');
        } catch (err) {
            toast.error(err.message || "Erro ao excluir.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (value) => {
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

    const getDiasEstadia = () => {
        if (!reserva) return 0;
        const diff = new Date(reserva.data_checkout) - new Date(reserva.data_checkin);
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 1;
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p>Carregando dados da reserva...</p>
            </Container>
        );
    }

    if (!reserva) return null;

    return (
        <Container className="mt-4">
            
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0 text-primary">Reserva #{reserva.id}</h4>
                        <small className="text-muted">Criada em: {formatDate(reserva.createdAt)}</small>
                    </div>
                    <div className="text-end">
                        <span className="me-2 text-muted fw-bold">Status:</span>
                        <Badge bg={getStatusBadge(reserva.status)} className="fs-6">
                            {reserva.status}
                        </Badge>
                    </div>
                </Card.Header>

                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Card className="h-100 border-light bg-light">
                                <Card.Body>
                                    <h6 className="text-uppercase text-muted small fw-bold">Datas da Estadia</h6>
                                    <div className="mb-3">
                                        <label className="fw-bold d-block">Check-in:</label>
                                        <span className="fs-5">{formatDate(reserva.data_checkin)}</span>
                                    </div>
                                    <div>
                                        <label className="fw-bold d-block">Check-out:</label>
                                        <span className="fs-5">{formatDate(reserva.data_checkout)}</span>
                                    </div>
                                    <hr />
                                    <small>Duração: <strong>{getDiasEstadia()} diária(s)</strong></small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6} className="mb-3">
                            <ListGroup variant="flush" className="h-100">
                                <ListGroup.Item>
                                    <h6 className="text-uppercase text-muted small fw-bold">Acomodação</h6>
                                    {reserva.quarto ? (
                                        <>
                                            <div className="fs-5 text-dark">Quarto {reserva.quarto.numero}</div>
                                            <span className="badge bg-info text-dark">{reserva.quarto.tipo}</span>
                                        </>
                                    ) : (
                                        <span className="text-danger">Quarto não encontrado (Excluído)</span>
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h6 className="text-uppercase text-muted small fw-bold mt-2">Titular da Reserva</h6>
                                    {reserva.cliente ? (
                                        <div>
                                            <span className="fs-5">{reserva.cliente.nome}</span>
                                            {permissao >= 2 && (
                                                <div className="small text-muted">CPF: {reserva.cliente.cpf}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-danger">Cliente não encontrado</span>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Card.Body>

                <Card.Footer className="bg-white py-3">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h5 className="text-muted mb-0">Valor Total</h5>
                            <h2 className="text-success fw-bold mb-0">
                                {formatCurrency(reserva.valor_total)}
                            </h2>
                        </Col>
                        <Col md={6} className="text-end d-flex gap-2 justify-content-end align-items-center">
                            
                            <Button variant="outline-secondary" onClick={() => navigate('/reservas')}>
                                Voltar
                            </Button>

                            <Button variant="warning" onClick={() => navigate(`/reservas/editar/${reserva.id}`)}>
                                ✏️ Editar
                            </Button>

                            {permissao >= 2 && (
                                <Button variant="outline-danger" onClick={handleDelete}>
                                    🗑️ Excluir
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

        </Container>
    );
}

export default ViewReserva;