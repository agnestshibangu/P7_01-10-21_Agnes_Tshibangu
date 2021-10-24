import React, { useState, useContext } from 'react'
import { useHistory } from "react-router-dom";
import Axios from "axios";
import '../form.css'
import DataContext from '../DataContext'
import { Link } from 'react-router-dom'

export default function Login() {

    const history = useHistory(); 

    const { dataUser } = useContext(DataContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    




    function redirect() {
        history.push("/")
    }
   

    const login = () => {
        Axios.post('http://localhost:3001/api/user/login', {
            email : email,
            password : password
        }).then((response) => {
            localStorage.setItem("token", "Bearer " + response.data.token)
            console.log(response.data.userId)
            console.log(response.data.moderator)
            localStorage.setItem("id", response.data.userId)
            localStorage.setItem("moderator", response.data.moderator)
            redirect()
        })
    }



    
   

    return (
        <div className="form-container">
            <h1>Sign in to Groupomania</h1>
           
            <div className="form-container-box">
            

            <div className="inputs">

                <div className="input">
                    <label for="name">Email:</label>
                    <input placeholder="email" type="text"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}></input>
                </div>
         
                <div className="input">
                    <label for="name">password:</label>
                    <input placeholder="password" type="password"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}></input>
                </div>

                

            </div>
           
            <div className="button-login-container">
                <button className="submit-btn-login" onClick={login}>SUBMIT</button>
            </div>
                
            </div>      

            <p>Vous n'avez pas de compte ?</p>  <Link className="signup-link" to="/signup">Créer un compte</Link> 
           
        </div>
    )
}
