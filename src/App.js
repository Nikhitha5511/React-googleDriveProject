
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Data from './components/Data';
import { auth, provider } from './Firebase/Firebase';
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Bin from './components/Bin';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);

   const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
   const credential = GoogleAuthProvider.credentialFromResult(result);
   const token = credential.accessToken;
   const user = result.user;
    setUser(user);
   })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
  });
  }

  return (
    <Router>
    <>
     {user ? (
     <>
     <Header photoURL={user.photoURL}/>
     <div className="App">
     <Sidebar/>
     <Routes>
      <Route path="/drive" element={<Data photoURL={user.photoURL} />} />
      <Route path="/bin" element={<Bin photoURL={user.photoURL} />} />
      <Route path="/" element={<Navigate to="/drive" />} />
      </Routes>
     
     </div>
     
      </>
     ) : (
     <div className='login'>
      <img src="https://logowik.com/content/uploads/images/google-logo-2020.jpg" alt="gdrive" />
     <h3>Sign in</h3>
     <p>to continue to google drive</p>
     <button onClick={signInWithGoogle}>Sign in</button>
     </div>
    )}
     </>
     </Router>
    )
   }

export default App;
