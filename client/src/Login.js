import React, { Component, useState, useEffect } from 'react';
import './App.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

export default function Login() {

	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginStatus, setLoginStatus] = useState("");

	Axios.defaults.withCredentials = true;

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
		Axios.get("http://localhost:3001/login").then((response) => {
			console.log("Logged In " + response.data.loggedIn)
			if (response.data.loggedIn == true) {
				console.log(response)
				setLoginStatus(response.data.user.loggedInUserFullName);
			}
		});
	}, []);

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
										<InputGroup className="mb-3">
											<Input type="text" onChange={(e) => { setEmail(e.target.value); }} placeholder="Enter Email" />
										</InputGroup>
										<InputGroup className="mb-4">
											<Input type="password" onChange={(e) => { setPassword(e.target.value); }} placeholder="Enter Password" />
										</InputGroup>
										<Button onClick={login} color="success" block>Login</Button>
									</Form>
								</CardBody>
							</Card>
						</CardGroup>
					</Col>
				</Row>
			</Container>
		</div>
	);
}