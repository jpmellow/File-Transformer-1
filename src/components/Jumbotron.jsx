import { Button, Col, Container, Row } from "react-bootstrap";

export function Jumbotron () {
    return <Row>
        <Col>
            <h1>Some text here</h1>
            <p>Lorem ipsum yada yada with the lorem ipsum's and yada yada.</p>
            <Button variant = "primary">CTA</Button>
        </Col>
    </Row>
}