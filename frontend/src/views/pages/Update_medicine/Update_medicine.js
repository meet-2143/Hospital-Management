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
        content:'',
        medicine:'',
    })
  const [content, setcontent] = useState("");
  const [medicine, setmedicine] = useState("");
 
  const [validated, setValidated] = useState(false)
  const notify = () => toast("Medicine Edited Successfully");    
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_medicine_data_by_id",
      headers: {
        Authorization: token,
      },
      data: {
        id:id
      }
    }).then((response) => {
        console.log(response);
        console.log(response.data.items.last_name);
        setcontent(response.data.items.content);
        setmedicine(response.data.items.medicine);
      
        setValues({...values, medicine:response.data.items.medicine, 
            content:response.data.items.content,
        })
        console.log(values)
    });
  }, [])  
  async function registers() {
    console.log(content,medicine);
    const item = { id ,content,medicine }
    let result = await fetch("http://localhost:8080/user/updateMedicineProfile", {
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
                defaultValue={values.content}
                feedbackValid="Looks good!"
                id="validationCustom01"
                label="Content"
                required
                name="content" onChange={(e) => setcontent(e.target.value)}
              />
            </CRow>
            <CFormInput
              type="text"
              defaultValue={values.medicine}
              feedbackValid="Looks good!"
              id="validationCustom02"
              label="Medicine"
              required
              name="medicine" onChange={(e) => setmedicine(e.target.value)}
            />
            <br />
            <CButton color="primary" className="px-4" onClick={registers}>
              Update Medicine
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
