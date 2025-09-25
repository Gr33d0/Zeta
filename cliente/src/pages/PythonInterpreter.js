import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import PythonTextCompiler from "../components/PythonTextCompiler";
import PythonBlockCompiler from "../components/PythonBlockCompiler";

export default function PythonInterpreter() {
  return (
    <Container className="py-3">
      <Row>
        <Col>
          <Tabs defaultActiveKey="block" id="python-mode-tabs" className="mb-3" fill>
            <Tab eventKey="text" title="Texto">
              <PythonTextCompiler />
            </Tab>
            <Tab eventKey="block" title="Blocos">
              <PythonBlockCompiler />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
