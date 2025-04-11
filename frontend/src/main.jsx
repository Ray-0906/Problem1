import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
//import { Provider } from 'react-redux';
//import store from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/SignUp.jsx';

import UserDashboard from './pages/Dashboard/userDash.jsx';
import RangerDashboard from './pages/Dashboard/rangerDash.jsx';
import EcologistDashboard from './pages/Dashboard/ecoDash.jsx';


// Page

// Components
//import AuthLayout from './Component/Authlayout.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [

      { path: '/', element: <App /> }, 
      
    ],
  },
  {
    path: '/udash',
    element: <UserDashboard />,
  },
  {
    path: '/edash',
    element: <EcologistDashboard />,
  },
  {
    path: '/rangerdash',
    element: <RangerDashboard/>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: (
    //  <AuthLayout Authentication={false}>
        <Signup />
    //  </AuthLayout>
    ),}

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <RouterProvider router={router} />
  
  </StrictMode>
);