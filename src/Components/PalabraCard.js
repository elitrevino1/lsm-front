import React from "react";
import { Card } from "react-bootstrap";

function PalabraCard(props) {
    return (
        <Card className="w-100 h-100">
            <Card.Img variant="top" src={`data:image/jpeg;base64,${props.imagen}`} />
            <Card.Body>
                <Card.Title><p className="h1">{props.palabra}</p></Card.Title>
                <Card.Text className="mb-5">{props.definicion}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default PalabraCard;