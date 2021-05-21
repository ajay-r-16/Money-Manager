import React,{useRef, useState} from 'react';
import './style.css';
import axios from 'axios';
import {Link} from 'react-router-dom';



export default function Login(props){
    if(localStorage.getItem('token')!==null){
        props.history.push('/home')
    }
    const email = useRef();
    const password = useRef();
    const [ isResponse, setIsResponse] = useState(true);
    const [ error,setError] = useState("");
    
    const base_url = "http://localhost:5000/"
    async function userLogin(){
        setError("");
        setIsResponse(false);
        let details = {};
        details.email = email.current.value;
        details.password = password.current.value;
        let res = await axios.post(base_url+'login',details);
        setIsResponse(true);
        if(res.data.token){
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user', res.data.user);
            
            props.history.push('/home');
        }
        else{
            setError(res.data.message);
            
        }
    }
    return(
        <>
        <div id="container-fluid" className="container-fluid">
         
            <h1 className="text-white"> LOGIN</h1>
            
            <form id="login-container" className="container p-3 p-sm-4 p-md-5" >
                
                 
                <label htmlFor="username" className="form-label"><b>Registered Email :</b></label>
                <input ref={email} name="username" type="text" className="form-control"  />
                
                <label htmlFor="password" className="form-label"><b>Password :</b></label>
                <input ref={password} name="password" type="password" className="form-control" />
                
                <p className="mt-3" ><b>Don't have an account ? <Link to="/register" style={{color:"#88b04b"}}>Register</Link></b></p>
                <input onClick={userLogin} type="button" style={{backgroundColor:"#88b04b",color:"white"}} className="btn btn-block" value="Login" />
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
                    <div className="alert alert-danger mt-3" role="alert">
                        <b>{error}</b>
                    </div>
                }
                
            </form> 
        </div>

  
        </>
    );
}