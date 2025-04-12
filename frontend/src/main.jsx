import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

//import AuthLayout from './components/AuthLayout.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/SignUp.jsx';
import UserDashboard from './pages/Dashboard/userDash.jsx';
import RangerDashboard from './pages/Dashboard/rangerDash.jsx';
import EcologistDashboard from './pages/Dashboard/ecoDash.jsx';
import AuthLayout from './components/AuthLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <App /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    element: <AuthLayout allowedRoles={['user']} />,
    children: [
      { path: '/udash', element: <UserDashboard /> },
    ],
  },
  {
    element: <AuthLayout allowedRoles={['admin']} />,
    children: [
      { path: '/rangerdash', element: <RangerDashboard /> },
    ],
  },
  {
    element: <AuthLayout allowedRoles={['ecologist']} />,
    children: [
      { path: '/edash', element: <EcologistDashboard /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
