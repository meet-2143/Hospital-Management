import React, { Component, Suspense } from "react";
import { HashRouter, Route, Routes, BrowserRouter } from "react-router-dom";
import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/Create_doctor/Create_doctor"));
const Page404 = React.lazy(() => import("./views/pages/Doctor_data/Doctor_data"));
const Create_Receptionist = React.lazy(() => import("./views/pages/Create_Receptionist/Create_Receptionist"));
const Create_Chemist = React.lazy(() => import("./views/pages/Create_chemist/Create_chemist"));
const Create_patient = React.lazy(() => import("./views/pages/Create_patient/Create_patient"));
const ReceptionistData = React.lazy(()=> import("./views/pages/Receptionist_data/Receptionist_data"))
const Patient_data = React.lazy(()=> import("./views/pages/Patient_data/Patient_data"))
const Chemist_data = React.lazy(()=> import("./views/pages/Chemist_data/Chemist_data"))
const Update_receptionist = React.lazy(()=> import("./views/pages/Update_receptionist/Update_receptionist"))
const Update_patient = React.lazy(()=> import("./views/pages/Update_patient/Update_patient"))
const Book_appointment = React.lazy(()=> import("./views/pages/Book_appointment/Book_appointment.js"))
const Pending_appointments = React.lazy(()=> import("./views/pages/pending_appointments/Pending_appointments.js"))
const Pending_prescription = React.lazy(()=> import("./views/pages/Pending_prescription/Pending_prescription.js"))
const Doctor_appointments = React.lazy(()=> import("./views/pages/Appointment_for_doctor/Appointment_for_doctor.js"))
const Medicine_data = React.lazy(()=> import("./views/pages/Medicine_data/Medicine_data.js"))
const Create_medicine = React.lazy(()=> import("./views/pages/Create_medicine/Create_medicine"))
const Update_medicine = React.lazy(()=> import("./views/pages/Update_medicine/Update_medicine"))
const Update_chemist = React.lazy(()=> import("./views/pages/Update_chemist/Update_chemist"))
// const Doctors = react.lazy(()=> import("./views/pages/Doctors/doctors"))
const Update_doctor = React.lazy(()=>import("./views/pages/Update_doctor/update_doctor"))
const View_prescription = React.lazy(()=>import("./views/pages/View_prescription/View_prescription"))
const Prescription = React.lazy(()=>import("./views/pages/Prescription/Prescription"))
const Patient_history = React.lazy(()=>import("./views/pages/Patient_history/Patient_history"))
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/*" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/book_appointment" name="Register Page" element={<Book_appointment />} />
            <Route exact path="/doctor_data" name="Page 404" element={<Page404 />} />
            <Route exact path="/receptionist_data" name="Page 404" element={<ReceptionistData />} />
            <Route exact path="/Patient_data" name="Page 404" element={<Patient_data />} />
            <Route exact path="/Chemist_data" name="Page 404" element={<Chemist_data />} />
            <Route exact path="/receptionist_data/update_receptionist/:id" name="Update Receptionist" element={<Update_receptionist />} />
            <Route exact path="/Patient_data/update_patient/:id" name="Update patient" element={<Update_patient />} />
            <Route exact path="/Chemist_data/update_chemist/:id" name="Update patient" element={<Update_chemist />} />
            <Route exact path="/doctor_data/update_doctor/:id" name="Update Doctor" element={<Update_doctor />} />
            <Route exact path="/create_receptionist" name="Page 500" element={<Create_Receptionist />} />
            <Route exact path="/create_patient" name="Page 500" element={<Create_patient />} />
            <Route exact path="/create_medicine" name="Page 500" element={<Create_medicine />} />
            <Route exact path="/create_chemist" name="Page 500" element={<Create_Chemist />} />
            <Route exact path="/Pending_appointments" name="pending_appointments" element={<Pending_appointments />} />
            <Route exact path="/doctor_appointment" name="pending_appointments" element={<Doctor_appointments />} />
            <Route exact path="/doctor_appointment/prescription/:id" name="prescription" element={<Prescription />} />
            <Route exact path="/medicine_data" name="pending_appointments" element={<Medicine_data />} />
            <Route exact path="/Pending_prescription" name="pending_prescription" element={<Pending_prescription/>} />
            <Route exact path="/view_history/:id" name="" element={<Patient_history />} />
            <Route exact path="/view_prescription/:id" name="pending_prescription" element={<View_prescription/>} />
            <Route exact path="/medicine_data/update_medicine/:id" name="pending_appointments" element={<Update_medicine />} />
            <Route path="/dashboard" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
