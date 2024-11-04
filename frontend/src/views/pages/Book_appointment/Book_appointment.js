import React, { useEffect, useState } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CFormSelect,
    CRow,
    CFormLabel,
    CFormCheck,
    CFormFeedback,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { AppFooter, AppHeader, AppSidebar, DocsExample } from "src/components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { FormCheck } from "react-bootstrap";
import axios from "axios";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import timepicker from 'react-time-picker';  

const Register = () => {
    let Token = localStorage.getItem('Token')
    const UserId = localStorage.getItem('UserId')
    if (Token) {

    }
    else {
        return (
            <h1>Unauthorized Access</h1>
        )
    }
    const [note, setnote] = useState("");   
    const [appointment_time , setappointment_time ] = useState("");
    const [dieseas  , setdieseas  ] = useState("");
    const [doctor_id  , setdoctor_id  ] = useState("");
    const [validated, setValidated] = useState(false)
    const [appointment_Date, setappointment_Date] = useState(new Date());
    const notify = () => toast("Appointment Booked Successfully");
    const patient_id = UserId
    async function registers() {
        console.log(appointment_Date,appointment_time,doctor_id ,patient_id,dieseas,note  );
        const item = { appointment_Date,appointment_time,doctor_id ,patient_id,dieseas,note };
        let result = await fetch("http://localhost:8080/user/book_appointment", {
            method: "post",
            headers: {
                Authorization: Token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        })
        result = await result.json();
        console.log(result);
        if (result.status == 'success') {
            localStorage.setItem("users", JSON.stringify(result));
            notify();
        }
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }
    const [users, setUsers] = useState([]);

    useEffect(function () {
        axios({
            method: "get",
            url: "http://localhost:8080/user/get_doctor_data",
            headers: {
                Authorization: Token,
            },
        }).then((response) => {
            console.log(response.data.items)
            setUsers(response.data.items);
        });
    }, []);
    const role_id = localStorage.getItem('Role');
    return (
        <div>
            {role_id === '1' && <AppSidebar />}
            {role_id === '2' && <AppSidebar_Doctor />}
            {role_id === '3' && <AppSidebar_Patient />}
            {role_id === '4' && <AppSidebar_Receptionist />}
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader />
                <div className=" px-5">                   
                </div>
                <div className="body flex-grow-1 px-3">
                    <CForm
                        className="row g-3 needs-validation"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <CRow className="mb-3">
                        <label>Choose a Date</label>
                        <DatePicker
                            showIcon
                            selected={appointment_Date}
                            onChange={(date) => setappointment_Date(date)}
                        />
                    </CRow>
                    <CRow className="mb-3"></CRow>
                        <CRow className="mb-3">
                            <CFormInput
                                type="text"
                                defaultValue=""
                                feedbackValid="Looks good!"
                                id="validationCustom01"
                                label="Time"
                                required
                                name="appointment_time" onChange={(e) => setappointment_time(e.target.value)}
                            />
                        </CRow>
                        <CFormInput
                            type="text"
                            aria-describedby="validationCustom05Feedback"
                            feedbackInvalid="Please provide a valid zip."
                            id="validationCustom05"
                            label="Dieseas"
                            required
                            name="dieseas " onChange={(e) => setdieseas (e.target.value)}
                        />
                        <CFormInput
                            type="text"
                            aria-describedby="validationCustom05Feedback"
                            feedbackInvalid="Please provide a valid zip."
                            id="validationCustom05"
                            label="Note"
                            required
                            name="note " onChange={(e) => setnote (e.target.value)}
                        />
                        <label>Select Doctor</label>
                        <select onChange={(e) => setdoctor_id(e.target.value)}>
                            <option value="0">---SELECT DOCTOR---</option>
                            {

                                users.map((user) => (
                                    <option value={user.id}>{user.first_name}</option>
                                ))
                            }
                        </select>
                        <CRow className="mb-3"></CRow>
                        <CButton color="primary" className="px-4" onClick={registers}>
                            Book Appointment
                        </CButton>
                    </CForm>
                </div>
                <AppFooter />
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
