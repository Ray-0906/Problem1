import React from 'react'
import { Outlet } from "react-router-dom";


const App = () => {
  
  return (
    <>
    <div >
       <div className=' mx-auto  '>
      <Outlet/>
      </div>
      </div>
    </>
  )
}

export default App