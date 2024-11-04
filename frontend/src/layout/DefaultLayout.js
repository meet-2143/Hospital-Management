import React from "react";
import { AppContent, AppSidebar, AppFooter, AppHeader } from "../components/index";
import { ToastContainer, toast } from "react-toastify";
import AppSidebar_Doctor from "src/components/AppSidebar_Doctor";
import AppSidebar_Patient from "src/components/AppSidebar_Patient";
import AppSidebar_Receptionist from "src/components/AppSidebar_Receptionist";
import AppSidebar_Chemist from "src/components/AppSidebar_Chemist";

const DefaultLayout = () => {
  let Token = localStorage.getItem('Token')
  
  if(Token){
    
  }
  else{
    return(
      <h1>Unauthorized Access</h1>
    )
  }
  const role_id = localStorage.getItem('Role');
  return (
    <div>
      {role_id === '1' && <AppSidebar />}
      {role_id === '2' && <AppSidebar_Doctor />}
      {role_id === '3' && <AppSidebar_Patient />}
      {role_id === '4' && <AppSidebar_Receptionist />}
      {role_id === '5' && <AppSidebar_Chemist />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <ToastContainer/>
    </div>
  );
};

export default DefaultLayout;
