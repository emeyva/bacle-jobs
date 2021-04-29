import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormUser from "../components/FormUser";
import Button from "../../shared/FormElements/Button";
import Numbers from "../components/Numbers";
import JobType from "../components/JobType";
import "./Users.css";

const Users = () => {
  return (
    <React.Fragment>
      <section className="header-wrapper">
        <Container fluid className="container-header">
          <Row>
            <Col>
              <h1>
                <b>Fazer dinheiro para as tuas paixões, é na Bacle</b>
              </h1>
              <Button>Encontra trabalhos para ti</Button>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        <FormUser />
      </section>
      <Numbers />
      <JobType />
    </React.Fragment>
  );
};

export default Users;
