import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import QueryBuilder from './pages/QueryBuilder';
import NotFound from './pages/NotFound';
import RunQuery from './pages/RunQuery';
import AllQueries from './pages/AllQueries';

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/querybuilder" element={<QueryBuilder/>} 
        />
        <Route 
          path="/querybuilder/run-query" element={<RunQuery/>} 
        />
        <Route 
          path="/saved-queries" element={<AllQueries/>} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes> 
    </>
  )
}

export default App
