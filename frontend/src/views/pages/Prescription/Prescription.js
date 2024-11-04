import React, { useEffect, useState } from "react";
import { CButton, CButtonGroup, CCol, CContainer, CFormInput, CInputGroup, CInputGroupText, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass } from "@coreui/icons";
import { AppFooter, AppHeader, AppSidebar } from "src/components";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { func } from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import update_doctor from "../Update_doctor/update_doctor";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";
import TableRows from "./TableRows"
import AppSidebar_Chemist from "src/components/AppSidebar_Chemist";
const Page404 = () => {
  const token = localStorage.getItem('Token');
  const {id} = useParams();
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
      method: "POST",
      url: "http://localhost:8080/user/get_prescription_data",
      headers: {
        Authorization: token,
      },
      data: {
        id:id
      }
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)

    });
  }, [])
  let flag = 0;

  function handleDelete(id) {
    try {
      fetch('http://localhost:8080/user/delete_prescription', {
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

  const [rowsData, setRowsData] = useState([]);
 
  const addTableRows = ()=>{

      const rowsInput={
          medication:'',
          route:'',
          dosage:''  ,
          dosage_type:'',
      } 
      setRowsData([...rowsData, rowsInput])
    
  }
 const deleteTableRows = (index)=>{
      const rows = [...rowsData];
      rows.splice(index, 1);
      setRowsData(rows);
 }
 const handleChange = (index, evnt)=>{
  
  const { name, value } = evnt.target;
  const rowsInput = [...rowsData];
  rowsInput[index][name] = value;
  setRowsData(rowsInput);
 }


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
        </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Medication</CTableHeaderCell>
                <CTableHeaderCell scope="col">Route</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dosage</CTableHeaderCell>
                <CTableHeaderCell scope="col">DosageType</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
                <CTableHeaderCell scope="col"><button className="btn btn-outline-success" onClick={addTableRows} >+</button></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((r, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>{r.medication}</CTableDataCell>
                  <CTableDataCell>{r.route}</CTableDataCell>
                  <CTableDataCell>{r.dosage}</CTableDataCell>
                  <CTableDataCell>{r.dosage_type}</CTableDataCell>              
                  <CButtonGroup size="sm" role="group" aria-label="Small button group">
                    <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                      <button type="button" class="btn btn-outline-dark"><Link to={`/doctor_data/update_doctor`} variant="outline" onClick={e => handleDelete(r.id)}>Delete</Link></button>
                    </div>
                  </CButtonGroup> 
                </CTableRow>
              ))}
                 <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
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
