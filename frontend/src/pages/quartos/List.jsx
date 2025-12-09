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

function ListQuartos() {
    const [quartos, setQuartos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const permissao = usuario ? usuario.permissao : 0;

    useEffect(() => {
        buscarQuartos();
    }, []);

    const buscarQuartos = async () => {
        try {
            const data = await api.get('/quartos');
            const ordenados = data.sort((a, b) => a.numero - b.numero);
            setQuartos(ordenados);
        } catch (err) {
            console.log(err);
            toast.error("Erro ao carregar quartos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este quarto?")) return;

        try {
            await api.delete(`/quartos/${id}`);
            toast.success('Quarto removido com sucesso!');
            setQuartos(current => current.filter(q => q.id !== id));
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Erro ao deletar quarto.");
        }
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getBadgeVariant = (tipo) => {
        const t = tipo.toLowerCase();
        if (t.includes('suíte') || t.includes('luxo')) return 'warning';
        if (t.includes('casal')) return 'success';
        return 'primary';
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
                    <h4 className="mb-0">Acomodações</h4>
                    
                    {permissao >= 2 && (
                        <Button variant="success" size="sm" onClick={() => navigate('/quartos/novo')}>
                            + Novo Quarto
                        </Button>
                    )}
                </Card.Header>

                <Card.Body>
                    {quartos.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            Nenhum quarto cadastrado no sistema.
                        </div>
                    ) : (
                        <Table responsive hover striped className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center">Nº</th>
                                    <th>Categoria</th>
                                    <th>Preço (Diária)</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quartos.map(quarto => (
                                    <tr key={quarto.id}>
                                        <td className="text-center fw-bold fs-5">{quarto.numero}</td>
                                        
                                        <td>
                                            <Badge bg={getBadgeVariant(quarto.tipo)} className="p-2">
                                                {quarto.tipo}
                                            </Badge>
                                        </td>
                                        
                                        <td className="fw-bold text-success">
                                            {formatMoney(quarto.preco)}
                                        </td>
                                        
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => navigate(`/quartos/${quarto.id}`)}
                                                    title="Ver Detalhes"
                                                >
                                                    👁️ Ver
                                                </Button>

                                                {permissao >= 2 && (
                                                    <>
                                                        <Button 
                                                            variant="outline-warning" 
                                                            size="sm" 
                                                            onClick={() => navigate(`/quartos/editar/${quarto.id}`)}
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </Button>

                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            onClick={() => handleDelete(quarto.id)}
                                                            title="Excluir"
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </>
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

export default ListQuartos;