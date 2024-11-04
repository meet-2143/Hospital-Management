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
import AppSidebar_Chemist from "src/components/AppSidebar_Chemist";
const Page404 = () => {
  const token = localStorage.getItem('Token');
  const UserId = localStorage.getItem('UserId');
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
      method: "post",
      url: "http://localhost:8080/user/get_pending_appointment_data_by_doctor_id",
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
  let flag = 0;
  function handleApprove(id) {
    try {
      fetch('http://localhost:8080/user/Checked_pending_appointment_data', {
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
  //call me plz
  function handleDecline(id) {
    try {
      fetch('http://localhost:8080/user/Decline_pending_appointment_datax`', {
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
      {role_id === '5' && <AppSidebar_Chemist />}

      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />

        <div className="body flex-grow-1 px-3">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to={`/register`}><button class="btn btn-primary me-md-2" type="button">Register Doctor</button></Link>
        </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Patient First Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Patient Last Name</CTableHeaderCell>                
                <CTableHeaderCell scope="col">dieseas</CTableHeaderCell>
                <CTableHeaderCell scope="col">appointment_Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">appointment_time</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>

              {data.map((r, i) => (
                <CTableRow key={i}>
                     
                  <CTableDataCell>{r.first_name}</CTableDataCell>
                  <CTableDataCell>{r.last_name}</CTableDataCell>
                  <CTableDataCell>{r.dieseas}</CTableDataCell>
                  <CTableDataCell>{r.appointment_Date}</CTableDataCell>
                  <CTableDataCell>{r.appointment_time}</CTableDataCell>
                  <CButtonGroup size="sm" role="group" aria-label="Small button group">
                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                    <button type="button" class="btn btn-outline-dark"> <Link to={`/view_history/${r.id}`} variant="outline" onClick={e => viewhistory(r.id)}>View History</Link></button>
                      <button type="button" class="btn btn-outline-dark"> <Link to={`/doctor_data/update_doctor/${r.id}`} variant="outline" onClick={e => handleApprove(r.id)}>Checked</Link></button>
                      <button type="button" class="btn btn-outline-dark"> <Link to={`/doctor_appointment/prescription/${r.id}`} variant="outline" >Prescribe</Link></button>
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
