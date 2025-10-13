import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import PythonTextCompiler from "../../components/PythonTextCompiler";
import PythonBlockCompiler from "../../components/PythonBlockCompiler";
import Hint from '../../components/Hint';
import "../../css/Interpreter.css";


export default function PythonInterpreter({id,level,expectedResult,allowedVar,allowedCondition,allowedLoops,message}) {
  return (
    <Container className="py-3 interpreter-container">
      <Row>
        <Col>
          <Tabs defaultActiveKey="block" id="python-mode-tabs" className="mb-3" fill>
            <Tab eventKey="text" title="Texto">
              <PythonTextCompiler level={level} expectedResult={expectedResult} id={id}/>
            </Tab>
            <Tab eventKey="block" title="Blocos">
              <PythonBlockCompiler level={level} allowedVar={allowedVar} allowedCondition={allowedCondition} allowedLoops={allowedLoops} id={id} expectedResult={expectedResult}/>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col className="d-flex justify-content-center">
          <Hint message={message} />
        </Col>
      </Row>
    </Container>
  );
}
