import React, { Component, useState } from 'react';
import { Button, Card, CardFooter, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContactNumber, setParentContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [DOB, setDOB] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      parentName: parentName,
      parentContactNumber: parentContactNumber,
      DOB: DOB,
      selectedFile : selectedFile
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Form>
                  <div class="row" className="mb-2 pageheading">
                    <div class="col-sm-12 btn btn-primary">
                      Sign Up
                      </div>
                  </div>
                  <InputGroup className="mb-3">
                    <Input type="text" onChange={(e) => { setFirstName(e.target.value); }} placeholder="Enter First Name" />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Input type="text" onChange={(e) => { setLastName(e.target.value); }} placeholder="Enter Last Name" />
                  </InputGroup>
                  <div className="mb-3">
                    <div>
                      Date Of Birth <DatePicker showPopperArrow={false} placeholderText="Select Date" selected={DOB} onChange={date => setDOB(date)} showYearDropdown showMonthDropdown />
                    </div>
                  </div>
                  <InputGroup className="mb-4"><input type="file" onChange={(e) => { setSelectedFile(e.target.files[0]); }} /> </InputGroup>
                  <InputGroup className="mb-4">
                    <Input type="text" onChange={(e) => { setParentName(e.target.value); }} placeholder="Enter Parent/Guardian Name" />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input type="text" onChange={(e) => { setParentContactNumber(e.target.value); }} placeholder="Enter Parent/Guardian Contact" />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input type="email" onChange={(e) => { setEmail(e.target.value); }} placeholder="Enter EmailId" />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input type="password" onChange={(e) => { setPassword(e.target.value); }} placeholder="Enter Password" />
                  </InputGroup>
                  <Button onClick={register} color="success" block>Create Account</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
