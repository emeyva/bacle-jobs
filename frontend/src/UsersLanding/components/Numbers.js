import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./Numbers.css";

const Numbers = () => {
  return (
    <section className="section-numbers">
      <Container className="container-numbers">
        <Row>
          <Col>
            <div className="div-numbers">
              <h1>
                <b>+1000 </b>
              </h1>
              <p>
                <b> Trabalhos por mês </b>
              </p>
            </div>
          </Col>
          <Col>
            <div className="div-numbers">
              <h1>
                <b>+1000 </b>
              </h1>
              <p>
                <b> Trabalhos por mês</b>
              </p>
            </div>
          </Col>
          <Col>
            <div className="div-numbers">
              <h1>
                <b>+1000 </b>
              </h1>
              <p>
                <b> Trabalhos por mês </b>
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <h5 className="text-numbers">
            When applied to building block a website or similar work product, a
            Visual Guide of the thing in da things, that's what we need to be in
            the things man
          </h5>
        </Row>
      </Container>
    </section>
  );
};

export default Numbers;
