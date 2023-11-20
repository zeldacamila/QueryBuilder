import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QueryBuilder from './pages/QueryBuilder';
import NotFound from './pages/NotFound';
import RunQuery from './pages/RunQuery';
import AllQueries from './pages/AllQueries';
import CommentQuery from './pages/CommentQuery';
import SelectQuery from './pages/SelectQuery';
import './styles/App.css';


function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/querybuilder" element={<QueryBuilder />} />
        <Route path="/querybuilder/run-query" element={<RunQuery />} />
        <Route path="/saved-queries" element={<AllQueries />} />
        <Route path="/saved-queries/:queryId/comment-query" element={<CommentQuery />} />
        <Route path="/saved-queries/:queryId/select-query" element={<SelectQuery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
