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
  if(Token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
  const [content, setcontent] = useState("");
  const [medicine, setmedicine] = useState("");
  const [validated, setValidated] = useState(false)
  const notify = (result) => toast(result);

  async function registers() {
    console.log(content, medicine);
    const item = { content, medicine }
    let result = await fetch("http://localhost:8080/user/create_medicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization : Token,
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
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="Content"
                required
                name="content" onChange={(e) => setcontent(e.target.value)}
              />
            </CRow>
            <CFormInput
              type="text"
              feedbackValid="Looks good!"
              id="validationCustom02"
              label="Medicine"
              required
              name="medicine" onChange={(e) => setmedicine(e.target.value)}
            />
            <CButton color="primary" onClick={registers} className="px-4" >
              Register Medicine
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
