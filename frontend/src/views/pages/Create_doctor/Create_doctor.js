import React, { useState } from "react";
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
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";

const Register = () => {
  let Token = localStorage.getItem('Token')
  console.log(Token);
  if (Token) {

  }
  else {
    return (
      <h1>Unauthorized Access</h1>
    )
  }
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [mobile_number, setmobile_number] = useState("");
  const [password, setpassword] = useState("");
  const [degree, setdegree] = useState("");
  const [speciality, setspeciality] = useState("");
  const [education_College, seteducation_College] = useState("");
  const [experience, setexperience] = useState("");
  const [shift_start, setshift_start] = useState("");
  const [shift_end, setshift_end] = useState("");
  const [profile_image, setprofile_image] = useState("");
  const [validated, setValidated] = useState(false)
  const notify = (result) => toast(result);

  async function registers() {
    console.log(first_name, last_name, email, mobile_number, password, degree, speciality, education_College, shift_start, shift_end, experience,profile_image);
    const item = { first_name, last_name, email, mobile_number, password, degree, speciality, education_College, shift_start, shift_end, experience ,profile_image}
    let result = await fetch("http://localhost:8080/user/create_doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: Token,
      },
      body: JSON.stringify(item)
    })
    result = await result.json();
    console.log(result.message);
    if (result.status == 'success') {
      localStorage.setItem("users", JSON.stringify(result));
    }
    notify(result.message);
  }

  const handleSubmit = (event) => {
    console.log("Hello i am w");
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
            onSubmit={(e) => handleSubmit(e)}
          >
            <CRow className="mb-3">
              <CFormInput
                type="text"

                defaultValue="Mark"
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="First name"
                required
                name="first_name" onChange={(e) => setfirst_name(e.target.value)}
              />
            </CRow>
            <CFormInput
              type="text"
              defaultValue="Otto"
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
              id="validationCustom03"
              label="Mobile Number"
              required
              name="mobile_number" onChange={(e) => setmobile_number(e.target.value)}
            />
            <CFormInput
              type="password"
              aria-describedby="validationCustom05Feedback"
              feedbackInvalid="Please provide a valid zip."
              id="validationCustom05"
              label="Password"
              required
              name="password" onChange={(e) => setpassword(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Degree ."
              id="validationCustom03"
              label="Degree"
              required
              onChange={(e) => setdegree(e.target.value)} name="degree"
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Speciality."
              id="validationCustom03"
              label="Specialist"
              required
              name="speciality" onChange={(e) => setspeciality(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid education College."
              id="validationCustom03"
              label="Education College"
              required
              name="education_College" onChange={(e) => seteducation_College(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Experience."
              id="validationCustom03"
              label="Experience "
              required
              name="experience" onChange={(e) => setexperience(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              id="validationCustom03"
              label="Shift Start"
              required
              name="shift_start" onChange={(e) => setshift_start(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              id="validationCustom03"
              label="Shift end"
              required
              name="shift_end" onChange={(e) => setshift_end(e.target.value)}
            />
            <div class="input-group">
              <input type="file" class="form-control" id="inputGroupFile04" onChange={(e) => setprofile_image(e.target.value)} aria-describedby="inputGroupFileAddon04" aria-label="Upload"></input>
                <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">Button</button>
            </div>
            <CButton color="primary" onClick={registers} className="px-4" >
              Register Doctor
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
