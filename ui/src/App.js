import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Index from './pages/Index'
import ResetPassword from './pages/ResetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Account from './pages/Account'
import Users from './pages/Users'
import PatientDetails from './pages/PatientDetails'
import PatientList from './pages/PatientList'
import CloseANCRecord from './pages/CloseANCRecord'
import PatientRegistration from './pages/PatientRegistration'
import ConfirmPregnancy from './pages/ConfirmPregnancy'
import PhysicalExam from './pages/PhysicalExam'
import PatientProfile from './pages/PatientProfile'
import MOH100 from './pages/MOH100'
import CommunityReferrals from './pages/CommunityReferrals'





function App() {
    return ( 
        <div>
      <Router>
          <Routes>
          <Route path="/account" element={<Account/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/new-password" element={<SetNewPassword/>} />
          <Route path="/" element={<Index/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/patients" element={<PatientList/>} />
          <Route path="/patients/:id" element={<PatientDetails/>} />
          <Route path="/settings" element={<PatientDetails/>} />
          <Route path="/close-anc-record" element={<CloseANCRecord/>} />
          <Route path="/physical-exam" element={<PhysicalExam/>} />
          <Route path="/patient-registration" element={<PatientRegistration/>} />
          <Route path="/patient-profile" element={<PatientProfile/>} />
          <Route path="/confirm-pregnancy" element={<ConfirmPregnancy/>} />
          <Route path="/community-referrals" element={<CommunityReferrals/>} />
          <Route path="/moh-100" element={<MOH100/>} />



        </Routes>
    </Router>
        </div>
    );
}

export default App;