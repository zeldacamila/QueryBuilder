//import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
//import ProtectedRoute from './pages/ProtectedRoute';
import QueryBuilder from './pages/QueryBuilder';
import NotFound from './pages/NotFound';

function App() {
  //const [count, setCount] = useState(0)
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/querybuilder" element={<QueryBuilder/>} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes> 
    </>
  )
}

export default App
