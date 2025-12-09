import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Rodape() {
    return (
        <footer className="bg-dark text-white py-3 mt-auto">
            <Container>
                <Row className="align-items-center">
                    
                    <Col md={6} className="text-center text-md-start">
                        <p className="mb-0">
                            &copy; 2025 <strong>Sistema de Gerenciamento de Hotel</strong>.
                        </p>
                    </Col>

                    <Col md={6} className="text-center text-md-end">
                        <p className="mb-0">
                            Desenvolvido por: <strong>Victor Hugo Concolato Neves</strong>
                        </p>
                    </Col>
                    
                </Row>
            </Container>
        </footer>
    );
}

export default Rodape;