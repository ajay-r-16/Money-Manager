import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar(props){


    function logout(){
        localStorage.removeItem('token');
    }
    return (
        <nav className="navbar navbar-expand-md navbar-dark sticky-top" style={{minHeight:"9vh", backgroundColor:"#88b04b"}}>
            <div className="container-fluid">
                <a href="/home" className="navbar-brand"><b>MoneyAGER</b></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                
                <form id="search_group">
                    <Link to="/login"><button onClick={logout} className="btn btn-outline-dark" type="button"><b>Logout</b></button></Link>
                </form>
                </div>
            </div>
        </nav>
        
    )
}