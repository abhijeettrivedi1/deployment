import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const Usercontext=createContext({});
export function Usercontextprovider({children}){
    const [user,setUser]=useState(null)
    const[ready,setReady] = useState(false)
    useEffect(()=>{
        if(!user){
           
            const{data}= axios.get("/profile").then(({data})=>{
                setReady(true);
                setUser(data);
               });
           
           
           
        }
        
    },[]);
    return(
        <Usercontext.Provider value={{user,setUser,ready}}>
            
            {children}
        
        </Usercontext.Provider>
        
    )
}