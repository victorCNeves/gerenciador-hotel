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

function FormCliente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCpfChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ""); 

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        
        if (value.length <= 14) setCpf(value);
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, "");
        
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        
        if (value.length <= 15) setTelefone(value);
    };

    useEffect(() => {
        const fetchCliente = async () => {
            if (isEdit) {
                try {
                    const body = await api.get(`/clientes/${id}`);
                    setCpf(body.cpf);
                    setNome(body.nome);
                    setTelefone(body.telefone);
                } catch (err) {
                    console.log(err);
                    toast.error("Erro ao buscar dados: " + err.message);
                    navigate('/clientes');
                }
            }
        };
        fetchCliente();
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const clienteData = { cpf, nome, telefone };
        
        const url = isEdit ? `/clientes/${id}` : '/clientes';
        const method = isEdit ? 'put' : 'post';

        try {
            await api[method](url, clienteData);
            toast.success(isEdit ? 'Cliente atualizado!' : 'Cliente cadastrado!');
            if(usuario.permissao >=3){
                navigate("/clientes");
            }
            if(usuario.permissao === 1){
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao salvar cliente.");
            setIsProcessing(false);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-dark text-white">
                            <h4 className="mb-0">{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</h4>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                
                                <Form.Group className="mb-3" controlId="formNome">
                                    <Form.Label>Nome Completo</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={nome} 
                                        onChange={(e) => setNome(e.target.value)} 
                                        required 
                                        placeholder="Ex: Maria da Silva"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formCpf">
                                            <Form.Label>CPF</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={cpf} 
                                                onChange={handleCpfChange} 
                                                required 
                                                placeholder="000.000.000-00"
                                                maxLength="14"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formTelefone">
                                            <Form.Label>Telefone</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={telefone} 
                                                onChange={handlePhoneChange} 
                                                required 
                                                placeholder="(00) 90000-0000"
                                                maxLength="15"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-2 mt-4">
                                    <Button variant="outline-secondary" onClick={() => navigate('/clientes')} disabled={isProcessing}>
                                        Cancelar
                                    </Button>
                                    <Button variant="dark" type="submit" disabled={isProcessing} className="flex-grow-1">
                                        {isProcessing ? 'Salvando...' : (isEdit ? 'Salvar' : 'Cadastrar')}
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

export default FormCliente;