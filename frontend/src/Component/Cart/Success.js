import React from 'react'
import { Link } from 'react-router-dom'
import "./success.css"



const Success = () => {
  return (
<div>
<h1 className='success-head'>Success</h1>
    <div className='success-img'>
     <Link to={"/"} className="success-home">Go to Home</Link>
      
      </div>
      </div>
  )
}

export default Success