import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import video from '../Multimedia/video.mp4';
import CorrectoAlert from "../Components/CorrectoAlert";
import IncorrectoAlert from "../Components/IncorrectoAlert";

function Practica() {
    let success = false
    let failure = false

    let imagen = "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    let palabra = "a"

    let error = "Mueve el dedo índice hacia la derecha."

    return (
        <Container fluid>
            {success && <CorrectoAlert />}
            {failure && <IncorrectoAlert error={error} />}
            <Row className="m-5 mb-4">
                <Col xs={12} lg={5} style={{ height: "100%" }} className="mt-5">
                    <Row className="text-center">
                        <h2 className="fw-normal">
                            {failure ? "Vuelve a intentar" :
                                success ? "¡EXCELENTE! Has realizado:" :
                                    "Realiza la siguiente seña:"}
                        </h2>
                    </Row>
                    <Row className="p-4">
                        <img
                            src={imagen}
                            alt="Imagen de la seña a realizar"
                            style={{ width: "auto" }}
                        />
                    </Row>
                    <Row className="text-center">
                        <h1>{palabra}</h1>
                    </Row>
                </Col>
                <Col xs={12} lg={7} style={{ height: "100%" }} className="mt-5">
                    <Row>
                        <video
                            src={video}
                            width={"100%"}
                            height={"100%"}
                            alt="Cómo hacer la seña"
                            controls="controls"
                            type="video/mp4"
                        />
                    </Row>
                    <Row>
                        <p className="m-0 mt-3">
                            <i class="fa-solid fa-lightbulb pe-2"></i>
                            <span><u>¿No recuerdas cómo se hace?</u></span>
                        </p>
                    </Row>
                </Col>
            </Row>
            <Row className="mx-5">
                <Col className="col-auto ms-auto">
                    <Button className={success ? "cta-button" : "non-cta-button"}>
                        <p className="m-0" style={{ color: "var(--text-white)" }}>
                            {success ? "Siguiente" : "Saltar"}
                        </p>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Practica;