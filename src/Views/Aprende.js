import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import LeccionCard from "../Components/LeccionCard";
import { useNavigate } from "react-router-dom";
import api from "../api/route.js";

function Aprende() {

    const [lecciones, setLecciones] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        const getLecciones = async () => {
            try {
                const response = await api.get(`/aprende`);
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
                setLecciones(arr);
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
        getLecciones();
    }, []);

    return (
        <Container fluid>
            <Row className="m-5 mb-4">
                <Col xs={12}>
                    <h1>Lecciones</h1>
                </Col>
            </Row>
            <Row className="mx-5">
                {lecciones.map((leccion) =>
                    <Col xs={12} sm={6} md={4} lg={3} xl={2} key={leccion.id} className="d-flex align-items-stretch" onClick={() => navigate("/aprende/leccion", {
                        state: {
                            id: leccion.id,
                            nombre: leccion.nombre,
                            num: 1
                        }
                    })}>
                        <LeccionCard nombre={leccion.nombre} imagen={leccion.imagen} />
                    </Col>)}
            </Row>
        </Container>
    );
}

export default Aprende;