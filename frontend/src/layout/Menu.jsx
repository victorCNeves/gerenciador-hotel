import { Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Menu() {
    const navigate = useNavigate();
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const permissao = usuario ? usuario.permissao : 0;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Hotel System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Quartos" id="nav-quartos">
                            <NavDropdown.Item as={Link} to="/quartos">Ver Quartos Disponíveis</NavDropdown.Item>
                            {usuario && permissao >= 2 && (
                                <>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/quartos/novo">Cadastrar Quarto</NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>

                        {usuario && permissao >= 2 && (
                            <NavDropdown title="Clientes" id="nav-clientes">
                                <NavDropdown.Item as={Link} to="/clientes">Gerenciar Clientes</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/clientes/novo">Cadastrar Novo</NavDropdown.Item>
                            </NavDropdown>
                        )}
                         
                        {usuario && permissao === 1 && (
                             <Nav.Link as={Link} to={`/clientes/${usuario.id}`}>Meus Dados</Nav.Link>
                        )}

                        {usuario && (
                            <NavDropdown title="Reservas" id="nav-reservas">
                                {permissao >= 2 ? (
                                    <NavDropdown.Item as={Link} to="/reservas">Gerenciar Reservas</NavDropdown.Item>
                                ) : (
                                    <NavDropdown.Item as={Link} to="/reservas">Minhas Reservas</NavDropdown.Item>
                                )}
                                <NavDropdown.Item as={Link} to="/reservas/novo">Nova Reserva</NavDropdown.Item>
                            </NavDropdown>
                        )}

                        {usuario && permissao === 3 && (
                            <NavDropdown title="Admin" id="nav-usuarios">
                                <NavDropdown.Item as={Link} to="/usuarios">Gerenciar Usuários</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/usuarios/novo">Novo Funcionário</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    <Nav>
                        {!usuario ? (
                            <Nav.Link as={Link} to="/login">Entrar / Cadastrar</Nav.Link>
                        ) : (
                            <NavDropdown title={`Olá, ${usuario.nome}`} id="nav-user" align="end">
                                <NavDropdown.Item as={Link} to={`/usuarios/${usuario.id}`}>Meu Perfil</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;