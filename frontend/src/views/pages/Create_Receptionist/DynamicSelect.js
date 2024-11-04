import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DynamicSelect = () => {
    const [ users ,setUsers] = useState([]);
    const token = JSON.parse(localStorage.getItem('Token'));
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
  return (
    <select>
        <option value="0">---SELECT DOCTOR---</option>  
        {
           
            users.map((user)=>(
                <option value={user.id}>{user.first_name}</option>           
            ))
        }
    </select>
  )
}

export default DynamicSelect