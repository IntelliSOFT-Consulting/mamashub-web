import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Index from './pages/Index'
import ResetPassword from './pages/ResetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Account from './pages/Account'



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
          <Route path="/set-new-password" element={<SetNewPassword/>} />
          <Route path="/" element={<Index/>} />          
        </Routes>
    </Router>
        </div>
    );
}

export default App;