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
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";
import axios from "axios";
const Update = () => {
  const token = localStorage.getItem('Token');
 
 
  if(token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
    const {id} = useParams()   
    console.log(id); 
    const [ values , setValues] = useState({
        id:id,
        first_name : '',
        last_name: '',
        email:'',
        mobile_number:'',
        degree:'',
        experience:'',
        address:'',
        aadhar_card:'',
        doctor_id:'',
        shift_start:'',
        shift_end:'',
    })
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [mobile_number, setmobile_number] = useState("");
  const [degree, setdegree] = useState("");
  const [experience, setexperience] = useState("");
  const [shift_start, setshift_start] = useState("");
  const [shift_end, setshift_end] = useState("");
  const [aadhar_card, setaadhar_card] = useState("");
  const [address, setaddress] = useState("");
  const [doctor_id, setdoctor_id] = useState("");

  const [validated, setValidated] = useState(false)
  const notify = () => toast("Receptionist Edited Successfully");    
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_receptionist_data_by_id",
      headers: {
        Authorization: token,
      },
      data: {
        id:id
      }
    }).then((response) => {
        console.log(response);
        console.log(response.data.items.last_name);
        setfirst_name(response.data.items.first_name);
        setlast_name(response.data.items.last_name);
        setemail(response.data.items.email);
        setmobile_number(response.data.items.mobile_number);
        setdegree(response.data.items.degree);
        setexperience(response.data.items.experience);
        setshift_start(response.data.items.shift_start);
        setshift_end(response.data.items.shift_end);
        setaddress(response.data.items.address);
        setaadhar_card(response.data.items.aadhar_card);
        setdoctor_id(response.data.items.doctor_id);
        
        setValues({...values, first_name:response.data.items.first_name, 
            last_name:response.data.items.last_name,
            email:response.data.items.email,
            mobile_number:response.data.items.mobile_number,
            shift_end:response.data.items.shift_end,
            shift_start:response.data.items.shift_start,
            experience:response.data.items.experience,
            degree : response.data.items.degree,
            aadhar_card : response.data.items.aadhar_card,
            address : response.data.items.address,
            doctor_id : response.data.items.doctor_id,
            
        })
        console.log(values)
    });
  }, [])  
  async function registers() {
    console.log(first_name, last_name, email, mobile_number, degree,experience,shift_end,shift_start,address,aadhar_card,doctor_id);
    const item = { id,first_name, last_name, email, mobile_number, degree, experience,shift_end,shift_start,address,aadhar_card,doctor_id}
    let result = await fetch("http://localhost:8080/user/updateReceptionistProfile", {
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
  const [ users ,setUsers] = useState([]);
 
  useEffect(function()  {
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
  } , []);
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
            <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              defaultValue={values.aadhar_card}
              id="validationCustom03"
              label="Aadhar Card"
              required
              name="aadhar_card" onChange={(e) => setaadhar_card(e.target.value)}
            />
             <CFormInput
              type="text"
              aria-describedby="validationCustom03Feedback"
              feedbackInvalid="Required."
              defaultValue={values.address}
              id="validationCustom03"
              label="Address"
              required
              name="address" onChange={(e) => setaddress(e.target.value)}
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
