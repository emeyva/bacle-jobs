import React from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "../../shared/FormElements/Button";
import "./FormUser.css";

const FormUser = () => {
  return (
    <form className="form-bottom">
      <Container align="center" className="container-form">
        <Row className="align-items-center">
          <Col className="col-form">
            <div className="div-form-col">
              <label>Localização</label>
              <input type="text" name="location" />
            </div>
          </Col>
          <Col>
            <div className="div-form-col">
              <label for="type">Tipo</label>
              <div className="select">
                <select id="standard-select">
                  <option selected disabled>
                    Escolhe aqui a categoria
                  </option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="extras">Extras</option>
                </select>
              </div>
            </div>
          </Col>
          <Col className="col-form">
            <div className="div-form-col">
              <label>Categoria</label>
              <select>
                <option value="restaurant">Restauração</option>
                <option value="logistics">Logística</option>
              </select>
            </div>
          </Col>
          <Col>
            <Button>Procurar</Button>
          </Col>
        </Row>
      </Container>
    </form>
  );
};

export default FormUser;
