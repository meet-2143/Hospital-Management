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
 
  console.log(token);
  if(token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
    const {id} = useParams()    
    const [ values , setValues] = useState({
        id:id,
        first_name : '',
        last_name: '',
        email:'',
        mobile_number:'',
        shift_start:'',
        shift_end:'',
        speciality:'',
        experience:'',
        degree:'',
        education_College:'',
    })
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
  const [validated, setValidated] = useState(false)
  const notify = () => toast("Doctor Edited Successfully");    
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_doctor_data_by_id",
      headers: {
        Authorization: token,
      },
      data: {
        id:id
      }
    }).then((response) => {
        console.log(response.data);
        console.log(response.data.items.last_name);
        setfirst_name(response.data.items.first_name);
        setlast_name(response.data.items.last_name);
        setemail(response.data.items.email);
        setmobile_number(response.data.items.mobile_number);
        setdegree(response.data.items.degree);
        setspeciality(response.data.items.speciality);
        seteducation_College(response.data.items.education_College);
        setexperience(response.data.items.experience);
        setshift_end(response.data.items.shift_end);
        setshift_start(response.data.items.shift_start);
        setValues({...values, first_name:response.data.items.first_name, 
            last_name:response.data.items.last_name,
            email:response.data.items.email,
            mobile_number:response.data.items.mobile_number,
            speciality:response.data.items.speciality,
            shift_end:response.data.items.shift_end,
            shift_start:response.data.items.shift_start,
            experience:response.data.items.experience,
            education_College:response.data.items.education_College,
            degree:response.data.items.degree
        })
        console.log(values)
    });
  }, [])  
  const preLoadedValues = {
    first_name:values.first_name ,
    last_name:values.first_name,
    email:values.first_name,
    mobile_number:values.mobile_number,
    speciality:values.first_name,
    shift_end:values.first_name,
    shift_start:values.first_name,
    experience:values.first_name,
    education_College:values.first_name,
    degree:values.first_name

  }
  const {register , handleSubmit} = useForm({
    defaultValues:preLoadedValues
  })
  async function registers() {
    // console.log(first_name, last_name, email, mobile_number, degree, speciality, education_College, shift_start, shift_end, experience);
    const item = { id,first_name, last_name, email, mobile_number, degree, education_College, experience, speciality, shift_start, shift_end }
    console.log(item);
    let result = await fetch("http://localhost:8080/user/updateDoctorProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
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
  const handleSubmits = (event) => {
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
            // onSubmit={handleSubmit}
          >
            <CRow className="mb-3">
              <CFormInput
                type="text"
                defaultValue={values.first_name}
                // key={values.first_name}
                // ref={register}
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="First name"
                required
                name="first_name" 
                onChange={(e) => setfirst_name(e.target.value)}
              />
            </CRow>
            <CFormInput
              type="text"
              defaultValue={values.last_name}
              // key={values.last_name}
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
              feedbackInvalid="Please provide a valid Degree ."
              defaultValue={values.degree}
              id="validationCustom03"
              label="Degree"
              required
              onChange={(e) => setdegree(e.target.value)} name="degree"
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Speciality."
              defaultValue={values.speciality}
              id="validationCustom03"
              label="Specialist"
              required
              name="speciality" onChange={(e) => setspeciality(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid education College."
              defaultValue={values.education_College}
             
              id="validationCustom03"
              label="Education College"
              required
              name="education_College" onChange={(e) => seteducation_College(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Please provide a valid Experience."
              defaultValue={values.experience}
         
              id="validationCustom03"
              label="Experience "
              required
              name="experience" onChange={(e) => setexperience(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              defaultValue={values.shift_start}
          
              id="validationCustom03"
              label="Shift Start"
              required
              name="shift_start" onChange={(e) => setshift_start(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              defaultValue={values.shift_end}
          
              id="validationCustom03"
              label="Shift end"
              required
              name="shift_end" onChange={(e) => setshift_end(e.target.value)}
            />
            <CButton color="primary" className="px-4" onClick={registers}>
              Update Doctor
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
