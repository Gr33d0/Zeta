import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PythonCompiler from '../components/PythonCompiler';

export default function PythonInterpreter() {
    return (
        <Container>
            <Row>
                <Col>
                    <PythonCompiler/>
                </Col>
            </Row>
        </Container>
    )
}

    
