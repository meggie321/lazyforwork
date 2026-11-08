import React from 'react'
import ReactDOM from 'react-dom/client'
import BusyGame from './BusyGame'
import './index.css'
const root=document.getElementById('root')
if(!root)throw new Error('Root element is missing')
ReactDOM.createRoot(root).render(<React.StrictMode><BusyGame/></React.StrictMode>)
