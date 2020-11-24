import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import Axios from "axios";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';

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

  const [isFormValid, setIsFormValid] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [parentNameError, setParentNameError] = useState("");
  const [parentContactNumberError, setParentContactNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [DOBError, setDOBError] = useState("");
  const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  const validNumber = RegExp(/^[0-9\b]+$/);

  const register = () => {
    if (firstName.length <= 0 || parentName.length <= 0 || parentContactNumber.length <= 0 || email.length <= 0 || password.length <= 0 || DOB == null) {
      toast.error("🦄 Please Enter The Required Fields And Try Again !!!");
      return;
    } else {
      console.log(selectedFile)
      var studentObj = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        parentName: parentName,
        parentContactNumber: parentContactNumber,
        DOB: DOB,
      }
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('studentObj', JSON.stringify(studentObj))
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        },
      };
      Axios.post("http://localhost:3001/register", formData, config)
        .then((response) => {
          toast.success("🦄 Student Details Added Successfully")
          window.location = "/StudentsList";
        }).catch((error) => {
          toast.error("🦄 Something Went Wrong, Please Try Again")
        });
    }
  };

  const dateOfBirthValidator = (selectedDate) => {
    if (selectedDate != null && selectedDate != undefined) {
      var selectedDOB = new Date(selectedDate);
      var today = new Date();
      if ((today.getFullYear() - selectedDOB.getFullYear()) <= 4) {
        setDOB(null)
        setDOBError("Minimum of 5 years is required for registration");
      } else {
        setDOBError("");
        setDOB(selectedDate)
      }
    }
  }

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'firstname':
        if (value.trim().length < 3) {
          setFirstNameError("Name must be 3 characters long!")
          setIsFormValid(false);
        } else if (!value.match(/^[a-zA-Z]+$/)) {
          setFirstNameError("Name must contain Alphabets!")
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
        if (value.trim().length < 3) {
          setParentNameError("Full Name must be 3 characters long!")
          setIsFormValid(false);
        } else if (!value.match(/^[a-zA-Z]+$/)) {
          setParentNameError("Name must contain Alphabets!")
          setIsFormValid(false);
        } else {
          setParentNameError("");
          setParentName(value);
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
      case 'password1':
        if (password != value) {
          setConfirmPasswordError('Password and confirm should be same')
        } else {
          setConfirmPasswordError('');
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
    <div class="container" style={{ 'max-width': '1300px' }}>
      <div class="card">
        <h5 class="card-header text-center">ADD STUDENT</h5>
        <div class="card-body">
          <form class="needs-validation" novalidate enctype="multipart/form-data">
            <div class="form-row">
              <div
                class="form-group required col-md-6" >
                <label for="validationCustom03" class="control-label">First Name</label>
                <input name="firstname" type="text" class="form-control" id="validationCustom03" placeholder="Enter First Name" required onChange={handleChange} />
                {setFirstNameError.length > 0 ? <span className='error'>{firstNameError}</span> : null}
              </div>
              <div class="form-group col-md-6">
                <label for="inputPassword4" class="control-label">Last Name  </label>
                <input name="lastname" type="text" class="form-control" id="inputPassword4" placeholder="Enter Last Name" />
                {setLastNameError.length > 0 ? <span className='error'>{lastNameError}</span> : null}
              </div>
            </div>
            <div class="form-row">
              <div class="form-group required  col-md-6" >
                <label for="inputEmail4" class="control-label" >Email</label>
                <input name="email" type="email" class="form-control" id="inputEmail4" placeholder="Enter Email" required onChange={handleChange} />
                {setEmailError.length > 0 ? <span className='error'>{emailError}</span> : null}
              </div>
              <div class="form-group required  col-md-3">
                <label for="inputEmail4" class="control-label">Date Of Birth </label> <br />
                <DatePicker name="DOB" showPopperArrow={false} placeholderText="Date Of Birth" selected={DOB} onChange={date => dateOfBirthValidator(date)} showYearDropdown showMonthDropdown minDate={new Date().setFullYear(new Date().getFullYear() - 25)} maxDate={new Date()} showDisabledMonthNavigation />
                <br></br>{setDOBError.length > 0 ? <span className='error'>{DOBError}</span> : null}
              </div>
              <div class="form-group reqired col-md-3">
                <label for="exampleFormControlFile1" class="control-label">Photo</label>
                <input type="file" class="form-control-file" name="photo" onChange={(e) => { setSelectedFile(e.target.files[0]); }} />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group required  col-md-6">
                <label for="inputEmail4" class="control-label">Parent / Guardian Name</label>
                <input name="pname" type="text" class="form-control" id="firstName" placeholder="Enter Parent / Guardian Name" onChange={handleChange} required />
                {setParentNameError.length > 0 ? <span className='error'>{parentNameError}</span> : null}
              </div>
              <div class="form-group required  col-md-6">
                <label for="inputPassword4" class="control-label">Parent / Guardian Contact Number</label>
                <input name="pcontact" type="text" class="form-control" id="inputPassword4" placeholder="Enter Parent / Guardian Contact Number" onChange={handleChange} />
                {setParentContactNumberError.length > 0 ? <span className='error'>{parentContactNumberError}</span> : null}
              </div>
            </div>
            <div class="form-row">
              <div class="form-group required col-md-6">
                <label for="inputEmail4" class="control-label">Password</label>
                <input name="password" type="password" class="form-control" id="firstName" placeholder="Enter Password" onChange={handleChange} required />
                {setPasswordError.length > 0 ? <span className='error'>{passwordError}</span> : null}
              </div>
              <div class="form-group required col-md-6">
                <label for="inputPassword4" class="control-label">Confirm Password</label>
                <input name="password1" type="password" class="form-control" id="inputPassword4" placeholder="Enter Confirm Password" onChange={handleChange} />
                {setConfirmPasswordError.length > 0 ? <span className='error'>{confirmPasswordError}</span> : null}
              </div>
            </div>
          </form>
        </div>
        <div class="card-footer text-muted">
          <button type="submit" onClick={register} class="btn btn-primary">SAVE</button>
        </div>
      </div>
    </div>
  );
}