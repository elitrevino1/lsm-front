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

    useEffect(() => {
        const getPalabra = async () => {
            try {
                const response = await api.get(`/lecciones/${id}/${idPalabra}`);
                setImagen(response.data.imagen64);
                setPalabra(response.data.titulo);
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
                        id: tuple.id,
                        nombre: tuple.titulo,
                        imagen: tuple.imagen64,
                    }
                    arr.push(newElement);
                }
                );
                setPalabras(arr);
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
    }, [id]);

    return (
        <Container fluid key={idPalabra}>
            <Row className="m-5 mb-0">
                <Col xs={12}>
                    <h1>
                        <i className="fa-solid fa-bars pe-4"></i>
                        <span>{nombre}</span>
                    </h1>
                </Col>
            </Row>
            <Row className="mx-5 align-items-center" key={idPalabra}>
                <Col xs={12} lg={8} className="mt-4" style={{ height: "100%" }}>
                    {/* <video
                        src={video}
                        width={"100%"}
                        height={"100%"}
                        alt="Cómo hacer la seña"
                        controls="controls"
                        type="video/mp4"
                    /> */}
                    <img
                        src={`data:image/jpeg;base64,${video}`}
                        width={"100%"}
                        className="pe-5" />
                </Col>
                <Col xs={12} lg={4} className="mt-4" style={{ height: "100%" }}>
                    <PalabraCard imagen={imagen} palabra={palabra} definicion={definicion} />
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