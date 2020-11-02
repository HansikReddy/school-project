import React, { Component, useState, useEffect } from 'react';
import './App.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ReactDOM from 'react-dom'
import App from './App'
import Modal from "react-modal";

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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

		Axios.post("http://localhost:3001/login", {
			email: email,
			password: password
		}).then((response) => {
			if (response.data.message) {
				setLoginStatus(response.data.message);
			}
			history.push("/Dashboard");
		});
	};

	useEffect(() => {
		//loadScript("http://localhost:3000/App");
		Axios.get("http://localhost:3001/login").then((response) => {
			console.log("Logged In " + response.data.loggedIn)
			if (response.data.loggedIn == true) {
				console.log(response)
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
			case 'fullName':
				errors.fullName =
					value.length < 5
						? setEmailError('Full Name must be 5 characters long!')
						: setEmailError("");
				break;
			case 'email':
				errors.email =
					validEmailRegex.test(value)
						? setEmailError("")
						: setEmailError('Email is not valid!');
				break;
			case 'password':
				errors.password =
					value.length < 8
						? setPasswordError('Password must be 8 characters long!')
						: setPasswordError('');
				break;
			case 'passwordResetEmail':
				// errors.email =
				// 	validEmailRegex.test(value)
				// 		? setEmailError("")
				// 		: setEmailError('Email is not valid!');
				setresetPasswordEmail(value)
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
												Login
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
										<Button onClick={login} color="success" block>Login</Button>
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
