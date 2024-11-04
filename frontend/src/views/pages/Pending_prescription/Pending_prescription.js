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
  const [patient_id , setpatient_id] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_pending_appointment_data",
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
      fetch('http://localhost:8080/user/Approve_pending_appointment_data', {
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

  const [users, setUsers] = useState([]);
  useEffect(function () {
    axios({
      method: "get",
      url: "http://localhost:8080/user/get_pending_prescription_Patient_data_for_chemist",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      console.log(response.data.items)
      setUsers(response.data.items);
    });
  }, []);
  let length = users.length;

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
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow>
            <CTableHeaderCell scope="col">
            <select >
              <option value="0">--Select Patient--</option>
              {
                users.map((user) => (
                  <option value={user[0].id}>{user[0].first_name}</option>
                ))
              }
            </select>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
            <select onChange={(e) => setpatient_id(e.target.value)}>
              <option value="0">--Select Patient--</option>
              {
                users.map((user) => (
                  <option value={user[0].id}>{user[0].last_name}</option>
                ))
              }
            </select>
            </CTableHeaderCell>
            <CTableHeaderCell><Link to={`/view_prescription/${patient_id}`}>View Prescription</Link></CTableHeaderCell>
            </CTableRow>
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
