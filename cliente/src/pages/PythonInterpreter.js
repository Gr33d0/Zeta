import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import React from 'react';
import PythonTextCompiler from '../components/PythonTextCompiler';
import PythonBlockCompiler from '../components/PythonBlockCompiler';

export default function PythonInterpreter() {
    const [type, setType] = React.useState('#text');
    function handleSelect(eventKey) {
        console.log(`selected ${eventKey}`);
        setType(eventKey);
    }

    return (
        <Container>
            <Nav variant="tabs" defaultActiveKey="/home" onSelect={handleSelect}>
            <Nav.Item>
                <Nav.Link href="#text" onClick={() => handleSelect('text')}>Text</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="#blocks" onClick={() => handleSelect('blocks')}>Blocks</Nav.Link>
            </Nav.Item>
            </Nav>
            {type === '#text' && <PythonTextCompiler/>}
            {type === '#blocks' && <PythonBlockCompiler/>}
        </Container>
    )
}

    
