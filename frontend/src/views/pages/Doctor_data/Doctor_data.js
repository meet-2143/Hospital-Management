import React, { useEffect, useState } from "react";
import { CButton, CButtonGroup, CCol, CContainer, CFormInput, CInputGroup, CInputGroupText, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass } from "@coreui/icons";
import { AppFooter, AppHeader, AppSidebar } from "src/components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { func } from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import update_doctor from "../Update_doctor/update_doctor";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";
const Page404 = () => {
  const token = localStorage.getItem('Token');

  console.log(token);
  if (token) {

  }
  else {
    return (
      <h1>Unauthorized Access</h1>
    )
  }
  const [data, setData] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/get_doctor_data",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)
    });
  }, [])
  let flag = 0;

  function handleDelete(id) {
    try {
      fetch('http://localhost:8080/user/delete_chemist', {
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
  const role_id = localStorage.getItem('Role');
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
          <Link to={`/register`}><button class="btn btn-primary me-md-2" type="button">Register Doctor</button></Link>
        </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Shift start</CTableHeaderCell>
                <CTableHeaderCell scope="col">Shift end</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>

              {data.map((r, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>{r.first_name}</CTableDataCell>
                  <CTableDataCell>{r.last_name}</CTableDataCell>
                  <CTableDataCell>{r.mobile_number}</CTableDataCell>
                  <CTableDataCell>{r.shift_start}</CTableDataCell>
                  <CTableDataCell>{r.shift_end}</CTableDataCell>
                  <CButtonGroup size="sm" role="group" aria-label="Small button group">
                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                      <button type="button" class="btn btn-outline-dark"> <Link to={`/doctor_data/update_doctor/${r.id}`} variant="outline" >Edit</Link></button>
                      <button type="button" class="btn btn-outline-dark"><Link to={`/doctor_data/update_doctor`} variant="outline" onClick={e => handleDelete(r.id)}>Delete</Link></button>
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
