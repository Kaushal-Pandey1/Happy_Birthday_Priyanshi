import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BirthdaySite from "./BirthdaySite";

function App() {
  const [count, setCount] = useState(0)

  return <BirthdaySite />;
    
  
     
}

export default App
