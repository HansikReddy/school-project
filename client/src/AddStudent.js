import React from 'react';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
	return (
	<div class="container">
		<div class="card">
			<h5 class="card-header">Add Student</h5>
			<div class="card-body">
				<form class="needs-validation" novalidate>
					<div class="form-row">
						<div class="form-group col-md-6">
							<label for="validationCustom03">First Name</label>
							<input type="text" class="form-control" id="validationCustom03" placeholder="Enter First Name" required />
							<div class="invalid-feedback">
								Please provide a valid city.
								</div>
						</div>
						<div class="form-group col-md-6">
							<label for="inputPassword4">Last Name</label>
							<input type="text" class="form-control" id="inputPassword4" placeholder="Enter Last Name" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group col-md-6">
							<label for="inputEmail4">Email</label>
							<input type="email" class="form-control" id="inputEmail4" placeholder="Enter Email" required/>
						</div>
						<div class="form-group col-md-6">
							<label for="inputEmail4">Date Of Birth</label> <br/>
								<DatePicker name="DOB" showPopperArrow={false} placeholderText="Date Of Birth" showYearDropdown showMonthDropdown minDate={new Date().setFullYear(new Date().getFullYear() - 25)} maxDate={new Date()} showDisabledMonthNavigation />
							</div>
					</div>
					<div class="form-row">
						<div class="form-group col-md-6">
							<label for="inputEmail4">Parent / Guardian Name</label>
							<input type="text" class="form-control" id="firstName" placeholder="Enter Parent / Guardian Name" required />
						</div>
						<div class="form-group col-md-6">
							<label for="inputPassword4">Parent / Guardian Contact Number</label>
							<input type="text" class="form-control" id="inputPassword4" placeholder="Enter Parent / Guardian Contact Number" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group col-md-6">
							<label for="inputEmail4">Password</label>
								<input type="password" class="form-control" id="firstName" placeholder="Enter Password" required />
						</div>
						<div class="form-group col-md-6">
							<label for="inputPassword4">Confirm Password</label>
							<input type="password" class="form-control" id="inputPassword4" placeholder="Enter Confirm Password" />
							<small id="passwordHelpBlock" class="form-text text-muted">
								Confirm password should be same as password
							</small>
						</div>
					</div>
				</form>
			</div>
			<div class="card-footer text-muted">
				<button type="submit" class="btn btn-primary">SAVE</button>
			</div>
		</div>
	</div>
	);
}