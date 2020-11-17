import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './App.css';
import Axios from "axios";
import Modal from "react-modal";

export default function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loginStatus, setLoginStatus] = useState("");
const [isOpen, setIsOpen] = useState(false);
const [resetPasswordEmail, setresetPasswordEmail] = useState("")

Axios.defaults.withCredentials = true;

const login = (event) => {
event.preventDefault();
if (email.length <= 0 || password.length <= 0) {
toast.error("🦄 Please Enter The Email Id and Password, Then Try Again");
return;
}
Axios.post("http://localhost:3001/login", {
email: email,
password: password
}).then((response) => {
console.log(response);
toast.success(response.data.message);
if (response.data.loggedIn) {
setLoginStatus(true);
window.location = "/Dashboard";
}
}).catch(error => {
toast.error(error.response.data.message)
return error;
});
};

function toggleModal() {
setIsOpen(!isOpen);
}

function resetPassword() {
Axios.post("http://localhost:3001/api/forgotpass", {
email: resetPasswordEmail
}).then((response) => {

});
}

return (
<div class="container" style={{ 'max-width': '1300px' }}>
<div class="card ">
<h5 class="card-header text-center">LOGIN TO YOUR ACCOUNT</h5>
<div class="card-body">
<div class="row">
<div class="col-6">
<div>
<img class="card-img-top" src="https://i.pinimg.com/originals/3f/3d/d9/3f3dd9219f7bb1c9617cf4f154b70383.jpg" alt="Card image" width="250" height="250"></img>
</div>
</div>
<div class="col-6">
<form onSubmit={login}>
<div class="form-group">
<label for="exampleInputEmail1">Email address</label>
<input type="email" class="form-control" id="exampleInputEmail1" onChange={(e) => { setEmail(e.target.value); }} aria-describedby="emailHelp" placeholder="Enter email" required />
</div>
<div class="form-group">
<label for="exampleInputPassword1">Password</label>
<input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => { setPassword(e.target.value); }} placeholder="Password" required />
</div>
<div class="form-group">
Forgot Password? click <a onClick={toggleModal} href="#">here</a> to reset the password
</div>
<button type="submit" class="btn btn-primary">LOGIN</button>
</form>
</div>
</div>
</div>
<Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Rest Password" className="mymodal" overlayClassName="myoverlay" closeTimeoutMS={1}>
<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title" id="exampleModalLabel">RESET PASSWORD</h5>
<button type="button" class="close" onClick={toggleModal}>
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body">
<form>
<div class="form-group">
<label for="exampleInputEmail1">Email address</label>
<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required />
</div>
</form>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" onClick={toggleModal} >CLOSE</button>
<button type="button" class="btn btn-primary">CONFIRM</button>
</div>
</div>
</div>
</Modal>
</div>
</div>
);
}