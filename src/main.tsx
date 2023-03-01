import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
const demoModule =  './demo'



/**
 * using dynamic import to have less code depending on the subdomain
 * 
 * this solution can also be done using multiple servers in vite to load root based on subdomain
 */

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

console.log(window.location.href)
try{
    import(demoModule).then(module=>{
        const demo = module.default
        demo(root)
    })
}catch(e){
    console.log(e)
}

