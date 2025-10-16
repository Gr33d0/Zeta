import {Container,Row,Col,Tabs,Tab} from "react-bootstrap";

import PythonTextCompiler from "../components/PythonTextCompiler.tsx";
import PythonBlockCompiler from "../components/PythonBlockCompiler.tsx";
import "../css/Interpreter.css";

export default function PythonInterpreter() {
  return (
    <Container className=" interpreter-container py-3">
      <Row>
        <Col>
          <Tabs defaultActiveKey="block" id="python-mode-tabs" className="mb-3" fill>
            <Tab eventKey="text" title="Texto">
              <PythonTextCompiler level={0} expectedResult={""} id={0} />
            </Tab>
            <Tab eventKey="block" title="Blocos">
              <PythonBlockCompiler  allowedVar={true} allowedCondition={true} allowedLoops={true} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
