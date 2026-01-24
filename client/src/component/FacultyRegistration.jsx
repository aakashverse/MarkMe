import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FacultyRegistration() {
    const navigate = useNavigate();
    const [facultyId, setFacultyId] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const res = await axios.post(
          "http://localhost:5000/FacultySignUp",
          { facultyId, password }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("facultyId", res.data.userId);
    
        navigate("/Faculty-Dashboard");
    };

  return (
    <div className='m-5'>
      <form className='d-flex justify-content-center align-items-center' onSubmit={handleRegister}>
                    <div className='col-12 col-lg-6 col-md-8 col-sm-12 border rounded rounded-3 p-2' style={{backgroundColor: "whitesmoke"}}>
                    <div className='d-flex'>
                        <h4>Register</h4>
                    {/* <h3 className='text-center border rounded rounded-4'><Link className='text-dark' to={'/LogIn'}>LogIn</Link></h3> */}
                    {/* <h3 className='text-center col-6 border rounded rounded-4'><Link className='text-dark' to={'/SignUp'}>SignUp</Link></h3> */}
                    </div>
                        <div className="mb-3">
                            <label htmlFor="InputEmail" className="form-label">Faculty Id</label>
                            <input  className="form-control" onChange={(e)=> setFacultyId(e.target.value)} value={facultyId} id="InputEmail" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="InputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" onChange={(e)=> setPassword(e.target.value)} value={password} min={8} max={16} id="InputPassword" />
                        </div>
                        <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                </form>
    </div>
  )
}

export default FacultyRegistration
