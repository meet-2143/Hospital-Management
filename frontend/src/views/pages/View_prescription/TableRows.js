import { CFormInput } from "@coreui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
function TableRows({ rowsData, deleteTableRows, handleChange }) {
  const { id } = useParams()
  const [medication, setmedication] = useState("");
  const [route, setroute] = useState("");
  const [dosage_type, setdosage_type] = useState("");
  const [dosage, setdosage] = useState("");
  const Token = localStorage.getItem('Token')
  async function registers() {
    console.log(id, medication, route, dosage, dosage_type);
    const item = { id, medication, route, dosage, dosage_type }
    let result = await fetch("http://localhost:8080/user/create_prescription", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: Token,
      },
      body: JSON.stringify(item)
    })
    result = await result.json();
    console.log(result.message);
    if (result.status == 'success') {
      localStorage.setItem("users", JSON.stringify(result));
    }
    // notify(result.message);
    location.reload();
  }
  const [data, setData] = useState([]);
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/user/get_prescription_data",
      headers: {
        Authorization: Token,
      },
      data: {
        id: id,
      }
    }).then((response) => {
      console.log(response.data.items)
      setData(response.data.items)
    });
  }, [])
  const [users, setUsers] = useState([]);
  useEffect(function () {
    axios({
      method: "get",
      url: "http://localhost:8080/user/get_medicine_data",
      headers: {
        Authorization: Token,
      },
    }).then((response) => {
      console.log(response.data.items)
      setUsers(response.data.items);
    });
  }, []);
  return (
    rowsData.map((data, index) => {
      const { medication, route, dosage, dosage_type } = data;
      return (
        <tr key={index}>
          <td>
            <select onChange={(e) => setmedication(e.target.value)}>
              <option value="0">--Select Medication--</option>
              {
                users.map((user) => (
                  <option value={user.medicine}>{user.medicine}</option>
                ))
              }
            </select>
          </td>
          <td>
            <select onChange={(e) => setroute(e.target.value)}>
            <option value="">--Route--</option>
              <option value="Oral">Oral</option>
              <option value="Inject">Inject</option>
            </select>
          </td>
          <td>
            <select onChange={(e) => setdosage(e.target.value)}>
            <option value="">--Dosage--</option>
            <option value="Every 4 Hour">Every 4 Hour</option>
            <option value="Every 8 Hour">Every 8 Hour</option>
            <option value="Every 12 Hour">Every 12 Hour</option>
            <option value="Every 16 Hour">Every 16 Hour</option>
            <option value="Every 20 Hour">Every 20 Hour</option>
            <option value="Every 24 Hour">Every 24 Hour</option>
          </select>
          </td>
          <td>
            <select onChange={(e) => setdosage_type(e.target.value)}>
              <option value="">--Dosage Type--</option>
              <option value="Before Meal">Before Meal</option>
              <option value="After Meal">After Meal</option>
            </select>
             </td>
          <td><button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</button></td>
          <td><button className="btn btn-outline-danger" onClick={registers}>Add Medicine</button></td>
        </tr>
      )
    })
  )
}
export default TableRows;