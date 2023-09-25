import React from "react";
import { Card } from "react-bootstrap";

function LeccionCard(props) {
    return (
        <Card className="mb-4 w-100 shadow">
            <Card.Img variant="top" src={`data:image/jpeg;base64,${props.imagen}`} height={"200"} className="cover" />
            <Card.Body>
                <Card.Title><p className="h1 max-2-lines">{props.nombre}</p></Card.Title>
            </Card.Body>
        </Card>
    );
}

export default LeccionCard;