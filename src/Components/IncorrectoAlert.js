import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function IncorrectoAlert(props) {

   //const [show, setShow] = useState(props.show);

   return (
    <div style={{ position: "absolute", top: "9vh", right: "1vw", zIndex: 999 }}>
        <Alert show={props.show} variant="danger" onClose={props.handleClose} dismissible className="red-alert px-4">
                <Alert.Heading>
                    <h1 className="red-text">
                        <i className="fa-solid fa-circle-xmark pe-3"></i>
                        <span>Incorrecto</span>
                    </h1>
                </Alert.Heading>
                <h3 className="me-5 red-text msg-wrapper fw-normal pt-1 pb-2" style={{ minWidth: "15vw" }}>
                    {props.error}
                </h3>
            </Alert>
        </div>
    );
}

export default IncorrectoAlert;