import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Index from './pages/Index';
import ResetPassword from './pages/ResetPassword';
import SetNewPassword from './pages/SetNewPassword';

import Layout from './components/Layout';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<Register />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/new-password' element={<SetNewPassword />} />
          <Route path='/*' element={<Layout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
