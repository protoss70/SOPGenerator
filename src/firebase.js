import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { setDoc } from "firebase/firestore";

var fire = {}

var auth = undefined;
var firestore = undefined;
var analytics = undefined;

fire.authUser = () => {
  return firebase.auth();
}

fire.getUserData = async (email) => {
  const usersRef = firestore.collection('Users').doc(email);
  const userPrivateRef = usersRef.collection("Private").doc("Roles");
  return {data: (await usersRef.get()).data(), private: (await userPrivateRef.get()).data()};
}

fire.initApp = () => {

    const firebaseConfig = {
      apiKey: "AIzaSyDoCAwkF2PUX8ZW2eMbbjEeRFSGZAw1i_I",
      authDomain: "sop-generator.firebaseapp.com",
      projectId: "sop-generator",
      storageBucket: "sop-generator.appspot.com",
      messagingSenderId: "960257251812",
      appId: "1:960257251812:web:bd9053e7eaea74ad9c0ff1",
      measurementId: "G-P1HCJ2KTVM"
    };
    
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    // const analytics = firebase.getAnalytics(app);

    auth = firebase.auth();
    firestore = firebase.firestore();
    analytics = firebase.analytics();

    return {app};
}

fire.SignIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const res = await auth.signInWithPopup(provider);
  const usersRef = firestore.collection('Users');
  const ref = usersRef.doc(res.email);
  const found = await ref.get();
  return found;
}

fire.SignOut = () => {
  auth.signOut();
}

fire.checkExistingUser = async (ref) => {
  const result = await ref.get();
  return result.data();
}

fire.newUser = async () => {
  const user = auth.currentUser;
  const usersRef = firestore.collection('Users');
  const exists = await fire.checkExistingUser(usersRef.doc(user.email));
  console.log("exists: ", exists);
  if (exists){
    if(exists.init){
      const {uid, photoURL, displayName, email, emailVerified, phoneNumber} = user;
      console.log(uid, photoURL, displayName, email, emailVerified, phoneNumber);
    
      await setDoc(firestore.collection("Users").doc(email), {
        name: displayName,
        email,
        emailVerified,
        phoneNumber,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      })
    }

    return true
  }
  return false;
}

export default fire;