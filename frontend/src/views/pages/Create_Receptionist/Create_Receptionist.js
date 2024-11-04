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
import DynamicSelect from "./DynamicSelect";
import axios from "axios";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";

const create_receptionist = () => {
  let Token = localStorage.getItem('Token')
  console.log(Token);
  if(Token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [mobile_number, setmobile_number] = useState("");
  const [password, setpassword] = useState("");
  const [degree, setdegree] = useState("");
  const [experience, setexperience] = useState("");
  const [shift_start, setshift_start] = useState("");
  const [shift_end, setshift_end] = useState("");
  const [aadhar_card, setaadhar_card] = useState("");
  const [address, setaddress] = useState("");
  const [doctor_id, setdoctor_id] = useState("");
  const [companyName, setCompanyName] = useState("")
  const [doctor_detail, setCompanyList] = useState([{'name':'','id':''}])

  const [validated, setValidated] = useState(false)
  const notify = (result) => toast(result);

  const handleChange = (event) =>{
    setCompanyName(event.target.value);
}
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/user/get_doctor_data`);
      const newData = await response.json();
      setCompanyList(newData);
      // console.log(newData);
    };
    fetchData();
  }, [])

  async function registers() {
    console.log(first_name, last_name, email, mobile_number, password, degree, shift_start, shift_end, experience, address, aadhar_card, doctor_id);
    const item = { first_name, last_name, email, mobile_number, password, degree, shift_start, shift_end, experience, address, aadhar_card, doctor_id }
    let result = await fetch("http://localhost:8080/user/create_receptionist", {
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
      
    }
    notify(result.message);
  }
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  const [ users ,setUsers] = useState([]);
 
  useEffect(function()  {
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
  } , []);
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
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              id="validationCustom03"
              label="address"
              required
              name="address"
              onChange={(e) => setaddress(e.target.value)}
            />
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              id="validationCustom03"
              label="Aadhar"
              required
              name="Aadhar"
              onChange={(e) => setaadhar_card(e.target.value)}
            />
            <label>Select Doctor</label>
            <select onChange={(e) => setdoctor_id(e.target.value)}>
        <option value="0">---SELECT DOCTOR---</option>  
        {
           
            users.map((user)=>(
                <option value={user.id}>{user.first_name}</option>           
            ))
        }
    </select>
            <CButton color="primary" className="px-4" onClick={registers}>
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

export default create_receptionist;
