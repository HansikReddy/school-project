import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import Reg from './Reg';
import Dashboard from './Dashboard';
import Axios from "axios";
import { useHistory } from "react-router-dom";

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {

	const history = useHistory();
	const [loginStatus, setLoginStatus] = useState("");
	const [loggedInUserFulName, setLoggedInUserFulName] = useState("")

	Axios.defaults.withCredentials = true;

	useEffect(() => {
		Axios.get("http://localhost:3001/login").then((response) => {
			if (response.data.loggedIn == true) {
				setLoggedInUserFulName(response.data.user.loggedInUserFullName)
				setLoginStatus(true)
			} else {
				setLoginStatus(false)
			}
		});
	}, []);

	function logout() {
		Axios.get("http://localhost:3001/logout", {

		}).then((response) => {
			history.push("/Login");
		});
	}
	return (
		<Router>
			<div className="container">
				<nav className="navbar navbar-expand-lg navheader">
					<div className="collapse navbar-collapse" >
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<Link to={'/App'} className="nav-link">Home</Link>
							</li>
							<li className="nav-item">
								{!loginStatus
									? <Link to={'/Login'} className="nav-link">Login</Link>
									: null
								}
							</li>
							<li className="nav-item">
								{!loginStatus
									? <Link to={'/Signup'} className="nav-link">Sign Up</Link>
									: <Link to={'/Signup'} className="nav-link"> Welcome, {loggedInUserFulName}</Link>
								}
							</li>
							<li className="nav-item">
								{loginStatus
									? <Link onClick={logout} className="nav-link">Logout</Link>
									: null
								}
							</li>
						</ul>
						<div className="App">
						</div>
					</div>
				</nav> <br />
				<Switch>
					<Route exact path='/Login' component={Login} />
					<Route path='/Signup' component={Reg} />
				</Switch>
				<Switch>
					<Route path='/Dashboard' component={Dashboard} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;  