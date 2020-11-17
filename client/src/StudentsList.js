import React from 'react';
import './App.css';
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import BootBox from 'react-bootbox';

import $ from 'jquery';

class StudentsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            loading: true,
            show: false
        };
        this.handleClose.bind(this);
    }

    showAlert = () => {
        alert('Yes is clicked');
    }

    /*handleClose = () => {
       
    }*/

    handleClose = function () {
        alert("Check")
        this.setState({ show: false })
    }

    async getStudentsData() {
        const res = await Axios.get("http://localhost:3001/Students");
        this.setState({ loading: false, students: res.data });
    }

    componentDidMount() {
        this.getStudentsData().then(() => this.syncTable());
    }

    redirectCall() {
        alert("hans")
    }

    alertFunction = function () {
        alert("Check");
    }

    syncTable() {
        this.$el = $(this.el);
        this.$el.DataTable({
            data: this.state.students,
            columns: [
                //{ title: "#", data: "SL"},
                { title: "First Name", data: "FIRST_NAME" },
                { title: "Last Name", data: "LAST_NAME" },
                { title: "Email Id", data: "EMAIL" },
                { title: "Date Of Birth", data: "DATE_FORMATTED" },
                { title: "AGE", data: "AGE" },
                { title: "Parent Name", data: "PARENT_NAME" },
                { title: "Parent Contact No", data: "PARENT_CONTACT_NO" },
                { title: "Action", data: "EDIT" }
            ],
            lengthMenu: [[5,10,15,-1], [5,10,15, "All"]]
        });
    }

    render() {
        return (
            <div className="container" style={{ 'max-width': '1400px' }}>
                <div class="col-sm-12 btn btn-secondary">
                    <h3 style={{ textAlign: 'center' }}> STUDENTS LIST</h3>
                </div>
                <br/><br/>
                    <table id="studentsList" className="display" ref={(el) => (this.el = el)}>
                    </table>
               
                <BootBox
                    message="Do you want to Continue?"
                    show={this.state.show}
                    onYesClick={this.showAlert}
                    onNoClick={this.handleClose}
                    onClose={this.handleClose} />
            </div>
        );    
    }
}
export default StudentsList;