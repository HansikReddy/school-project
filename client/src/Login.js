﻿import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './App.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';

export default function Login() {

	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginStatus, setLoginStatus] = useState("");
	const [errors, setErrors] = useState("")
	const [emailError, setEmailError] = useState("")
	const [passwordError, setPasswordError] = useState("")
	const [isOpen, setIsOpen] = useState(false);
	const [resetPasswordEmail, setresetPasswordEmail]=useState("")
	const [resetPasswordEmailError,setresetPasswordEmailError]=useState("")

	Axios.defaults.withCredentials = true;

	const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

	const login = () => {

		if (email.length <= 0 || password.length <= 0) {
			toast.error("🦄 Please Enter The Email Id and Password, Then Try Again");
			return;
		}

		Axios.post("http://localhost:3001/login", {
			email: email,
			password: password
		}).then((response) => {
			toast.success("🦄 Logged In Successfully !!!");
			if (response.data.message) {
				setLoginStatus(response.data.message);
			}
			history.push("/Dashboard");
		});
	};

	useEffect(() => {
		Axios.get("http://localhost:3001/login").then((response) => {
			if (response.data.loggedIn == true) {
				setLoginStatus(response.data.user.loggedInUserFullName);
			}
		});
	}, []);

	function toggleModal() {
		setIsOpen(!isOpen);
	}

	function resetPassword(){
		Axios.post("http://localhost:3001/api/forgotpass", {
			email: resetPasswordEmail
		}).then((response) => {
			
		});
	}

	const handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		let errors = setErrors;
		switch (name) {
			case 'email':
				if (validEmailRegex.test(value)) {
					setEmailError("")
					setEmail(value)
				} else {
					setEmailError("Please enter a valid Email");
				}
				break;
			case 'password':
				if (value.length < 8) {
					setPasswordError("Password must be 8 characters long!")
				} else {
					setPasswordError('');
					setPassword(value)
				}
				break;
			default:
				break;
		}
	};

	return (
		<div className="app flex-row align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col md="9" lg="7" xl="6">
						<CardGroup>
							<Card className="p-2">
								<CardBody>
									<Form>
										<div className="row" className="mb-2 pageheading">
											<div className="col-sm-12 btn btn-primary">
												Login Credentials
                                            </div>
										</div>
										{setEmailError.length > 0 ? <span className='error'>{emailError}</span> : null}
										<InputGroup className="mb-3">
											<Input type="text" onChange={handleChange} name="email" placeholder="Enter Email" noValidate />
										</InputGroup>
										{setPasswordError.length > 0 ? <span className='error'>{passwordError}</span> : null}
										<InputGroup className="mb-4">
											<Input type="password" name="password" onChange={handleChange} placeholder="Enter Password" />
										</InputGroup>
										<p>Forgot Password? click <a onClick={toggleModal} href="#">here</a> to reset</p>
										<Button onClick={login} color="success" block>LOGIN</Button>
									</Form>
								</CardBody>
							</Card>
						</CardGroup>
					</Col>
				</Row>
			</Container>
			<Modal
				isOpen={isOpen}
				onRequestClose={toggleModal}
				contentLabel="Rest Password"
				className="mymodal"
				overlayClassName="myoverlay"
				closeTimeoutMS={500}
			>
				<Form>
					<div className="row" className="mb-2 pageheading">
						<div className="col-sm-12 btn btn-primary">
							Reset Password
                        </div>
					</div>
					{setEmailError.length > 0 ? <span className='error'>{emailError}</span> : null}
					<InputGroup className="mb-3">
						<Input type="text" name="passwordResetEmail" onChange={(e) => { setresetPasswordEmail(e.target.value); }} placeholder="Enter Email" noValidate />
					</InputGroup>
					<Button onClick={resetPassword} color="success" block>Send Email</Button>
					<Button onClick={toggleModal} color="secondary" block>Close</Button>
				</Form>
			</Modal>
		</div>
	);
}
