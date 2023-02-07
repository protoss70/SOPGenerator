import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { setDoc } from "firebase/firestore";
import md5 from 'md5';

var fire = {db: firestore}

var auth = undefined;
var firestore = undefined;
var analytics = undefined;

const searchedUsers = {};
const searchedSops = {};
const searchedFiles = {};

fire.authUser = () => {
  return firebase.auth();
}

fire.getPerson = async (email) => {
  if (!searchedUsers[email]){
    const usersRef = firestore.collection('Users').doc(email);
    searchedUsers[email] = (await usersRef.get()).data();
  }
  return searchedUsers[email];
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

fire.updateUser = async (email, updates) => {
  if (searchedUsers[email]){
    searchedUsers[email] = null;
  }
  return await firestore.collection("Users").doc(email).update(updates);
}

fire.getSop = async (id) => {
  if (!searchedSops[id]){
    const usersRef = firestore.collection('SOP').doc(id);
    searchedSops[id] = (await usersRef.get()).data();
  }
  return searchedSops[id];
}

fire.getFile = async (id) => {
  if (!searchedFiles[id]){
    const usersRef = firestore.collection('PDF').doc(id);
    searchedFiles[id] = (await usersRef.get()).data();
  }
  return searchedFiles[id];
}

fire.updateFile = async (id, update) => {
  if (searchedFiles[id]){
    searchedFiles[id] = null;
  }

  return await firestore.collection("PDF").doc(id).update(update);
}

fire.sopUpdate = async (id, update) => {
  if (searchedSops[id]){
    searchedSops[id] = null;
  }
  return await firestore.collection("SOP").doc(id).update(update);
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
	//if exists: user data, else returns 'undefined'
  	const result = await ref.get();
  	return result.data();
}

fire.sendInvite = async (userData, settings) => {
	async function properInvCheck(userData, settings){
		if (userData === null) return false;
		if (settings.email === null || settings.email === undefined || settings.email === "") return false;
		if (settings.roles === null || settings.roles === undefined) return false;
		if (await fire.checkExistingUser(firestore.collection("Users").doc(settings.email))) return false;
		console.log("No Security Errors")
		return true;
	}
	if (!(await properInvCheck(userData, settings))) return false;
	console.log("here");
	const date = new Date(Date.now()).toUTCString();
	const inviteRef = firestore.collection('Users').doc(settings.email);
	const userRef = firestore.collection("Users").doc(userData.data.email);
  const key = md5(settings.email + process.env.REACT_APP_SECRET_KEY);
	setDoc(inviteRef, {
		email: settings.email,
    userInv: {
      invitedBy: userData.data.email,
      inviteDate: date,
    },
    key,
		init: true
	}).then((res) => {
		console.log("Sent Invitation", res);
		var newInv = userData.data.invitations === undefined || userData.data.invitations === null 
    ? [{email: settings.email, date}] : [...userData.data.invitations, {email: settings.email, date, Role: settings.roles[0], init: true}];
    console.log(userData.invitations);
    console.log(newInv);
		//Update the invitations of the inviting person
		userRef.update({invitations: newInv}).then((res2) => {
			console.log("Update User Invs", res2);
			if (settings.successCallback) settings.successCallback();
		})

		//Set private document for new user
		const privateRef = inviteRef.collection("Private").doc("Roles");
		setDoc(privateRef, {
			Roles: settings.roles
		}).then((res3) => {
			console.log("private set for the invited person", res3);
		})
		}
	)

	return true;
}

fire.deleteUser = async (email) => {
  await firestore.collection('Users').doc(email).collection("Private").doc("Roles").delete();
  return await firestore.collection('Users').doc(email).delete();
}

fire.newUser = async () => {
  const user = auth.currentUser;
  const usersRef = firestore.collection('Users');
  const exists = await fire.checkExistingUser(usersRef.doc(user.email));
  console.log("exists: ", exists);
  if (exists){
    if(exists.init){
      const {uid, photoURL, displayName, email, emailVerified, phoneNumber} = user;
      const key = md5(email + process.env.REACT_APP_SECRET_KEY);
      console.log(uid, photoURL, displayName, email, emailVerified, phoneNumber, key);
      
      await firestore.collection("Users").doc(email).update({
        name: displayName,
        init: false,
        email,
        emailVerified,
        phoneNumber,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        key,
      })
    }

    return true
  }
  return false;
}

export default fire;