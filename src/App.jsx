import { useState } from 'react'
import './App.css'
import ArmanPotfolio from './ArmanPotfolio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <ArmanPotfolio/>
    </>
  )
}

export default App
