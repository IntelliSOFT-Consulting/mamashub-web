import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Index from './pages/Index'
import ResetPassword from './pages/ResetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Account from './pages/Account'
import Users from './pages/Users'



function App() {
    return ( 
        <div>
      <Router>
          <Routes>
          <Route exact path="/account" element={<Account/>} />
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/logout" element={<Logout/>}/>
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/reset-password" element={<ResetPassword/>} />
          <Route exact path="/new-password" element={<SetNewPassword/>} />
          <Route exact path="/" element={<Index/>} />
          <Route exact path="/users" element={<Users/>} />

        </Routes>
    </Router>
        </div>
    );
}

export default App;