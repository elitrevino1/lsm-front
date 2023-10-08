import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import logo from '../Multimedia/logo.png';
import "bootstrap/js/src/collapse.js";

function CustomNavbar() {

    return (
        <Navbar className="navbar-custom p-0 m-0" expand="sm">
            <Container fluid className="p-0 m-0">
                <Navbar.Brand className="p-0 m-0 d-flex align-items-center" href="/aprende">
                    <img
                        src={logo}
                        height={"80"}
                        className="d-inline-block align-top"
                        alt="UDEM Logo"
                    />{' '}
                    <span className="h3 m-0 ps-4 d-none d-lg-block">Lengua de Señas Mexicana</span>
                    <span className="h3 m-0 ps-4 d-none d-md-block d-lg-none">LSM</span>
                </Navbar.Brand>

                <Navbar.Toggle className="me-4" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Link href="/aprende" className={window.location.href.includes("practica") ? "p-0 nav-align justify-content-end" : "white-bg p-0 nav-align justify-content-end"}>
                            <h3 className={window.location.href.includes("practica") ? "m-0 py-3 p-5" : "orange-text m-0 py-3 p-5"} >
                                <i className="fa-solid fa-book pe-2"></i>
                                <span>Aprende</span>
                            </h3>
                        </Nav.Link>

                        <Nav.Link href="/practica" className={window.location.href.includes("practica") ? "white-bg p-0 nav-align me-0 me-md-5 justify-content-end" : "p-0 nav-align me-0 me-md-5 justify-content-end"}>
                            <h3 className={window.location.href.includes("practica") ? "orange-text m-0 py-3 p-5" : "m-0 py-3 p-5"}>
                                <i className="fa-solid fa-hand pe-2"></i>
                                <span>Practica</span>
                            </h3>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default CustomNavbar;