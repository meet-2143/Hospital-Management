import React, { useEffect, useState } from "react";
import { CButton, CButtonGroup, CCol, CContainer, CFormInput, CInputGroup, CInputGroupText, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass } from "@coreui/icons";
import { AppFooter, AppHeader, AppSidebar } from "src/components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { func } from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import Update_receptionist from "../Update_receptionist/Update_receptionist";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";

const Page404 = () => {
  const token = localStorage.getItem('Token');
  const UserId = localStorage.getItem('UserId');
  const role_id = localStorage.getItem('Role');
  console.log(UserId);
  console.log(token);
  if(token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
  const [data, setData] = useState([]);
  const navigate = useNavigate()
  if(UserId == 1){
    console.log("Admin User");
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/get_patient_data",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)
    });
  }, [])
}else if(role_id == 2){
  console.log("Doctor");
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_patient_data_by_doctor_id_as_doctor",
      headers: {
        Authorization: token,
      },
      data: {
        id:UserId
      }
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)
    });
  }, [])
}
else {
  console.log("Receptionist");
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_patient_data_by_doctor_id_as_receptionist",
      headers: {
        Authorization: token,
      },
      data: {
        id:UserId
      }
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)
    });
  }, [])
}
  let flag = 0;

  function handleDelete(id) {
    console.log(id);
    try {
      fetch('http://localhost:8080/user/delete_patient', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          id: id,
        }),
      })
      console.log(id);
    } catch (error) {
      console.log(error);
    }
    location.reload()
  }
  
  return (
    <div className="">
      {role_id === '1' && <AppSidebar />}
      {role_id === '2' && <AppSidebar_Doctor />}
      {role_id === '3' && <AppSidebar_Patient />}
      {role_id === '4' && <AppSidebar_Receptionist />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to={`/create_patient`}><button class="btn btn-primary me-md-2" type="button">Register Patient</button></Link>
        </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dieseas</CTableHeaderCell>
                <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((r, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>{r.first_name}</CTableDataCell>
                  <CTableDataCell>{r.last_name}</CTableDataCell>
                  <CTableDataCell>{r.mobile_number}</CTableDataCell>
                  <CTableDataCell>{r.dieseas}</CTableDataCell>
                  <CTableDataCell>{r.age}</CTableDataCell>
                  <CButtonGroup size="sm" role="group" aria-label="Small button group">
                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                      <button type="button" class="btn btn-outline-dark"> <Link to={`/Patient_data/update_Patient/${r.id}`} variant="outline" >Edit</Link></button>
                      <button type="button" class="btn btn-outline-dark"><Link to={`/Patient_data/update_Patient`} variant="outline" onClick={e => handleDelete(r.id)}>Delete</Link></button>
                    </div>
                  </CButtonGroup>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
        <AppFooter />
      </div>
      <ToastContainer />
    </div>
  );


};
export default Page404;
