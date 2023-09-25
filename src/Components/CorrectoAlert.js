import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function CorrectoAlert(props) {

    const [show, setShow] = useState(props.show);

    return (
        <div style={{ position: "absolute", top: "9vh", right: "1vw", zIndex: 999 }}>
            <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible className="green-alert px-4">
                <Alert.Heading>
                    <h1 className="green-text">
                        <i className="fa-solid fa-circle-check pe-3"></i>
                        <span>Correcto</span>
                    </h1>
                </Alert.Heading>
                <h3 className="me-5 green-text fw-normal pt-1 pb-2" style={{ minWidth: "15vw" }}>
                    ¡Excelente, sigue así!
                </h3>
            </Alert>
        </div>
    );
}

export default CorrectoAlert;