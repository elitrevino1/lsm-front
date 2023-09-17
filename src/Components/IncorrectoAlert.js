import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function IncorrectoAlert(props) {

    const [show, setShow] = useState(true);

    return (
        <div style={{ position: "absolute", top: "11vh", right: "1vw", zIndex: 999 }}>
            <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible className="red-alert">
                <Alert.Heading>
                    <h2 className="red-text">
                        <i className="fa-solid fa-circle-xmark pe-2"></i>
                        <span>Incorrecto</span>
                    </h2>
                </Alert.Heading>
                <p className="me-5 red-text" style={{ minWidth: "15vw" }}>
                    {props.error}
                </p>
            </Alert>
        </div>
    );
}

export default IncorrectoAlert;