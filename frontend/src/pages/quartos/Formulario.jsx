import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api";

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function FormQuarto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [numero, setNumero] = useState('');
    const [tipo, setTipo] = useState('Standard');
    const [preco, setPreco] = useState('');
    
    const [isProcessing, setIsProcessing] = useState(false);

    const tiposDeQuarto = [
        "Standard Solteiro",
        "Standard Casal",
        "Duplo Solteiro",
        "Suíte Executiva",
        "Suíte Presidencial",
        "Luxo"
    ];

    useEffect(() => {
        const fetchQuarto = async () => {
            if (isEdit) {
                try {
                    const data = await api.get(`/quartos/${id}`);
                    setNumero(data.numero);
                    setTipo(data.tipo);
                    setPreco(data.preco);
                } catch (err) {
                    console.log(err);
                    toast.error("Erro ao carregar dados: " + err.message);
                    navigate('/quartos');
                }
            }
        };
        fetchQuarto();
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const quartoData = { 
            numero: parseInt(numero), 
            tipo, 
            preco: parseFloat(preco) 
        };

        const url = isEdit ? `/quartos/${id}` : '/quartos';
        const method = isEdit ? 'put' : 'post';

        try {
            await api[method](url, quartoData);

            toast.success(isEdit ? 'Quarto atualizado!' : 'Quarto cadastrado!');
            navigate("/quartos");

        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao salvar quarto.");
            setIsProcessing(false);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-dark text-white">
                            <h4 className="mb-0">{isEdit ? 'Editar Quarto' : 'Novo Quarto'}</h4>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="formNumero">
                                            <Form.Label>Número do Quarto</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                value={numero} 
                                                onChange={(e) => setNumero(e.target.value)} 
                                                required 
                                                min="1"
                                                placeholder="Ex: 101"
                                                disabled={isEdit} 
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={8}>
                                        <Form.Group className="mb-3" controlId="formTipo">
                                            <Form.Label>Categoria</Form.Label>
                                            <Form.Select 
                                                value={tipo} 
                                                onChange={(e) => setTipo(e.target.value)}
                                            >
                                                {!tiposDeQuarto.includes(tipo) && <option value={tipo}>{tipo}</option>}
                                                
                                                {tiposDeQuarto.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="formPreco">
                                    <Form.Label>Diária (Preço)</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>R$</InputGroup.Text>
                                        <Form.Control 
                                            type="number" 
                                            value={preco} 
                                            onChange={(e) => setPreco(e.target.value)} 
                                            required 
                                            min="0"
                                            step="0.01"
                                            placeholder="0,00"
                                        />
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Use ponto ou vírgula para centavos.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex gap-2 mt-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/quartos')} 
                                        disabled={isProcessing}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="dark" 
                                        type="submit" 
                                        disabled={isProcessing} 
                                        className="flex-grow-1"
                                    >
                                        {isProcessing ? 'Salvando...' : (isEdit ? 'Salvar Quarto' : 'Cadastrar Quarto')}
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

export default FormQuarto;