import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { useForm } from 'react-hook-form';
import { Button } from "react-bootstrap";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const navigate = useNavigate();
  const {register  , formState:{errors} , handleSubmit , } = useForm();
  const onSubmit = (data) =>{
    console.log(data)
  }
  async function LoginApi() {
    const item = { email, password };
    console.log(item);
    let result = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    });
    result = await result.json();
    // console.log(result.user.id);  
    if(result.status == 'success'){
      navigate('/dashboard');
      localStorage.setItem('Token' , result.token)
      localStorage.setItem('Role' , result.user.role_id)
      localStorage.setItem('UserId' , result.user.id)
    }
    else{
      console.log(result.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
      })
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput  placeholder="email"  autoComplete="email" name="email" {...register("email" , {required:true })}   onChange = {(e)=>setemail(e.target.value)}/>
                      <error>
                        {errors.email?.type === 'required' && "Email is required"}
                      </error>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput type="password" placeholder="Password" {...register("password" , {required:true })} autoComplete="current-password" name="password" onChange = {(e)=>setpassword(e.target.value)}/>
                      <error>
                        {errors.password?.type === 'required' && "Password is required"}
                      </error>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={LoginApi}>
                          Login
                        </CButton>
                        <div id="error"></div>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0" >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: "44%" }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;