import HeaderContainer from '../components/Header';
import QueryForm from '../components/QueryForm';
import '../styles/Header.css'
import '../styles/RunQuery.css'

const RunQuery = () => {

  return (
    <>
      <HeaderContainer />
      <div className="builder-container">
        <div className="form-container">
          <h2>Build your query</h2>
          <h3>Please, enter a query name and select the filters to build a SQL query</h3>
          <QueryForm />
        </div>
        <div className="graphs-container">

        </div>
      </div>
    </>
  );
}
export default RunQuery;