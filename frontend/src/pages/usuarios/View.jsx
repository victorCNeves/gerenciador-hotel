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
import Alert from 'react-bootstrap/Alert';

function ViewUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const usuarioLogadoString = localStorage.getItem('usuario');
    const usuarioLogado = usuarioLogadoString ? JSON.parse(usuarioLogadoString) : {};
    const permissaoLogado = usuarioLogado.permissao || 0;

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await api.get(`/usuarios/${id}`);
                setUsuario(data);
            } catch (err) {
                console.log(err);
                toast.error(err.message || "Erro ao carregar usuário.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("ATENÇÃO: Tem certeza que deseja excluir este usuário? Ele perderá o acesso ao sistema.")) return;

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success('Usuário removido com sucesso!');
            navigate('/usuarios');
        } catch (err) {
            toast.error(err.message || "Erro ao deletar.");
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
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!usuario) return null;

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom-0 d-flex justify-content-between align-items-center pt-3 px-4">
                    <div className="d-flex align-items-center gap-3">
                        <h2 className="mb-0 text-primary">{usuario.nome}</h2>
                        <Badge bg={getBadgeVariant(usuario.tipo)} className="fs-6">
                            {usuario.tipo}
                        </Badge>
                    </div>
                    
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => permissaoLogado === 3 ? navigate('/usuarios') : navigate('/')}
                    >
                        Voltar
                    </Button>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                    <Row className="mb-4 mt-4">
                        <Col md={4}>
                            <h6 className="text-muted text-uppercase small">Login de Acesso</h6>
                            <p className="fs-5 font-monospace">{usuario.login}</p>
                        </Col>
                        
                        <Col md={4}>
                            <h6 className="text-muted text-uppercase small">Senha</h6>
                            <p className="fs-5 text-muted">••••••••</p>
                        </Col>

                        {permissaoLogado > 1 && (
                            <Col md={4}>
                                <h6 className="text-muted text-uppercase small">ID do Sistema</h6>
                                <p className="fs-5">#{usuario.id}</p>
                            </Col>
                        )}
                    </Row>

                    <div className="d-flex gap-2 border-top pt-3">
                        <Button 
                            variant="warning" 
                            onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
                        >
                            ✏️ Editar Dados / Trocar Senha
                        </Button>

                        {permissaoLogado === 3 && usuario.id !== usuarioLogado.id && (
                            <Button variant="danger" onClick={handleDelete}>
                                🗑️ Revogar Acesso (Excluir)
                            </Button>
                        )}
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
}

export default ViewUsuario;