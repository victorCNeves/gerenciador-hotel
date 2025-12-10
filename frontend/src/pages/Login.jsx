import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import api from "../api";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); 
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const data = await api.post('/login', { login, senha });

            data.usuario.permissao = (data.usuario.tipo === 'ADMIN') ? 3 : (data.usuario.tipo === 'FUNCIONARIO') ? 2 : 1;

            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            navigate('/');
            window.location.reload(); 

        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao conectar");
            setIsProcessing(false);
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-dark text-white text-center py-3">
                            <h4 className="mb-0">Login</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Login</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="dark" type="submit" size="lg" disabled={isProcessing}>
                                        Entrar
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

export default Login;