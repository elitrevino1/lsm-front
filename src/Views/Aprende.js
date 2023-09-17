import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import LeccionCard from "../Components/LeccionCard";
import { useNavigate } from "react-router-dom";

function Aprende() {

    let navigate = useNavigate();

    let lecciones = [{
        id: 1,
        nombre: "Saludos",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz9tghLhF6AU1LAbzvNWT0pyL9vBohlFK8hw&usqp=CAU"
    }, {
        id: 2,
        nombre: "Números",
        imagen: "https://i0.wp.com/veras.mx/wp-content/uploads/2023/05/numeros.jpg?resize=600%2C375&ssl=1"
    }, {
        id: 3,
        nombre: "Abecedario",
        imagen: "https://cdn.euroinnova.edu.es/img/subidasEditor/alfabeto%20letter-1618806059.webp"
    }, {
        id: 4,
        nombre: "Objetos de la casa con un nombre largo pero larguísimo de más de 2 líneas de verdad que no manches como puede estar tan largo este texto",
        imagen: "https://www.rocketmortgage.com/resources-cmsassets/RocketMortgage.com/Article_Images/Large_Images/Types%20Of%20Homes/Stock-Gray-Ranch-Style-Home-AdobeStock_279953994-copy.jpeg"
    }, {
        id: 5,
        nombre: "Vacaciones",
        imagen: "https://www.diariodelsur.com.mx/finanzas/jo480b-vacaciones.jpeg/ALTERNATES/LANDSCAPE_768/Vacaciones.jpeg"
    }, {
        id: 6,
        nombre: "Familia",
        imagen: "https://concepto.de/wp-content/uploads/2015/08/familia-extensa-e1591818025158-800x400.jpg"
    }, {
        id: 7,
        nombre: "Vehículos",
        imagen: "https://www.prensalibre.com/wp-content/uploads/2022/08/vehiculos-importacion-1.jpg?quality=52"
    }, {
        id: 8,
        nombre: "Animales",
        imagen: "https://www.infobae.com/new-resizer/J-O-584dkUHFdaEI1OkRRovsRVw=/filters:format(webp):quality(85)/arc-anglerfish-arc2-prod-infobae.s3.amazonaws.com/public/75LHW3O23NAJBD6FV6VO5NLAPM.jpg"
    }, {
        id: 9,
        nombre: "Colores",
        imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/L%C3%A1pices_de_colores_01.jpg/300px-L%C3%A1pices_de_colores_01.jpg"
    }, {
        id: 10,
        nombre: "Días de la semana",
        imagen: "https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/image_repo/93/cc/ES-T-L-5934-Tarjetas-de-vocabulario-los-dias-de-la-semana_ver_1.jpg"
    }, {
        id: 11,
        nombre: "Meses",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR4v0exPQq3WaP2LVbcEYspLQVlK-jLI_Swg&usqp=CAU"
    },]

    return (
        <Container fluid>
            <Row className="m-5 mb-4">
                <Col xs={12}>
                    <h1>Lecciones</h1>
                </Col>
            </Row>
            <Row className="mx-5">
                {lecciones.map((leccion) =>
                    <Col xs={12} sm={6} md={4} lg={3} xl={3} key={leccion.id} className="d-flex align-items-stretch" onClick={() => navigate("/aprende/leccion", {
                        state: {
                            id: leccion.id,
                            nombre: leccion.nombre
                        }
                    })}>
                        <LeccionCard nombre={leccion.nombre} imagen={leccion.imagen} />
                    </Col>)}
            </Row>
        </Container>
    );
}

export default Aprende;