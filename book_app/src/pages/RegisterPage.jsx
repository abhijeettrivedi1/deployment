import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
export default function RegisterPage(){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    async function registerUser(e){
        e.preventDefault()
        try{
            await axios.post("/register",{
                name,
                email,
                password
            });
            alert("User registration successful")
        }catch{
            alert("User registration failed")
        }
        
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form action="" onSubmit={registerUser}className="max-w-md mx-auto ">
                    <input type="text" placeholder="Abhijeet Trivedi" 
                    value={name} 
                    onChange={e=>setName(e.target.value)}/>
                    <input type="email" placeholder="your@email" 
                    value={email}
                    onChange={e=>setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" 
                    value={password}
                    onChange={e=>setPassword(e.target.value)}/>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member?  
                        <Link to={"/login"} className="underline text-red-600" >Login</Link>
                    </div>
                </form>
            </div>
            
        </div>
    )
}