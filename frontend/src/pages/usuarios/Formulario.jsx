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

function FormUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('CLIENTE');
    
    const [clienteId, setClienteId] = useState('');
    const [clientesDisponiveis, setClientesDisponiveis] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const todosClientes = await api.get('/clientes');
                
                const disponiveis = todosClientes.filter(c => c.id_usuario === null || (isEdit && c.id_usuario == id));
                setClientesDisponiveis(disponiveis);

                if (isEdit) {
                    const user = await api.get(`/usuarios/${id}`);
                    setNome(user.nome);
                    setLogin(user.login);
                    setTipo(user.tipo);

                    const clienteVinculado = todosClientes.find(c => c.id_usuario == id);
                    if (clienteVinculado) {
                        setClienteId(clienteVinculado.id);
                    }
                }

            } catch (err) {
                console.log(err);
                toast.error("Erro ao carregar dados.");
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const userData = { nome, login, tipo };
        
        if (!isEdit || senha) {
            userData.senha = senha;
        }

        try {
            const url = isEdit ? `/usuarios/${id}` : '/usuarios';
            const method = isEdit ? 'put' : 'post';

            const usuarioSalvo = await api[method](url, userData);
            
            const idUsuarioFinal = isEdit ? id : usuarioSalvo.id;

            if (tipo === 'CLIENTE' && clienteId) {
                const clienteOriginal = await api.get(`/clientes/${clienteId}`);

                await api.put(`/clientes/${clienteId}`, {
                    nome: clienteOriginal.nome,
                    cpf: clienteOriginal.cpf,
                    telefone: clienteOriginal.telefone,
                    id_usuario: idUsuarioFinal
                });
            }

            toast.success(isEdit ? 'Usuário atualizado!' : 'Usuário criado com sucesso!');
            navigate("/usuarios");

        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao salvar usuário.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-dark text-white">
                            <h4 className="mb-0">{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h4>
                        </Card.Header>
                        
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={nome} 
                                                onChange={e => setNome(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Login</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={login} 
                                                onChange={e => setLogin(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        {isEdit ? 'Nova Senha (Deixe vazio para manter)' : 'Senha'}
                                    </Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        value={senha} 
                                        onChange={e => setSenha(e.target.value)} 
                                        required={!isEdit}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Tipo de Acesso</Form.Label>
                                    <Form.Select 
                                        value={tipo} 
                                        onChange={e => setTipo(e.target.value)}
                                    >
                                        <option value="CLIENTE">Cliente (Hóspede)</option>
                                        <option value="FUNCIONARIO">Funcionário</option>
                                        <option value="ADMIN">Administrador</option>
                                    </Form.Select>
                                </Form.Group>

                                {tipo === 'CLIENTE' && (
                                    <Alert variant="info" className="mb-4">
                                        <h6>Vincular a um Hóspede</h6>
                                        <p className="small mb-2">
                                            Selecione o cadastro do cliente para que este login possa acessar as reservas dele.
                                        </p>
                                        
                                        <Form.Select 
                                            value={clienteId} 
                                            onChange={e => setClienteId(e.target.value)}
                                        >
                                            <option value="">-- Não vincular (Apenas Login) --</option>
                                            
                                            {clientesDisponiveis.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.nome} (CPF: {c.cpf})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Alert>
                                )}

                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/usuarios')} 
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
                                        {isProcessing ? 'Salvando...' : 'Salvar Usuário'}
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

export default FormUsuario;