import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
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
    const [palabraId, setPalabraId] = useState(null);
    const [imagen, setImagen] = useState();
    const [videoLSM, setVideoLSM] = useState();
    const [dynamic, setDynamic] = useState();
    const [numSteps, setNumSteps] = useState();
    //const [key, setKey] = useState(0);

    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showIncorrecto, setShowIncorrecto] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showStartButton, setShowStartButton] = useState(true);
    const [countdownText, setCountdownText] = useState();
    const { width, height } = useWindowSize()

    const [showVideo, setShowVideo] = useState(true);

    const [error, setError] = useState("");

    const webcamRef = useRef(null);

    const controller = new AbortController();

    const handleShowHint = () => setShowHint(true);

    useEffect(() => {
        const getPalabra = async () => {
            try {
                const response = await api.get(`/random`);
                setPalabra(response.data.titulo);
                setPalabraId(response.data.señaID);
                setImagen(response.data.imagen64);
                setVideoLSM(response.data.video64);
                if (response.data.dinamico === 1) {
                    setDynamic(true);
                    setShowOverlay(true);
                    setNumSteps(response.data.pasos);
                }
                console.log(response.data.titulo);
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
    }, []);

    /* useEffect(() => {
        // Establecer la frecuencia de envío de frames
        setTimeout(captureFrame, 100); // Envía un frame cada 100 ms (10 cuadros por segundo)
    }) */

    const startVideo = async () => {
        try {
            if (webcamRef.current) {
                const videoConstraints = {
                    facingMode: 'user', // Puedes ajustar esto según la cámara frontal o trasera
                };
                const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
                webcamRef.current.video.srcObject = stream;
            }
        } catch (error) {
            alert("Revisa que no tengas algún otro dispositivo utilizando la cámara")
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log(`Error: ${error.message}`);
            }
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
                    const response = await api.post(`/process_frame`, { frame, palabra, palabraId });
                    const data = response.data[0];
                    if (data === "Correcto") {
                        setSuccess(true);
                        setShowCorrecto(true);
                        setShowIncorrecto(false);
                        //setKey(key);
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

            setTimeout(() => requestAnimationFrame(captureFrame), 700);
        }
    };

    const screenshotDynamicFrames = async (frames) => {
        for (let j = 0; j < numSteps; j++) {
            let framesI = [];
            let frame = webcamRef.current.getScreenshot();
            framesI.push(frame);
            await delay(100);
            framesI.push(frame);
            await delay(100);
            framesI.push(frame);
            frames.push(framesI);
            await delay(300);
        }

        return frames;
    }

    const delay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const captureDynamicFrame = async () => {
        if (success) {
            setShowVideo(false);
            setShowIncorrecto(false);
            controller.abort();
        }
        else if (webcamRef.current) {

            let frames = [];

            frames = await screenshotDynamicFrames(frames);

            if (frames[0] !== null && frames[1] !== null) {
                console.log(frames);
                const response = await api.post(`/process_frame_dynamic`, { frames, palabra, palabraId });
                console.log(response);
                const poseData = response.data[0];
                const handData = response.data[1];

                try {
                    let str = "";
                    // eslint-disable-next-line
                    poseData.map((moment, mId) => {
                        str += "En el momento " + mId + ": \n";
                        // eslint-disable-next-line
                        if (Array.isArray(moment)) {
                            moment.map((point) => {
                                str += point + "\n";
                            })
                        }
                        else {
                            str += moment + "\n";
                        }
                        str += "\n";
                    })

                    str += "-- POSICIÓN DE MANOS -- \n"
                    // eslint-disable-next-line
                    handData.map((moment, mId) => {
                        str += "En el momento " + mId + ": \n";
                        // eslint-disable-next-line
                        moment.map((point) => {
                            str += point + "\n";
                        })
                        str += "\n";
                    })

                    setShowIncorrecto(true);
                    setFailure(true);
                    setError(str);
                    setShowOverlay(true);
                    setShowStartButton(true);
                } catch (error) {
                    console.error('Error al enviar el frame al servidor:', error);
                }
            }

            //setTimeout(() => requestAnimationFrame(captureDynamicFrame), 3000);

            /* try {
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
                        //setKey(key);
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

            setTimeout(() => requestAnimationFrame(captureFrame), 700); */
        }
    };

    useEffect(() => {
        if (!dynamic) {
            setTimeout(() => captureFrame(), 700);
        }
        // eslint-disable-next-line
    }, [success, palabra]);

    const handleClick = () => {
        window.location.reload();
    }

    const handleStartDynamic = async () => {

        setShowIncorrecto(false);
        setShowStartButton(false);
        setCountdownText("3")
        await delay(1000);
        setCountdownText("2")
        await delay(1000);
        setCountdownText("1")
        await delay(500);
        setShowOverlay(false);
        await delay(500);

        captureDynamicFrame();
    }

    return (
        <Container fluid>
            {success && <Confetti
                width={width}
                height={height}
            />}
            {success && <CorrectoAlert show={showCorrecto} />}
            {failure && showVideo && !success && <IncorrectoAlert error={error} show={showIncorrecto} handleClose={() => setShowIncorrecto(false)} />}
            {success || <Modal centered show={showHint} onHide={() => setShowHint(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="h3">{palabra} en LSM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <video
                        src={`data:video/mp4;base64,${videoLSM}`}
                        width={"100%"}
                        height={"100%"}
                        alt="Cómo hacer la seña"
                        controls="controls"
                        type="video/mp4"
                    />
                </Modal.Body>
            </Modal>}
            <Row className="m-5 mb-4">
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
                            onClick={handleShowHint}
                        />
                    </Row>
                    <Row className="text-center">
                        <h1 onClick={handleShowHint}>{palabra}</h1>
                    </Row>
                </Col>
                <Col xs={12} lg={6} style={{ height: "100%" }} className="mt-5">
                    <Row className="d-block position-relative">
                        {showVideo && <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            mirrored={true}
                            className="p-0 position-relative"
                        />}
                        {dynamic && showOverlay &&
                            <div className="overlay-123 p-0 d-flex justify-content-center align-items-center">
                                {showStartButton && <Button className="cta-button" onClick={handleStartDynamic}>
                                    <p className="m-0" style={{ color: "var(--text-white)" }}>
                                        Empezar
                                    </p>
                                </Button>}
                                {showStartButton || <h3 className="m-0 white-text">
                                    {countdownText}
                                </h3>}
                            </div>}
                    </Row>
                    <Row>
                        {showVideo &&
                            <p className="m-0 mt-3 clickable w-auto" onClick={handleShowHint}>
                                <i className="fa-solid fa-lightbulb pe-2"></i>
                                <span><u>¿No recuerdas cómo se hace?</u></span>
                            </p>}
                    </Row>
                </Col>
            </Row>
            <Row className="mx-5 mb-5">
                <Col className="col-auto ms-auto">
                    <Button className={success ? "cta-button" : "non-cta-button"} onClick={handleClick}>
                        <p className={success ? "m-0 white-text" : "m-0 orange-text"} >
                            {success ? "Siguiente" : "Saltar"}
                        </p>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Practica;