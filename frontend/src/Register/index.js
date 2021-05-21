import React,{useRef, useState} from 'react';
import './style.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import validator from 'validator';


export default function Register(props){
    if(localStorage.getItem('token')!==null){
        props.history.push('/home')
    }
    const fname = useRef();
    const lname = useRef();
    const email = useRef();
    const password = useRef();
    
    const base_url = "http://localhost:5000/";
    const [ isResponse, setIsResponse] = useState(true);
    const [ error,setError] = useState("");
    const [errorType, setErrorType] = useState("negative")
    

    async function userRegister(){
        setErrorType("negative");
        setError("");
        let details = {};
        details.name = fname.current.value+" "+lname.current.value;
        details.email = email.current.value;
        details.password = password.current.value;

        if (validator.isEmail(email.current.value)) {
            
        } else {
            setError("Enter valid email");
            return;
        }

        if(validator.isStrongPassword(password.current.value)){
        }
        else{
            setError("Password must contain minimum of 8 characters with atleast 1 lowecase, 1 uppercase, 1 number and 1 symbol.")
            return;
        }
        setIsResponse(false);

        let res = await axios.post(base_url+'register',details);
        setIsResponse(true);
        if(res.data.message === "User successfully created"){
            setErrorType("positive");
            
            // props.history.push('/login');
            const msg = <span>Registration successfull. Please <Link to="/login" className="alert-link">Login</Link> </span>;
            
            setError(msg);
        }
        else
            setError(res.data.message);
    }
    
    return(
        <>
        <div id="container-fluid" className="container-fluid">
            <h1 className="text-white">REGISTER</h1>
            <form id="register-container" className="container p-3 p-md-5">
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label htmlFor="firstname" className="form-label"><b>First Name :</b></label>
                        <input ref={fname} name="firstname" type="text" className="form-control"  />
                    </div>
                    
                    <div className="col-sm-6">
                        <label htmlFor="lastname" className="form-label"><b>Last Name :</b></label>
                        <input ref={lname} name="lastname" type="text" className="form-control"  />
                    </div>
                </div>
                

                <label htmlFor="username" className="form-label"><b>Email :</b></label>
                <input ref={email} name="username" type="text" className="form-control"  />
                
                <label htmlFor="password" className="form-label"><b>Password :</b></label>
                <input ref={password} name="password" type="password" className="form-control" />

                <p className="mt-3" ><b>Already have an account ? <Link to="/login" style={{color:"#88b04b"}}> Login</Link></b></p>

                <input onClick={userRegister} type="button" className="btn btn-block" style={{backgroundColor:"#88b04b",color:"white"}} value="Register" />
                <br/>{ !isResponse && 

                    <div className="d-flex justify-content-center">
                        <div className="spinner-grow spinner-grow-sm" role="status" >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm" role="status" style={{marginLeft:"7px"}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm" role="status" style={{marginLeft:"7px"}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                  
                }
                { error.length !== 0 && 
                    <div className={ errorType==="negative" ? "alert alert-danger mt-3": "alert alert-success mt-3"} role="alert">
                        <b>{error}</b>
                    </div>
                }
            </form>
        </div>
            
        </>
    );
}