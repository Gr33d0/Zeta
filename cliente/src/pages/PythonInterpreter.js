// PythonInterpreter.js
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import React from "react";
import PythonTextCompiler from "../components/PythonTextCompiler";
import PythonBlockCompiler from "../components/PythonBlockCompiler";
import "../css/commandBlock.css";

export default function PythonInterpreter({
  allowedBlocks = [],         // ["print","var","if","while"]
  defaultMode = "block",      // "block" | "text"
  onAfterRun = () => {}       // (mode, { code, result })
}) {
  return (
    <Container>
      <Row>
        <Col>
          <Tabs defaultActiveKey={defaultMode} id="python-mode-tabs" className="mb-3" fill>
            <Tab eventKey="text" title="Texto">
              <PythonTextCompiler
                onAfterRun={(code, result) => onAfterRun("text", { code, result })}
              />
            </Tab>
            <Tab eventKey="block" title="Blocos">
              <PythonBlockCompiler
                allowedBlocks={allowedBlocks}
                onAfterRun={(code, result) => onAfterRun("block", { code, result })}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
