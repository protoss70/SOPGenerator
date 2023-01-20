import './App.css';
import fire from "./firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import Nav from './components/Nav/Nav';
import {Routes, Route} from "react-router-dom";
import LogIn from './components/auth/login';
import { useEffect , useState } from 'react';


fire.initApp();

function App() {
    const [user] = useAuthState(fire.authUser());
    var userData = null;
    
    useEffect(() => {
      console.log("User Auth: ", user);
      if (user){
        fire.getUserData(user.email).then((data) => {
          userData = data;
          console.log("User Data: ", userData);
        });
      }
    }, [user])
    return (
      <>
      <Nav user={user} logout={fire.SignOut}/>
      <Routes>
        <Route path='/login' element={<LogIn user={{user, userData}} fire={{sign: fire.SignIn, checkExisting: fire.checkExisting, newUser: fire.newUser}}/>}></Route>
      </Routes>
    </>
    );
}

export default App;
