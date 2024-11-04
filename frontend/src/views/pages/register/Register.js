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
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const Register = () => {
  const [first_name , setfirst_name] = useState("");
  const [last_name , setlast_name] = useState("");
  const [email , setemail] = useState("");
  const [mobile_number , setmobile_number] = useState("");
  const [password , setpassword] = useState("");

  async function registers(){
    const token = localStorage.getItem('Token');
 
  console.log(token);
  if(token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
    console.log(first_name , last_name , email , mobile_number, password);
    const item = {first_name , last_name , email , mobile_number, password}
    let result = await fetch("http://localhost:8080/user/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },  
      body:JSON.stringify(item)
    })
    result = await result.json();
    console.log(result);
    if(result.status == 'success'){
      localStorage.setItem("users" , JSON.stringify(result));
      Swal.fire(
        'Registered successfully',
        'You clicked the button!',
        result.status
      )
    }
    
    
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="First Name" autoComplete="username"  onChange={(e)=>setfirst_name(e.target.value)} name="first_name" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Last Name" autoComplete="Last name" onChange={(e)=>setlast_name(e.target.value)} name="last_name" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" onChange={(e)=>setemail(e.target.value)} name="email" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Mobile_Number" autoComplete="Mobile number" onChange={(e)=>setmobile_number(e.target.value)} name="mobile_number" />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput type="password" placeholder="Password" autoComplete="new-password" onChange={(e)=>setpassword(e.target.value)} name="password"/>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton  color="success" onClick={registers}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
