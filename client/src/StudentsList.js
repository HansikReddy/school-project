import React from 'react';
import './App.css';
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

class StudentsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            loading: true
        };
    }

    async getStudentsData() {
        const res = await Axios.get("http://localhost:3001/Students");
        this.setState({ loading: false, students: res.data });
    }

    componentDidMount() {
        this.getStudentsData().then(() => this.syncTable());
    }

    redirectCall() {
        alert("Sheik")
    }

    syncTable() {
        this.$el = $(this.el);
        this.$el.DataTable({
            data: this.state.students,
            columns: [
                { title: "First Name", data: "FIRST_NAME" },
                { title: "Last Name", data: "LAST_NAME" },
                { title: "Email Id", data: "EMAIL" },
                { title: "Date Of Birth", data: "DOB" },
                { title: "Parent Name", data: "PARENT_NAME" },
                { title: "Parent Contact No", data: "PARENT_CONTACT_NO" },
                { title: "Action", data: "EDIT" },
            ]
        });
    }

    render() {
        return (
            <div className="MainDiv">
                <div className="jumbotron text-center bg-sky">
                    <h3>Students List</h3>
                </div>

                <div className="container">
                    <table id="studentsList" className="display" ref={(el) => (this.el = el)}>
                    </table>
                </div>
            </div>
        );     
    }
}
export default StudentsList;