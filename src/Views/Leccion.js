import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PalabraCard from "../Components/PalabraCard";
import video from '../Multimedia/video.mp4';

function Leccion() {

    const { state } = useLocation();
    const { nombre } = state;

    let imagen = "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    let palabra = "a"
    let definicion = "La primera letra del abecedario"

    let palabras = [{
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    }, {
        palabra: "a",
        imagen: "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    },]

    return (
        <Container fluid>
            <Row className="m-5 mb-0">
                <Col xs={12}>
                    <h1>
                        <i class="fa-solid fa-bars pe-4"></i>
                        <span>{nombre}</span>
                    </h1>
                </Col>
            </Row>
            <Row className="mx-5 align-items-center">
                <Col xs={12} lg={7} className="mt-4" style={{ height: "100%" }}>
                    <video
                        src={video}
                        width={"100%"}
                        height={"100%"}
                        alt="Cómo hacer la seña"
                        controls="controls"
                        type="video/mp4"
                    />
                </Col>
                <Col xs={12} lg={5} className="mt-4" style={{ height: "100%" }}>
                    <PalabraCard imagen={imagen} palabra={palabra} definicion={definicion} />
                </Col>
            </Row>
            <Row className="m-5">
                <Col>
                    <Button className="non-cta-button">
                        <p className="m-0" style={{ color: "var(--text-white)" }}>
                            Previo
                        </p>
                    </Button>
                </Col>
                <Col className="col-auto ms-auto">
                    <Button className="cta-button">
                        <p className="m-0" style={{ color: "var(--text-white)" }}>
                            Siguiente
                        </p>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Leccion;