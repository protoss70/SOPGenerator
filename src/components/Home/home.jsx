import './home.css';
import { adminSopPanel } from './sop';
import { adminUserPanel } from './people';
import { adminManuelPanel } from './manuel';
import createNotif from '../Notification/notification';

function Home(props) {
    const user = props.user.user;
    const userData = props.user.userData;
    const fire = props.fire;
    const path = window.location.pathname;
    console.log(props);

    function userActive(){
        if (user != null && userData != null) return true;
    }

    function userRoleCheck(role){
        if (userActive()) return userData.private.Roles.includes(role);
    }

	return (
        <div className='homeAdmin'>
            <div className='panels' id='panels'>
                {userActive() && userRoleCheck("Admin") && path === '/people' ? adminUserPanel(userData, fire) : <></>}
                {userActive() && userRoleCheck("Admin") && path === '/sop' ? adminSopPanel(userData, fire) : <></>}
                {userActive() && userRoleCheck("Admin") && path === '/files' ? adminManuelPanel(userData, fire) : <></>}
            </div>
            <div className='showcases hidden' id='showcases'>
            </div>
        </div>
	);
}

export default Home;