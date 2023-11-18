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
        <h1>Welcome to the Query Builder</h1>
        {showLoginForm ? <LoginForm /> : <SignInForm />}
        <p className="form-toggle">
          {showLoginForm 
            ? "Don't have an account? "
            : "Already have an account? "}
          <a href="#" onClick={toggleForm} className="link-text">
          {showLoginForm ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </>
  );
}

export default Home;
