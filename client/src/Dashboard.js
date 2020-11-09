import React, {useEffect } from 'react';
import './App.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";

export default function Login() {

	const history = useHistory();

	useEffect(() => {
		Axios.get("http://localhost:3001/login").then((response) => {
			if (!response.data.loggedIn) {
				history.push("/Login");
			}
		});
	}, []);

	Axios.defaults.withCredentials = true;

	return (
		<div class="row" className="mb-2 pageheading">
			<div class="col-sm-12 btn btn-primary">
				Dashboard
             </div>
		</div>
	);
}