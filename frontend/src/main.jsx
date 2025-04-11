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

// Page

// Components
//import AuthLayout from './Component/Authlayout.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <App /> },
      {
        path: '/login',
        element: (
         // <AuthLayout Authentication={false}>
            <Login />
         // </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
        //  <AuthLayout Authentication={false}>
            <Signup />
        //  </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <RouterProvider router={router} />
  
  </StrictMode>
);