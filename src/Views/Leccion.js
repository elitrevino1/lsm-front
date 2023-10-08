import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PalabraCard from "../Components/PalabraCard";
import api from "../api/route.js";

function Leccion() {

    const { state } = useLocation();
    const { nombre } = state;
    const { id } = state;
    const [idPalabra, setIdPalabra] = useState(state.num);
    const [imagen, setImagen] = useState();
    const [palabra, setPalabra] = useState();
    const [definicion, setDefinicion] = useState();
    const [video, setVideo] = useState();
    const [palabras, setPalabras] = useState([]);
    const [showMenu, setShowMenu] = useState(false)
    const [initialId, setInitialId] = useState(-1);

    useEffect(() => {
        const getPalabra = async () => {
            try {
                const response = await api.get(`/lecciones/${id}/${idPalabra}`);
                setImagen(response.data.imagen64);
                setPalabra(response.data.titulo);
                console.log(idPalabra)
                setDefinicion(response.data.definicion);
                setVideo(response.data.video64);
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
    }, [id, idPalabra]);

    useEffect(() => {
        const getPalabras = async () => {
            try {
                const response = await api.get(`/${id}`);
                let arr = [];
                // eslint-disable-next-line
                response.data.map((tuple) => {
                    let newElement = {
                        id: tuple.leccionID,
                        nombre: tuple.titulo,
                        imagen: tuple.imagen64,
                    }
                    arr.push(newElement);
                }
                );
                setPalabras(arr);
                console.log(arr)
                if (initialId === -1) {
                    setInitialId(arr[0].id);
                }
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

        getPalabras();
    }, [initialId, id]);

    return (
        <Container fluid key={idPalabra}>
            <Row className="m-5 mb-0">
                <Col xs={12}>
                    <h1>
                        <i className={showMenu ? "fa-solid fa-xmark pe-4" : "fa-solid fa-bars pe-4"} onClick={() => { setShowMenu(!showMenu) }}></i>
                        <span>{nombre}</span>
                    </h1>
                </Col>
            </Row>
            {showMenu && <Row className="ms-5">
                <Col xs={9} lg={3} className="d-block position-relative">
                    <div className="leccion-menu shadow-lg">
                        {palabras.map((pal) =>
                            <div className={pal.id === (idPalabra + initialId - 1) ? "p-4 border palabra-selected"
                                : pal.id - (idPalabra + initialId - 1) === -1 ? "mx-4 py-4"
                                    : "mx-4 py-4 border-bottom"} key={pal.id}
                                onClick={() => {
                                    let newId = pal.id - initialId + 1
                                    console.log("n " + pal.id + " " + initialId + " " + newId)
                                    setIdPalabra(idPalabra => newId);
                                    setShowMenu(false);
                                }}>
                                <img className="me-3 cover" height={40} width={60} src={`data:image/jpeg;base64,${pal.imagen}`} alt={pal.nombre} />
                                <span className={pal.id === (idPalabra + initialId - 1) ? "p p-0 m-0 secondary-color fw-bold" : "p p-0 m-0"}>{pal.nombre}</span>
                            </div>)}
                    </div>
                </Col>
            </Row>}
            <Row className="mx-5 align-items-center" key={idPalabra}>
                <Col xs={12} lg={7} className="mt-4" style={{ height: "100%" }}>
                    <video
                        src={`data:video/mp4;base64,${video}`}
                        width={"100%"}
                        height={"100%"}
                        alt="Cómo hacer la seña"
                        controls="controls"
                        type="video/mp4"
                    />
                    {/* <img
                        src={`data:image/jpeg;base64,${video}`}
                        width={"100%"}
                        style={{ height: "30vw" }}
                        alt={"Foto de cómo se hace la seña"}
                        className="pe-lg-5 cover" /> */}
                </Col>
                <Col xs={12} lg={5} className="mt-4" style={{ height: "100%" }}>
                    <PalabraCard id="palCard" imagen={imagen} palabra={palabra} definicion={definicion} />
                </Col>
            </Row>
            <Row className="m-5">
                <Col>
                    {idPalabra !== 1 && <Button className="non-cta-button" onClick={() => {
                        setIdPalabra(idPalabra => idPalabra - 1);
                    }}>
                        <p className="m-0" style={{ color: "var(--text-white)" }}>
                            Previo
                        </p>
                    </Button>}
                </Col>
                {idPalabra !== (palabras.length) && <Col className="col-auto ms-auto">
                    <Button className="cta-button" onClick={() => {
                        setIdPalabra(idPalabra => idPalabra + 1);
                    }}>
                        <p className="m-0" style={{ color: "var(--text-white)" }}>
                            Siguiente
                        </p>
                    </Button>
                </Col>}
            </Row>
        </Container >
    );
}

export default Leccion;