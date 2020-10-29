import React, { Component, useState } from 'react';
import { Button, Card, CardFooter, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import Axios from "axios";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
  const [errors, setErrors] = useState("")

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContactNumber, setParentContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [DOB, setDOB] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [parentNameError, setParentNameError] = useState("");
  const [parentContactNumberError, setParentContactNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [DOBError, setDOBError] = useState("");
  const [selectedFileError, setSelectedFileError] = useState("");
  const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  const validNumber = RegExp(/^[0-9\b]+$/);

  const register = () => {
    alert(isFormValid)
    console.log(firstName)
    console.log(parentName)
    console.log(parentContactNumber)
    console.log(email)
    console.log(password)
    console.log(DOB)
    if (firstName.length <= 0 || parentName.length <= 0 || parentContactNumber.length <= 0 || email.length <= 0 || password.length <= 0 || DOB == null) {
      alert("Please enter proper form details !!!")
      return;
    } else {
      Axios.post("http://localhost:3001/register", {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        parentName: parentName,
        parentContactNumber: parentContactNumber,
        DOB: DOB,
        selectedFile: selectedFile
      }).then((response) => {
        console.log(response);
      });
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = setErrors;
    switch (name) {
      case 'firstname':
        if (value.length < 3) {
          setFirstNameError("Full Name must be 3 characters long!")
          setIsFormValid(false);
        } else {
          setFirstNameError("");
          setFirstName(value);
        }
        break;
      case 'lastname':
        setLastName(value)
        break
      case 'pname':
        if (value.length < 3) {
          setParentNameError("Parent Name must be 3 characters long!")
          setIsFormValid(false);
        } else {
          setParentNameError("");
          setParentName(value)
        }
        break;
      case 'pcontact':
        var phonenumberMessage = "";
        if (value.length != 10) {
          phonenumberMessage += "Please enter only 10 digit number"
          setIsFormValid(false);
        } else {
          phonenumberMessage += "";
        }

        if (!validNumber.test(value)) {
          if (phonenumberMessage.length > 0) {
            phonenumberMessage += " And "
          }
          phonenumberMessage += "Phone Number should contain only digits"
          setIsFormValid(false);
        } else {
          phonenumberMessage += "";
        }

        if (phonenumberMessage.length <= 0) {
          setParentContactNumber(value)
        }
        setParentContactNumberError(phonenumberMessage)
        break;
      case 'email':
        if (validEmailRegex.test(value)) {
          setEmailError("")
          setEmail(value)
        } else {
          setEmailError("Please enter a valid Email");
          setIsFormValid(false);
        }
        break;
      case 'password':
        if (value.length < 8) {
          setPasswordError("Password must be 8 characters long!")
          setIsFormValid(false);
        } else {
          setPasswordError('');
          setPassword(value)
        }
        break;
      default:
        break;
    }

    if (firstNameError.length <= 0 && lastNameError.length <= 0 && parentNameError.length <= 0 && setParentContactNumberError.length <= 0 && emailError.length <= 0 && passwordError.length <= 0) {
      setIsFormValid(true);
    }
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
                  {setFirstNameError.length > 0 ? <span className='error'>{firstNameError}</span> : null}
                  <InputGroup className="mb-3">Enter your first Name <div class="required-field"></div> &nbsp;
                  <Input name="firstname" type="text" onChange={handleChange} />
                  </InputGroup>

                  {setLastNameError.length > 0 ? <span className='error'>{lastNameError}</span> : null}
                  <InputGroup className="mb-3"> Enter your Last Name &nbsp;
                    <Input name="lastname" type="text" onChange={handleChange} />
                  </InputGroup>

                  <div className="mb-3">
                    <InputGroup className="mb-3"> Select Date of Birth <div class="required-field"></div> &nbsp;
                    <DatePicker name="DOB" showPopperArrow={false} placeholderText="Select Date" selected={DOB} onChange={date => setDOB(date)} showYearDropdown showMonthDropdown />
                    </InputGroup>
                  </div>

                  <InputGroup className="mb-4">Upload your Photo <input type="file" onChange={handleChange} /> </InputGroup>
                  
                  {setParentNameError.length > 0 ? <span className='error'>{parentNameError}</span> : null}
                  <InputGroup className="mb-4">Parent/Guardian Name <div class="required-field"></div> &nbsp;
                    <Input name="pname" type="text" onChange={handleChange} />
                  </InputGroup>

                  {setParentContactNumberError.length > 0 ? <span className='error'>{parentContactNumberError}</span> : null}
                  <InputGroup className="mb-4">Parent/Guardian Contact <div class="required-field"></div> &nbsp;
                    <Input name="pcontact" type="text" onChange={handleChange} />
                  </InputGroup>

                  {setEmailError.length > 0 ? <span className='error'>{emailError}</span> : null}
                  <InputGroup className="mb-4">Enter your Email <div class="required-field"></div> &nbsp;
                    <Input name="email" type="email" onChange={handleChange} />
                  </InputGroup>

                  {setPasswordError.length > 0 ? <span className='error'>{passwordError}</span> : null}
                  <InputGroup className="mb-4">Enter your Password <div class="required-field"></div> &nbsp;
                    <Input name="password" type="password" onChange={handleChange} />
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