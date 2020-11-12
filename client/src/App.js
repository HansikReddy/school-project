import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import Reg from './Reg';
import Dashboard from './Dashboard';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Upload from './UploadImage'
import StudentsList from './StudentsList'
import AddStudent from './AddStudent'

import UpdateStudent from './UpdateStudent'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

	var  location  = window.location.href;
	var dashboardClass = location.includes("/Dashboard") ? "nav-item active" : "nav-item";
	var addStudentClass = location.includes("/AddStudent") ? "nav-item active" : "nav-item";
	var listStudentsClass = location.includes("/StudentsList") ? "nav-item active" : "nav-item";
	var listStudentsClass = location.includes("/StudentsList") ? "nav-item active" : "nav-item";
	var loginCLass = location.includes("/Login") ? "nav-item active" : "nav-item";
	var signupCLass = location.includes("/Signup") ? "nav-item active" : "nav-item";
	var signupCLass = location.includes("/Signup") ? "nav-item active" : "nav-item";

	const history = useHistory();
	const [loginStatus, setLoginStatus] = useState("");
	const [loggedInUserFulName, setLoggedInUserFulName] = useState("")

	Axios.defaults.withCredentials = true;

	useEffect(() => {
		Axios.get("http://localhost:3001/login").then((response) => {
			if (response.data.loggedIn === true) {
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
			toast.success("🦄  Successfully Logged Out !!!");
			history.push("/Login");
		});
	}
	return (
		<Router>
			<div className="container" style={{ 'max-width': '1500px' }}>
				<br/>
				<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
					<a class="navbar-brand" href="#">
						<img src="https://i.pinimg.com/originals/3f/3d/d9/3f3dd9219f7bb1c9617cf4f154b70383.jpg" width="30" height="30" class="d-inline-block align-top" alt=""/>
							 &nbsp; School Management
					</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarNav">
						<ul class="navbar-nav mr-auto">
							{loginStatus
								? <li class={dashboardClass}><a class="nav-link" href="/Dashboard">Home <span class="sr-only">(current)</span></a></li>
								: null
							}
							{loginStatus
								? <li class={addStudentClass}><a class="nav-link" href="/AddStudent">Add Student</a></li>
								: null
							}
							{loginStatus
								? <li class={listStudentsClass}><a class="nav-link" href="/StudentsList">Students List</a></li>
								: null
							}
						</ul>
						<ul class="navbar-nav">
							{!loginStatus
								? <li class={loginCLass}><a class="nav-link" href="/Login">Login</a></li>
								: null
							}
							{!loginStatus
								?<li class={signupCLass}><a class="nav-link" href="/Signup">Register</a></li>
								: null
							}
							{loginStatus
								? <li class="nav-item"><a class="nav-link" href="#">Welcome, {loggedInUserFulName}</a></li>
								: null
							}
							{loginStatus
								? <li class="nav-item"><a class="nav-link" href="#" onClick={logout}>Logout</a></li>
								: null
							}
						</ul>
					</div>
				</nav>
				<br />
				<Switch>
					<Route exact path='/Login' component={Login} />
					<Route path='/Signup' component={Reg} />
					<Route path='/Upload' component={Upload} />
					<Route path='/StudentsList' component={StudentsList} />
					<Route path='/AddStudent' component={AddStudent} />
				</Switch>
				<Switch>
					<Route path='/Dashboard' component={Dashboard} />
					<Route path='/UpdateStudent' component={UpdateStudent} />
				</Switch>
				<ToastContainer position="top-right"
					autoClose={5000}
					hideProgressBar
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		</Router>
	);
}

export default App;  