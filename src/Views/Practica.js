import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Webcam from 'react-webcam';
import CorrectoAlert from "../Components/CorrectoAlert";
import IncorrectoAlert from "../Components/IncorrectoAlert";
import api from "../api/route.js";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function Practica() {

    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const [palabra, setPalabra] = useState(null);
    const [imagen, setImagen] = useState();
    const [key, setKey] = useState(0);

    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showIncorrecto, setShowIncorrecto] = useState(false);
    const { width, height } = useWindowSize()

    const [showVideo, setShowVideo] = useState(true);

    const [error, setError] = useState("");

    const webcamRef = useRef(null);

    const controller = new AbortController();

    useEffect(() => {
        const getPalabra = async () => {
            try {
                const response = await api.get(`/random`);
                setPalabra(response.data.titulo);
                setImagen(response.data.imagen64)
            } catch (err) {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    console.log(`Error: ${err.message}`);
                }
            }
        }
        getPalabra();
    }, [key]);

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
        if (success) {
            setShowVideo(false);
            setShowIncorrecto(false);
            controller.abort();
        }
        else if (webcamRef.current) {
            const frame = webcamRef.current.getScreenshot();
            // Envía el frame al servidor Flask
            //console.log(frame);

            try {
                if (!success && palabra !== null) {
                    console.log("hola " + palabra)
                    //let palabra1 = "a"
                    const response = await api.post(`/process_frame`, { frame, palabra });
                    const data = response.data[0];
                    //console.log(response.data)
                    if (data === "Correcto") {
                        setSuccess(true);
                        setShowCorrecto(true);
                        setShowIncorrecto(false);
                        setKey(key);
                        setFailure(false);
                        let stream = webcamRef.video.srcObject;
                        const tracks = stream.getTracks();

                        tracks.forEach(track => track.stop());
                        webcamRef.video.srcObject = null;
                    }
                    else if (data !== "No hay mano detectada" && !response.data.error && !success) {
                        setFailure(true);
                        let str = "";
                        //console.log(response.data)
                        // eslint-disable-next-line
                        response.data.map((tuple) => {
                            //console.log(tuple)
                            str += tuple + "\n";
                        });
                        setError(str);
                        if (!success) { setShowIncorrecto(true); }
                    }
                }
            } catch (error) {
                console.error('Error al enviar el frame al servidor:', error);
            }

            setTimeout(() => requestAnimationFrame(captureFrame), 1000);
        }
    };

    useEffect(() => {
        setTimeout(() => captureFrame(), 1000);
    }, [success, palabra, key]);

    const handleClick = () => {
        window.location.reload();
    }

    return (
        <Container fluid key={key}>
            {success && <Confetti
                width={width}
                height={height}
            />}
            {success && <CorrectoAlert show={showCorrecto} />}
            {failure && showVideo && !success && <IncorrectoAlert error={error} show={showIncorrecto} />}
            <Row className="m-5 mb-4" key={key}>
                <Col xs={12} lg={6} style={{ height: "100%" }} className="mt-5">
                    <Row className="text-center">
                        <h2 className="fw-normal">
                            {success ? "¡EXCELENTE! Has realizado:" :
                                failure ? "Vuelve a intentar" :
                                    "Realiza la siguiente seña:"}
                        </h2>
                    </Row>
                    <Row className="p-4">
                        <img
                            src={`data:image/jpeg;base64,${imagen}`}
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
                        {showVideo && <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            mirrored={true}
                            className="p-0"
                        />}
                    </Row>
                    <Row>
                        {showVideo && <p className="m-0 mt-3">
                            <i className="fa-solid fa-lightbulb pe-2"></i>
                            <span><u>¿No recuerdas cómo se hace?</u></span>
                        </p>}
                    </Row>
                </Col>
            </Row>
            <Row className="mx-5 mb-5">
                <Col className="col-auto ms-auto">
                    <Button className={success ? "cta-button" : "non-cta-button"} onClick={handleClick}>
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