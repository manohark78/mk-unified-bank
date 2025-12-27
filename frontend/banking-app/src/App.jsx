import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/bankingapp/Login';
import AccountList from './components/bankingapp/AccountList';
import AddAccount from './components/bankingapp/AddAccount';
import Navbar from './components/bankingapp/Navbar';
import { isAuthenticated } from './Authentication/auth';
import AccountDetails from './components/bankingapp/AccountDetails';
import TransferForm from './components/bankingapp/TransferForm';
import ChangePassword from './components/bankingapp/ChangePassword';
import AdminDashboard from "./components/bankingapp/AdminDashboard";


const mustChangePassword = () => localStorage.getItem('passwordChangeRequired') === 'true';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (mustChangePassword() && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        {/* Change Password (accessible even when forced) */}
        <Route path="/change-password" element={<><Navbar /><ChangePassword /></>} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AccountList />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-account"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AddAccount />
              </>
            </ProtectedRoute>
          }
              />
              <Route path="/change-password" element={<><Navbar /><ChangePassword /></>} />
        <Route
          path="/account/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AccountDetails />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TransferForm />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <AdminDashboard />
            </>
          </ProtectedRoute>
        }
        />

      </Routes>
    </Router>
  );
}

export default App;
