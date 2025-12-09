import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function FormReserva() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : {};
    const permissao = usuario.permissao || 0;

    const [dataCheckIn, setDataCheckIn] = useState('');
    const [dataCheckOut, setDataCheckOut] = useState('');
    const [quartoId, setQuartoId] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [status, setStatus] = useState('PENDENTE');

    const [listaQuartos, setListaQuartos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [valorEstimado, setValorEstimado] = useState(0);
    const [diasCalculados, setDiasCalculados] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                const quartosRes = await api.get('/quartos');
                setListaQuartos(quartosRes);

                if (permissao >= 2) {
                    const clientesRes = await api.get('/clientes');
                    setListaClientes(clientesRes);
                }

                if (isEdit) {
                    const reserva = await api.get(`/reservas/${id}`);
                    
                    setDataCheckIn(reserva.data_checkin.slice(0, 16));
                    setDataCheckOut(reserva.data_checkout.slice(0, 16));
                    setQuartoId(reserva.id_quarto); 
                    setClienteId(reserva.id_cliente);
                    setStatus(reserva.status);
                    setValorEstimado(reserva.valor_total);
                }

            } catch (err) {
                console.log(err);
                toast.error("Erro ao carregar dados.");
            }
        };
        loadDependencies();
    }, [id, isEdit, permissao]);


    useEffect(() => {
        const calcularTotal = () => {
            if (!dataCheckIn || !dataCheckOut || !quartoId) {
                setValorEstimado(0);
                setDiasCalculados(0);
                return;
            }

            const quartoSelecionado = listaQuartos.find(q => q.id == quartoId);
            if (!quartoSelecionado) return;

            const checkIn = new Date(dataCheckIn);
            const checkOut = new Date(dataCheckOut);

            if (checkOut <= checkIn) {
                setValorEstimado(0);
                return;
            }

            const msDia = 24 * 60 * 60 * 1000;
            
            const checkinDia = new Date(checkIn.getTime()).setHours(0,0,0,0);
            const checkoutDia = new Date(checkOut.getTime()).setHours(0,0,0,0);
            
            const checkoutHora = checkOut.getHours();
            const checkoutMinuto = checkOut.getMinutes();

            let dias = Math.floor((checkoutDia - checkinDia) / msDia);

            if (checkoutHora > 12 || (checkoutHora === 12 && checkoutMinuto > 0)) {
                dias = dias + 1;
            }
            
            const diasFinais = dias > 0 ? dias : 1;

            setDiasCalculados(diasFinais);
            setValorEstimado(diasFinais * parseFloat(quartoSelecionado.preco));
        };

        calcularTotal();
    }, [dataCheckIn, dataCheckOut, quartoId, listaQuartos]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const reservaData = {
            data_checkin: dataCheckIn,
            data_checkout: dataCheckOut,
            id_quarto: quartoId,
            valor_total: valorEstimado
        };

        if (permissao >= 2 && clienteId) {
            reservaData.id_cliente = clienteId;
        }
        if (isEdit && permissao >= 2) {
            reservaData.status = status;
        }

        try {
            const url = isEdit ? `/reservas/${id}` : '/reservas';
            const method = isEdit ? 'put' : 'post';

            await api[method](url, reservaData);

            toast.success(isEdit ? 'Reserva atualizada!' : 'Reserva realizada com sucesso!');
            
            navigate('/reservas');

        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao salvar reserva.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-dark text-white">
                            <h4 className="mb-0">{isEdit ? 'Alterar Reserva' : 'Nova Reserva'}</h4>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Escolha o Quarto</Form.Label>
                                            <Form.Select 
                                                value={quartoId} 
                                                onChange={e => setQuartoId(e.target.value)}
                                                required
                                            >
                                                <option value="">Selecione...</option>
                                                {listaQuartos.map(q => (
                                                    <option key={q.id} value={q.id}>
                                                        Quarto {q.numero} ({q.tipo}) - R$ {q.preco}/dia
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {permissao >= 2 && (
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="text-primary fw-bold">Cliente</Form.Label>
                                                <Form.Select 
                                                    value={clienteId} 
                                                    onChange={e => setClienteId(e.target.value)}
                                                    required={!isEdit}
                                                >
                                                    <option value="">Selecione o Cliente...</option>
                                                    {listaClientes.map(c => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.nome} (CPF: {c.cpf})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    )}

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Data Check-in</Form.Label>
                                            <Form.Control 
                                                type="datetime-local" 
                                                value={dataCheckIn} 
                                                onChange={e => setDataCheckIn(e.target.value)}
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Data Check-out</Form.Label>
                                            <Form.Control 
                                                type="datetime-local" 
                                                value={dataCheckOut} 
                                                onChange={e => setDataCheckOut(e.target.value)}
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>

                                    {isEdit && permissao >= 2 && (
                                        <Col md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label>Status da Reserva</Form.Label>
                                                <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                                                    <option value="PENDENTE">Pendente</option>
                                                    <option value="CONFIRMADA">Confirmada</option>
                                                    <option value="CONCLUIDA">Concluída</option>
                                                    <option value="CANCELADA">Cancelada</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    )}
                                </Row>

                                <Alert variant="success" className="mt-3">
                                    <Row className="align-items-center">
                                        <Col>
                                            <h6 className="mb-0">Resumo do Valor</h6>
                                            <small>Baseado em {diasCalculados} diária(s)</small>
                                        </Col>
                                        <Col className="text-end">
                                            <h3 className="mb-0 fw-bold">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorEstimado)}
                                            </h3>
                                        </Col>
                                    </Row>
                                </Alert>

                                <div className="d-flex gap-2 mt-4">
                                    <Button variant="outline-secondary" onClick={() => navigate('/reservas')} disabled={isProcessing}>
                                        Cancelar
                                    </Button>
                                    <Button variant="dark" type="submit" disabled={isProcessing || valorEstimado <= 0} className="flex-grow-1">
                                        {isProcessing ? 'Processando...' : (isEdit ? 'Salvar Alterações' : 'Confirmar Reserva')}
                                    </Button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default FormReserva;