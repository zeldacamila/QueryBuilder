import { useState } from 'react';
import './Home.css';
import SignInForm from '../components/SignInForm';
import LoginForm from '../components/LoginForm'; // Asegúrate de importar LoginForm

function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <>
      <div className="login-form-container">
        <h2>Welcome to the QueryBuilder App ⚙️</h2>
        {showLoginForm ? <SignInForm /> : <LoginForm />}
        <p className="form-toggle">
          {showLoginForm 
            ? "Already have an account? "
            : "Don't have an account? "}
          <a href="#" onClick={toggleForm} className="link-text">
          {showLoginForm ? "Log In" : "Sign Up"}
          </a>
        </p>
      </div>
    </>
  );
}

export default Home;
