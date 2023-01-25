import './home.css';
import icons from '../../icons';

function Home(props) {
    const user = props.user.user;
    const userData = props.user.userData;
    console.log(props);

    function userActive(){
        if (user != null && userData != null) return true;
        return false 
    }

    function userRoleCheck(role){
        if (userActive()){
            return userData.private.Roles.includes(role);
        }else return false;
    }

    function sendInvite(){
        const email = document.getElementById("mailInv").value;
        const roles = getRoles();
        console.log(email, roles);
        props.fire.invite(userData, {email, roles});
    }

    function getRoles(){
        const roles = [];
        const roleDOM = [document.getElementById("superUserInp"),
        document.getElementById("maintainerInp"),
        document.getElementById("workerInp")];
        
        roleDOM.forEach(roleD => {
            if (roleD.checked) roles.push(roleD.name);
        });
        return roles;
    }

    const inviteForm = (<div>
        <label htmlFor="mailInv">Email Adress</label>
        <input type="email" name="mailInv" id="mailInv" />
        <label htmlFor="superUserInp">Super User</label>
        <input type="checkbox" value="Super User" name="Super User" id="superUserInp" />
        <label htmlFor="maintainerInp">Maintainer</label>
        <input type="checkbox" name="maintainer" value="Maintainer" id="maintainerInp" />
        <label htmlFor="workerInp">Worker</label>
        <input type="checkbox" name="worker" value="Worker" id="workerInp" />
        <button className="btn btn-primary" onClick={sendInvite}>Send Invite</button>
    </div>)

    const adminPanel = (<div className='adminContainer'>
        <div id='adminPanel'>
            <div className='adminPanelRow'>
                <div className="nameFormHead generalFormHead topLeftPad">Name</div>
                <div className="emailFormHead generalFormHead">Email</div>
                <div className="roleFormHead generalFormHead">Role</div>
                <div className="activeFormHead generalFormHead">Active</div>
                <div className="generalFormHead headEmptySpace topRightPad"></div>
            </div>
            {userData !== null ? userData.data.invitations.map(inv => {return (adminUser(inv))}) : <></>}
        </div>
    </div>)

    function adminUser(data){
        return (<div className="adminPanelRow">
                <div className="nameFormHead addedElem generalFormHead">{data.Name !== null ? data.Name : "NONE"}</div>
                <div className="emailFormHead addedElem generalFormHead">{data.email}</div>
                <div className="roleFormHead addedElem generalFormHead">{data.Role}</div>
                <div className="activeFormHead addedElem generalFormHead"><span className={data.init ? "activeNo" : "activeYes"}>{data.init ? "No" : "Yes"}</span></div>
                <div className="generalFormHead addedElem headEmptySpace"></div>
            </div>)
    }

	return (
        <div>
            {userActive() && userRoleCheck("Admin") ? adminPanel : <></>}
            {userActive() && userRoleCheck("Admin") ? inviteForm : <></>}
        </div>
	);
}

export default Home;