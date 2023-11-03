import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import Webcam from 'react-webcam';
import CorrectoAlert from "../Components/CorrectoAlert";
import IncorrectoAlert from "../Components/IncorrectoAlert";
import api from "../api/route.js";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import overlay from '../Multimedia/overlay5.png'

function Practica() {

    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const [palabra, setPalabra] = useState(null);
    const [palabraId, setPalabraId] = useState(null);
    const [imagen, setImagen] = useState();
    const [videoLSM, setVideoLSM] = useState();
    const [dynamic, setDynamic] = useState(false);
    const [numSteps, setNumSteps] = useState();
    const [numCambios, setNumCambios] = useState();
    const [cambios, setCambios] = useState(false);
    const [cambiosMano, setCambiosMano] = useState(false);
    const [currentHandPositionIndex, setCurrentHandPositionIndex] = useState(0);

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
                console.log(response.data)
                if (response.data.dinamico === 1) {
                    setDynamic(true);
                    setShowOverlay(true);
                    setNumSteps(response.data.pasos);
                    setNumCambios(response.data.cambios);
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
                    console.log("hola " + palabra + "capture frame")
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

            setTimeout(() => requestAnimationFrame(captureFrame), 1400);
        }
    };

    const screenshotDynamicFrames = async (frames) => {
        /* for (let j = 0; j < numSteps; j++) {
            let framesI = [];
            let frame = webcamRef.current.getScreenshot();
            framesI.push(frame);
            await delay(100);
            framesI.push(frame);
            await delay(100);
            framesI.push(frame);
            frames.push(framesI);
            await delay(300);
        } */

        let frame = webcamRef.current.getScreenshot();

        // se multiplica por 10 porque al tener un delay de 50ms, se están mandando 20fps dentro de un tiempo de medio segundo por paso/momento
        for (let j = 0; j < numSteps * 10; j++) {
            frames.push(frame);
            await delay(50);
        }

        return frames;
    }

    const delay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const captureDynamicFrame = async () => {
        if (webcamRef.current) {

            let frames = [];

            frames = await screenshotDynamicFrames(frames);

            if (frames[0] !== null && frames[1] !== null) {
                //console.log(frames);
                const response = await api.post(`/process_frame_dynamic`, { frames, palabra, palabraId, numSteps });
                console.log(response);
                const poseData = response.data;
                //const handData = response.data[1];

                try {
                    let str = "";
                    let strInicio = ""
                    let strMedio = ""
                    let strFinal = ""
                    // eslint-disable-next-line
                    poseData.map((moment, mId) => {
                        if (Array.isArray(moment)) {
                            for (let i = 0; i < moment.length; i++) {
                                let point = moment[i];
                                let keypoint = point[0];
                                let direction = point[1];

                                if (keypoint === 15 || keypoint === 17 || keypoint === 19 || keypoint === 21) {

                                    if (mId === 0) {
                                        if (strInicio === "") {
                                            if (!strInicio.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strInicio += "Mueve el brazo para " + point[1];
                                                } else {
                                                    strInicio += "Mueve el brazo para la " + point[1];
                                                }
                                            }
                                        } else {
                                            if (!strInicio.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strInicio += " y " + point[1];
                                                } else {
                                                    strInicio += " y la " + point[1];
                                                }
                                            }
                                        }
                                    } else if (mId === (poseData.length - 1)) {
                                        if (strFinal === "") {
                                            if (!strFinal.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strFinal += "Mueve el brazo para " + point[1];
                                                } else {
                                                    strFinal += "Mueve el brazo para la " + point[1];
                                                }
                                            }
                                        } else {
                                            if (!strFinal.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strFinal += " y " + point[1];
                                                } else {
                                                    strFinal += " y la " + point[1];
                                                }
                                            }
                                        }
                                    } else {
                                        if (strMedio === "") {
                                            if (!strMedio.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strMedio += "Mueve el brazo para " + point[1];
                                                } else {
                                                    strMedio += "Mueve el brazo para la " + point[1];
                                                }
                                            }
                                        } else {
                                            if (!strMedio.includes(direction)) {
                                                if (direction === "Abajo" || "Arriba") {
                                                    strMedio += " y " + point[1];
                                                } else {
                                                    strMedio += " y la " + point[1];
                                                }
                                            }
                                        }
                                    }


                                }
                            }
                        }
                    })

                    if (strInicio !== "") {
                        strInicio += "\n"
                    }
                    if (strMedio !== "") {
                        strMedio += "\n"
                    }
                    if (strFinal !== "") {
                        strFinal += "\n"
                    }

                    // eslint-disable-next-line
                    // handData.map((moment, mId) => {
                    //     for (let i = 0; i < moment.length; i++) {
                    //         let point = moment[i];

                    //         if (mId === 0) {
                    //             if (point !== "Correcto") {
                    //                 strInicio += point + "\n";
                    //             }
                    //         } else if (mId === (poseData.length - 1)) {
                    //             if (point !== "Correcto") {
                    //                 strFinal += point + "\n";
                    //             }
                    //         } else {
                    //             if (point !== "Correcto") {
                    //                 strMedio += point + "\n";
                    //             }
                    //         }
                    //     }
                    // })

                    if (strInicio !== "") {
                        str += "Al inicio:\n" + strInicio;
                    }
                    if (strInicio !== "" && strMedio !== "") {
                        str += "\n";
                    }
                    if (strMedio !== "") {
                        str += "Al medio:\n" + strMedio;
                    }
                    if ((strMedio !== "" && strFinal !== "") || (strInicio !== "" && strFinal !== "")) {
                        str += "\n";
                    }
                    if (strFinal !== "") {
                        str += "Al final:\n" + strFinal;
                    }

                    if (str === "") {
                        setShowCorrecto(true);
                        setSuccess(true);
                        setShowVideo(false);
                        setShowIncorrecto(false);
                        controller.abort();
                    } else {
                        setShowIncorrecto(true);
                        setFailure(true);
                        setError(str);
                        setShowOverlay(true);
                        setShowStartButton(true);
                    }
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

    let index = currentHandPositionIndex + 1;

    const isHandPositionCorrect = async () => {
        //console.log("HOLAAA")
        if (webcamRef.current) {
            const frame = webcamRef.current.getScreenshot();

            try {
                if (!success && palabra !== null) {
                    //console.log("hola " + palabra)
                    //let palabra1 = "a"
                    //console.log(currentIndex, "CURRENT INDEX")
                    //console.log(currentHandPositionIndex)
                    //console.log(index)
                    //const response = await api.post(`/process_frame_dynamic_hand`, { frame, palabra, index });
                    const response = await api.post(`/process_frame_dynamic_hand`, { frame, palabra, palabraId, index });
                    //console.log(response);
                    const data = response.data[0];
                    if (data === "Correcto") {
                        console.log("ESTE ES EL INDEX EN CORRECTO " + index);
                        setSuccess(true);
                        setShowCorrecto(true);
                        setShowIncorrecto(false);
                        setCurrentHandPositionIndex(index);
                        console.log(currentHandPositionIndex)
                        setShowOverlay(true);
                        setShowStartButton(true);
                        setCambios(false);
                        setFailure(false);
                        setShowVideo(false);
                        return
                    }
                    else if (data !== "No hay mano detectada" && !response.data.error && !success) {
                        setFailure(true);
                        setSuccess(false);
                        let str = "";
                        // eslint-disable-next-line
                        response.data.map((tuple) => {
                            str += tuple + "\n";
                        });
                        setError(str);
                        if (!success) { setShowIncorrecto(true); }
                    }
                }
            } catch (error) {
                console.error('Error al enviar el frame al servidor:', error);
            }

            setTimeout(() => isHandPositionCorrect(captureFrame), 1400);

        }
        return false;
    };

    useEffect(() => {
        console.log(currentHandPositionIndex + " Numcambios use effect");
        //let currentIndex = currentHandPositionIndex
        if (dynamic === false) {
            console.log(dynamic + "dynamic capture frame");
            setTimeout(() => captureFrame(), 1400);
        } else if (dynamic) {
            if (currentHandPositionIndex < numCambios && cambios) {
                isHandPositionCorrect()
            } else if (currentHandPositionIndex >= numCambios) {
                setShowOverlay(true);
                setCambios(false);
                setCambiosMano(true);
            }
        }//eslint-disable-next-line
    }, [success, palabra, dynamic, currentHandPositionIndex, cambios]);


    const handleClick = () => {
        window.location.reload();
    }

    const handleStartDynamic = async () => {
        console.log(cambiosMano);
        setShowVideo(true);
        setShowIncorrecto(false);
        setShowStartButton(false);
        setSuccess(false);
        setShowCorrecto(false);
        if (!cambiosMano) {
            console.log("??????")
            setCambios(true)
            setShowOverlay(false);
            isHandPositionCorrect();
        } else {
            console.log("hola?")
            setShowIncorrecto(false);
            setShowStartButton(false);
            setShowVideo(true);
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
    }

    return (
        <Container fluid>
            {success && <Confetti
                width={width}
                height={height}
            />}
            {success && <CorrectoAlert show={showCorrecto} />}
            {failure && showVideo && !success && <IncorrectoAlert error={error} show={showIncorrecto} handleClose={() => setShowIncorrecto(false)} />}
            {success || <Modal centered size="lg" show={showHint} onHide={() => setShowHint(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="h3">{palabra} en LSM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {dynamic ? <video
                        src={`data:video/mp4;base64,${videoLSM}`}
                        width={"100%"}
                        height={"100%"}
                        alt="Cómo hacer la seña"
                        controls="controls"
                        type="video/mp4"
                    /> : <img
                        src={`data:image/jpeg;base64,${videoLSM}`}
                        width={"100%"}
                        style={{ height: "30vw" }}
                        alt={"Foto de cómo se hace la seña"}
                        className="cover" />}

                </Modal.Body>
            </Modal>}
            <Row className="m-5 mb-4">
                <Col xs={12} lg={6} style={{ height: "100%" }} className="mt-5">
                    <Row className="text-center">
                        <h2 className="fw-normal">
                            {dynamic && currentHandPositionIndex === 0 ? `Realiza el paso: ${currentHandPositionIndex + 1}` :
                                cambios && dynamic ? `Realiza el paso: ${currentHandPositionIndex + 1}` :
                                    dynamic && currentHandPositionIndex < numCambios ? `Realiza el paso: ${currentHandPositionIndex + 1}` :
                                        !cambios && dynamic && failure ? "Vuelve a intentar" :
                                            cambios && dynamic && success ? "¡EXCELENTE! Has realizado:" :
                                                !cambios && dynamic ? 'Realiza el movimiento completo' :
                                                    success ? "¡EXCELENTE! Has realizado:" :
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
                            <div className={`${showVideo && "div-overlay"} p-0 d-flex justify-content-center align-items-center mh-45`}>
                                {showVideo && <img
                                    src={overlay}
                                    className="position-absolute overlay-man-img"
                                    alt="Correct position inside frame"
                                />}
                                {showStartButton && <Button className="cta-button" onClick={handleStartDynamic}>
                                    <p className="m-0" style={{ color: "var(--text-white)" }}>
                                        Empezar
                                    </p>
                                </Button>}
                                {showStartButton || <h3 className="h1 m-0 white-text">
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
                    <Button className={dynamic && !cambios && success ? "cta-button" :
                        !dynamic && success ? "cta-button" : "non-cta-button"} onClick={handleClick}>
                        <p className={dynamic && !cambios && success ? "m-0 white-text" :
                            !dynamic && success ? "m-0 white-text" : "m-0 orange-text"} >
                            {dynamic && !cambios && success ? "Siguiente" :
                                !dynamic && success ? "Siguiente" : "Saltar"}
                        </p>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Practica;