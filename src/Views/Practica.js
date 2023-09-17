import React, { useEffect, useRef } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Webcam from 'react-webcam';
import CorrectoAlert from "../Components/CorrectoAlert";
import IncorrectoAlert from "../Components/IncorrectoAlert";

function Practica() {
    let success = false
    let failure = false

    let imagen = "https://i.ytimg.com/vi/w9wvpDHOH88/maxresdefault.jpg"
    let palabra = "a"

    let error = "Mueve el dedo índice hacia la derecha."

    const webcamRef = useRef(null);

    /* useEffect(() => {
        // Establecer la frecuencia de envío de frames
        setTimeout(captureFrame, 100); // Envía un frame cada 100 ms (10 cuadros por segundo)
    }) */

    const startVideo = async () => {
        if (webcamRef.current) {
            const videoConstraints = {
                facingMode: 'user', // Puedes ajustar esto según la cámara frontal o trasera
            };
            const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
            webcamRef.current.video.srcObject = stream;
        }
    };

    useEffect(() => {
        startVideo();
    }, []);

    const captureFrame = async () => {
        if (webcamRef.current) {
            //const frame = webcamRef.current.getScreenshot();
            // Envía el frame al servidor Flask
            //console.log(frame);

            /* try {
                await axios.post('http://localhost:5000/process_frame', { frame });
            } catch (error) {
                console.error('Error al enviar el frame al servidor:', error);
            } */


            requestAnimationFrame(captureFrame);
        }
    };

    useEffect(() => {
        requestAnimationFrame(captureFrame);
    }, []);

    return (
        <Container fluid>
            {success && <CorrectoAlert />}
            {failure && <IncorrectoAlert error={error} />}
            <Row className="m-5 mb-4">
                <Col xs={12} lg={6} style={{ height: "100%" }} className="mt-5">
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
                <Col xs={12} lg={6} style={{ height: "100%" }} className="mt-5">
                    <Row>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            mirrored={true}
                            className="p-0"
                        />
                        {/* <video
                            ref={videoRef}
                            autoPlay
                            width={"100%"}
                            height={"100%"}
                            alt="Cómo hacer la seña"
                            controls="controls"
                            type="video/mp4"
                        />
                        <canvas ref={canvasRef} width={960} height={540} style={{ display: 'none' }} /> */}
                    </Row>
                    <Row>
                        <p className="m-0 mt-3">
                            <i className="fa-solid fa-lightbulb pe-2"></i>
                            <span><u>¿No recuerdas cómo se hace?</u></span>
                        </p>
                    </Row>
                </Col>
            </Row>
            <Row className="mx-5 mb-5">
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