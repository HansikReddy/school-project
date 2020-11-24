import React, { useState, useEffect } from 'react';
import Axios from "axios";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';

import "react-datepicker/dist/react-datepicker.css";

export default function Update() {

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [parentName, setParentName] = useState("");
	const [parentContactNumber, setParentContactNumber] = useState("");
	const [email, setEmail] = useState("");
	const [DOB, setDOB] = useState("");
	const [selectedFile, setSelectedFile] = useState("");
	const [studentId, setStudentId] = useState("");

	const [isFormValid, setIsFormValid] = useState(false);
	const [firstNameError, setFirstNameError] = useState("");
	const [parentNameError, setParentNameError] = useState("");
	const [parentContactNumberError, setParentContactNumberError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [DOBError, setDOBError] = useState("");
	const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
	const validNumber = RegExp(/^[0-9\b]+$/);

	useEffect(() => {
		let url = window.location.href;
		let params = url.split("UpdateStudent?id=");
		Axios.get("http://localhost:3001/getStudentDetails?studentId=" + params[1]).then((response) => {
			setFirstName(response.data.FIRST_NAME)
			setLastName(response.data.LAST_NAME)
			setDOB(new Date(response.data.DOB))
			setParentName(response.data.PARENT_NAME)
			setParentContactNumber(response.data.PARENT_CONTACT_NO)
			setEmail(response.data.EMAIL)
			setStudentId(response.data.ID)
		});
	}, []);

	const register = () => {
		if (firstName.length <= 0 || parentName.length <= 0 || parentContactNumber.length <= 0 || email.length <= 0 || DOB == null || firstNameError.length > 0 || emailError.length > 0 || parentNameError.length > 0 || parentContactNumberError.length > 0 || DOBError.length > 0) {
			toast.error("🦄 Please Enter The Required Fields And Try Again !!!");
			return;
		} else {
			Axios.post("http://localhost:3001/updateStudent?studentId=" + studentId, {
				email: email,
				firstName: firstName,
				lastName: lastName,
				parentName: parentName,
				parentContactNumber: parentContactNumber,
				DOB: DOB,
			}).then((response) => {
				toast.success("🦄 Student Details Updated Successfully")
				window.location = "/StudentsList";
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
				} else if (!value.match(/^[a-zA-Z_ ]+$/)) {
					setFirstNameError("Name must contain Alphabets!")
				} else {
					setFirstNameError("");
				}
				setFirstName(value);
				break;
			case 'lastname':
				setLastName(value)
				break
			case 'pname':
				if (value.trim().length < 3) {
					setParentNameError("Full Name must be 3 characters long!")
				} else if (!value.match(/^[a-zA-Z_ ]+$/)) {
					setParentNameError("Name must contain Alphabets!")
				} else {
					setParentNameError("");
				}
				setParentName(value);
				break;
			case 'pcontact':
				var phonenumberMessage = "";
				if (value.length != 10) {
					phonenumberMessage += "Please enter only 10 digit number"
				} else {
					phonenumberMessage += "";
				}
				if (!validNumber.test(value)) {
					if (phonenumberMessage.length > 0) {
						phonenumberMessage += " And "
					}
					phonenumberMessage += "Phone Number should contain only digits"
				} else {
					phonenumberMessage += "";
				}

				if (phonenumberMessage.length <= 0) {
					
				}
				setParentContactNumberError(phonenumberMessage)
				setParentContactNumber(value)
				break;
			case 'email':
				if (validEmailRegex.test(value)) {
					setEmailError("")
				} else {
					setEmailError("Please enter a valid Email");
				}
				setEmail(value)
				break;
			default:
				break;
		}

	};

	return (
		<div class="container" style={{ 'max-width': '1300px' }}>
			<div class="card">
				<h5 class="card-header text-center">STUDENT DETAILS</h5>
				<div class="card-body">
					<form class="needs-validation" novalidate enctype="multipart/form-data">
						<div class="form-row">
							<div
								class="form-group required col-md-6" >
								<label for="validationCustom03" class="control-label">First Name</label>
								<input name="firstname" type="text" class="form-control" id="validationCustom03" placeholder="Enter First Name" required onChange={handleChange} value={firstName} />
								{setFirstNameError.length > 0 ? <span className='error'>{firstNameError}</span> : null}
							</div>
							<div class="form-group col-md-6">
								<label for="inputPassword4" class="control-label">Last Name  </label>
								<input name="lastname" type="text" class="form-control" id="inputPassword4" placeholder="Enter Last Name" onChange={handleChange} value={lastName} />
							</div>
						</div>
						<div class="form-row">
							<div class="form-group required  col-md-6" >
								<label for="inputEmail4" class="control-label" >Email</label>
								<input name="email" type="email" class="form-control" id="inputEmail4" placeholder="Enter Email" required onChange={handleChange} value={email} />
								{setEmailError.length > 0 ? <span className='error'>{emailError}</span> : null}
							</div>
							<div class="form-group required  col-md-3">
								<label for="inputEmail4" class="control-label">Date Of Birth </label> <br />
								<DatePicker name="DOB" showPopperArrow={false} placeholderText="Date Of Birth" selected={DOB} onChange={date => dateOfBirthValidator(date)} value={DOB} showYearDropdown showMonthDropdown minDate={new Date().setFullYear(new Date().getFullYear() - 25)} maxDate={new Date()} showDisabledMonthNavigation />
								<br></br>{setDOBError.length > 0 ? <span className='error'>{DOBError}</span> : null}
							</div>
							<div class="form-group reqired col-md-3">
								<label for="exampleFormControlFile1" class="control-label">Change photo</label>
								<input type="file" class="form-control-file" name="photo" onChange={(e) => { setSelectedFile(e.target.files[0]); }} />
							</div>
						</div>
						<div class="form-row">
							<div class="form-group required  col-md-6">
								<label for="inputEmail4" class="control-label">Parent / Guardian Name</label>
								<input name="pname" type="text" class="form-control" id="firstName" placeholder="Enter Parent / Guardian Name" onChange={handleChange} value={parentName} required />
								{setParentNameError.length > 0 ? <span className='error'>{parentNameError}</span> : null}
							</div>
							<div class="form-group required  col-md-6">
								<label for="inputPassword4" class="control-label">Parent / Guardian Contact Number</label>
								<input name="pcontact" type="text" class="form-control" id="inputPassword4" placeholder="Enter Parent / Guardian Contact Number" onChange={handleChange} value={parentContactNumber} />
								{setParentContactNumberError.length > 0 ? <span className='error'>{parentContactNumberError}</span> : null}
							</div>
						</div>

					</form>
				</div>
				<div class="card-footer text-muted">
					<button type="submit" onClick={register} class="btn btn-primary">UPDATE</button>
				</div>
			</div>
		</div>
	);
}