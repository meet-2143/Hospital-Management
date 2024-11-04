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
import { useParams } from "react-router";
import axios from "axios";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";

const Update = () => {
  const token = localStorage.getItem('Token');


  if (token) {

  }
  else {
    return (
      <h1>Unauthorized Access</h1>
    )
  }
  const { id } = useParams()
  console.log(id);
  const [values, setValues] = useState({
    id: id,
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    age: '',
    gender: '',
    dieseas: '',
    insurance_id: '',
    insurance_company: '',
    doctor_id: '',

  })
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [mobile_number, setmobile_number] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [dieseas, setdieseas] = useState("");
  const [insurance_id, setinsurance_id] = useState("");
  const [insurance_company, setinsurance_company] = useState("");
  const [doctor_id, setdoctor_id] = useState("");
  const [validated, setValidated] = useState(false)
  const notify = () => toast("Patient Edited Successfully");
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_patient_data_by_id",
      headers: {
        Authorization: token,
      },
      data: {
        id: id
      }
    }).then((response) => {
      console.log(response);
      console.log(response.data.items.last_name);
      setfirst_name(response.data.items.first_name);
      setlast_name(response.data.items.last_name);
      setemail(response.data.items.email);
      setmobile_number(response.data.items.mobile_number);
      setage(response.data.items.age);
      setgender(response.data.items.gender);
      setdieseas(response.data.items.dieseas);
      setinsurance_id(response.data.items.insurance_id);
      setinsurance_company(response.data.items.insurance_company);
      setdoctor_id(response.data.items.doctor_id);
      setValues({
        ...values, first_name: response.data.items.first_name,
        last_name: response.data.items.last_name,
        email: response.data.items.email,
        mobile_number: response.data.items.mobile_number,
        age: response.data.items.age,
        gender: response.data.items.gender,
        dieseas: response.data.items.dieseas,
        insurance_id: response.data.items.insurance_id,
        insurance_company: response.data.items.insurance_company,
        doctor_id: response.data.items.doctor_id,
      })
      console.log(values)
    });
  }, [])
  async function registers() {
    console.log(first_name, last_name, email, mobile_number, age, gender, dieseas, insurance_id, insurance_company, doctor_id);
    const item = { id, first_name, last_name, email, mobile_number, age, gender, dieseas, insurance_id, insurance_company, doctor_id }
    let result = await fetch("http://localhost:8080/user/updatePatientProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: token,
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
  const [users, setUsers] = useState([]);
  useEffect(function () {
    axios({
      method: "get",
      url: "http://localhost:8080/user/get_doctor_data",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      console.log(response.data.items)
      setUsers(response.data.items);
    });
  }, []);
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  const role_id = localStorage.getItem('Role');
  return (
    <div>
      {role_id === '1' && <AppSidebar />}
      {role_id === '2' && <AppSidebar_Doctor />}
      {role_id === '3' && <AppSidebar_Patient />}
      {role_id === '4' && <AppSidebar_Receptionist />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CRow className="mb-3">
              <CFormInput
                type="text"
                defaultValue={values.first_name}
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="First name"
                required
                name="first_name" onChange={(e) => setfirst_name(e.target.value)}
              />
            </CRow>
            <CFormInput
              type="text"
              defaultValue={values.last_name}
              feedbackValid="Looks good!"
              id="validationCustom02"
              label="Last Name"
              required
              name="last_name" onChange={(e) => setlast_name(e.target.value)}
            />
            <CFormLabel htmlFor="validationCustomUsername">Email</CFormLabel>
            <CInputGroup className="has-validation">
              <CInputGroupText>@</CInputGroupText>
              <CFormInput
                type="text"
                aria-describedby="inputGroupPrependFeedback"
                defaultValue={values.email}
                feedbackValid="Please choose a email."
                id="validationCustomUsername"
                required
                name="email" onChange={(e) => setemail(e.target.value)}
              />
            </CInputGroup>
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.mobile_number}
              id="validationCustom03"
              label="Mobile Number"
              required
              name="mobile_number" onChange={(e) => setmobile_number(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.age}
              id="validationCustom03"
              label="age"
              required
              name="age" onChange={(e) => setage(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.gender}
              id="validationCustom03"
              label="gender"
              required
              name="gender" onChange={(e) => setgender(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.dieseas}
              id="validationCustom03"
              label="dieseas"
              required
              name="dieseas" onChange={(e) => setdieseas(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.insurance_id}
              id="validationCustom03"
              label="insurance_id"
              required
              name="insurance_id" onChange={(e) => setinsurance_id(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Mobile Number."
              defaultValue={values.insurance_company}
              id="validationCustom03"
              label="insurance_company"
              required
              name="insurance_company" onChange={(e) => setinsurance_company(e.target.value)}
            />
            <label>Select Doctor</label>
            <select onChange={(e) => setdoctor_id(e.target.value)}>
              <option value="0">--Select Doctor--</option>
              {
                users.map((user) => (
                  <option value={user.id}>{user.first_name}</option>
                ))
              }
            </select>
            <br />
            <CButton color="primary" className="px-4" onClick={registers}>
              Update Receptionist
            </CButton>
          </CForm>
        </div>
        <AppFooter />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Update;
