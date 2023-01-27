import './home.css';
import icons from '../../icons';

function Home(props) {
    const user = props.user.user;
    const userData = props.user.userData;
    const fire = props.fire;
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

    async function deleteDocument(e){
        const email = e.target.getAttribute("email");
        document.getElementById(`adminPanelUser${email}`).remove();
        await fire.delete(email);
        userData.data.invitations = userData.data.invitations.filter((inv) => {
            return inv.email !== email;
        })
        await fire.update(userData.data.email, {invitations: userData.data.invitations});
    }

    function sendInvite(){
        const email = document.getElementById("mailInv").value;
        const roles = [document.getElementById("userInvRoleSelect").value];
        console.log(email, roles);
        fire.invite(userData, {email, roles});
    }

    function sendInviteShow(opt){
        if (opt){
            document.getElementById("inviteForm").classList.remove("hidden");
            document.getElementById("inviteShowButton").classList.add("hidden");
        }else{
            document.getElementById("inviteForm").classList.add("hidden");
            document.getElementById("inviteShowButton").classList.remove("hidden");
        }
    }

    const inviteForm = (<div id='inviteForm' className='invForm hidden addedElem generalFormHead'>
        <div className='emailInputInv'>
            <label htmlFor="mailInv">Email Adress</label>
            <input type="email" name="mailInv" id="mailInv" />
            <select className="form-select form-select-sm" defaultValue={'Worker'} id='userInvRoleSelect' aria-label=".form-select-sm example">
                <option value="Super" >Super</option>
                <option value="Maintainer">Maintainer</option>
                <option value="Worker" >Worker</option>
            </select>
        </div>
        <div className="invButtonsContainer">
            <button className="btn btn-primary smallerButton" onClick={sendInvite}>Send Invite</button>
            <button className="btn btn-secondary smallerButton" onClick={() => {sendInviteShow(false)}}>Cancel</button>
        </div>
    </div>)

    const adminUserPanel = (<div className='adminContainer'>
        <div className="adminPanelContainer">
            <div id='adminPanel'>
                <div className='adminPanelRow'>
                    <div className="nameFormHead generalFormHead topLeftPad b">Name</div>
                    <div className="emailFormHead generalFormHead b">Email</div>
                    <div className="roleFormHead generalFormHead b">Role</div>
                    <div className="activeFormHead generalFormHead b">Active</div>
                    <div className="generalFormHead headEmptySpace b topRightPad"></div>
                </div>
                {userData !== null ? userData.data.invitations.map(inv => {return (adminUser(inv))}) : <></>}
                {inviteForm}
            </div>
            
            <div className="adminInvButton">
                    <button className='btn btn-primary smallerButton' id='inviteShowButton' onClick={() => {sendInviteShow(true)}}>Invite People</button>
            </div>
        </div>
    </div>)

    const adminSopPanel = (<div className='adminContainer'>
        <div className="adminPanelContainer">
            <div id="adminPanel">
                <div className="adminPanelRow">
                    <div className="nameSopFormHead generalFormHead b topLeftPad">Sop Name</div>
                    <div className="descriptionSopFormHead generalFormHead b">Description</div>
                    <div className="generalFormHead b headEmptySpace topRightPad"></div>
                </div>
                {userData !== null ? userData.data.Sops.map(sop => {return (adminSop(sop))}) : <></>}
            </div>
        </div>
    </div>)

    function adminSop(data){
        return (
        <div className='adminPanelRow adminPanelRowUser'>
            <div className="nameSopFormHead addedElem generalFormHead generalFormSopHead">{data.Name}</div>
            <div className="descriptionSopFormHead scrollable addedElem generalFormHead generalFormSopHead">{data.Description}</div>
            <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='editIcon' src={icons.edit} alt="hehee" /></div>
            <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='trashIcon' src={icons.trash} alt="hehee" /></div>
        </div>)
    }

    function adminUser(data){
        return (
        <div className="adminPanelRow adminPanelRowUser" id={`adminPanelUser${data.email}`}>
            <div className="nameFormHead addedElem generalFormHead">{data.Name !== null ? data.Name : "NONE"}</div>
            <div className="emailFormHead addedElem generalFormHead">{data.email}</div>
            <div className="roleFormHead addedElem generalFormHead">{data.Role}</div>
            <div className="activeFormHead addedElem generalFormHead"><span className={data.init ? "activeNo" : "activeYes"}>{data.init ? "No" : "Yes"}</span></div>
            <div className="iconCont generalFormHead addedElem"><img className='editIcon' src={icons.edit} alt="hehee" /></div>
            <div className="iconCont generalFormHead addedElem"><img email={data.email} onClick={(e) => {deleteDocument(e)}} className='trashIcon' src={icons.trash} alt="hehee" /></div>
        </div>)
    }

	return (
        <div>
            {userActive() && userRoleCheck("Admin") ? adminUserPanel : <></>}
            {userActive() && userRoleCheck("Admin") ? adminSopPanel : <></>}
        </div>
	);
}

export default Home;