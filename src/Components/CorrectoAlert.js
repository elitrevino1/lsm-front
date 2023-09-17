import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function CorrectoAlert() {

    const [show, setShow] = useState(true);

    return (
        <div style={{ position: "absolute", top: "11vh", right: "1vw", zIndex: 999 }}>
            <Alert show={true} variant="success" onClose={() => setShow(false)} dismissible className="green-alert">
                <Alert.Heading>
                    <h2 className="green-text">
                        <i class="fa-solid fa-circle-check pe-2"></i>
                        <span>Correcto</span>
                    </h2>
                </Alert.Heading>
                <p className="me-5 green-text" style={{ minWidth: "15vw" }}>
                    ¡Excelente, sigue así!
                </p>
            </Alert>
        </div>
    );
}

export default CorrectoAlert;