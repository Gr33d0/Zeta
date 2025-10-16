import {Container,Row,Col,Tabs,Tab} from "react-bootstrap";

import PythonTextCompiler from "../../components/PythonTextCompiler.tsx";
import PythonBlockCompiler from "../../components/PythonBlockCompiler.tsx";
import Hint from '../../components/Hint.tsx';
import "../../css/Interpreter.css";

interface PythonInterpreterProps {
  id: number;
  level: number;
  expectedResult: string;
  allowedVar: boolean;
  allowedCondition: boolean;
  allowedLoops: boolean;
  message: string;
}



export default function PythonInterpreter({id,level,expectedResult,allowedVar,allowedCondition,allowedLoops,message}: PythonInterpreterProps) {
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
