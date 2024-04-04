import { Link, Navigate } from "react-router-dom"
import axios from "axios"
import { useContext, useState } from "react"
import { Usercontext } from "../usercontext.jsx"
export default function LoginPage(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const[redirect,setRedirect]=useState(false)
    const {setUser}=useContext(Usercontext)
    async function handelloginsubmit(e){
        e.preventDefault()
        try{
            const userinfo= await axios.post("/login",{
                email,
                password
            },{withCredentials:true});
            alert("Login successful")
            setUser(userinfo.data)
            setRedirect(true)
        }catch{
            alert("Login failed")
        }
    }
    if(redirect==true){
        return <Navigate to={"/"}/>
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form action="" className="max-w-md mx-auto " onSubmit={handelloginsubmit}>
                    <input type="email" placeholder="your@email" value={email} onChange={e=>setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet?  
                        <Link to={"/register"} className="underline text-red-600" >Register now</Link>
                    </div>
                </form>
            </div>
            
        </div>
    )
}