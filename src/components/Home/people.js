import icons from '../../icons';
import ReactDOM from 'react-dom/client';
import createNotif from '../Notification/notification';

export function adminUserPanel(userData, fire){

    function adminUser(data){
        return (
        <div className="adminPanelRow adminPanelRowUser" email={data.email} onClick={(e) => {showcaseSet(e)}} id={`adminPanelUser${data.email}`}>
            <div className="nameFormHead addedElem generalFormHead">{data.Name !== null ? data.Name : "NONE"}</div>
            <div className="emailFormHead addedElem generalFormHead">{data.email}</div>
            <div className="roleFormHead addedElem generalFormHead">{data.Role}</div>
            <div className="activeFormHead addedElem generalFormHead"><span className={data.init ? "activeNo" : "activeYes"}>{data.init ? "No" : "Yes"}</span></div>
            <div className="iconCont generalFormHead addedElem"><img email={data.email} onClick={(e) => {deleteDocument(e)}} className='trashIcon' src={icons.trash} alt="hehee" /></div>
        </div>)
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

    async function sendInvite(){
        const email = document.getElementById("mailInv").value;
        const roles = [document.getElementById("userInvRoleSelect").value];
        try{
            await fire.sendInvite(userData, {email, roles});
            sendInviteShow(false);
            createNotif({title: "Invite Sent", text: "Succesfully sent invite", mode: "success"});
        }catch (e){
            createNotif({title: "Failed", text: "Failed to send invite, try again later.", mode: "danger"});
        }
    }


    function showPerson(data){
        console.log(data);

        function checkSop(sopName, check){
            return(<div className="sopAccess">
            <div className="accessCheckCont">
                <input type="checkbox" defaultChecked={check} className={`sopAccessCheck ${check ? "checkedAccessBox" : ""}`} name={`sopCheck${sopName}`} id={`sopCheck${sopName}`} />
            </div>
            <label className="sopAccessName" htmlFor={`sopCheck${sopName}`}>{sopName}</label>
        </div>)}

        function findState(data, sopName){
            if (data.Sops === null || data.Sops === undefined || data.Sops.length === 0) return false;
            var res = false;
            data.Sops.forEach(sop => {
                if(sop.Name === sopName){
                    res = true;
                }
            });
            return res;
        }
        return(<div className="showcaseContainer">
        <div className="showcase">
            <div className="showcasePersonMail"><b>{data.email}</b></div>
            <h6>Sop Access</h6>
            <span className='accessText'>Manage which SOP's this user can access</span>
            {userData.data.Sops.map(sop => {return(checkSop(sop.Name, findState(data, sop.Name)))})}
            <div className="accessButtonCont">
                <button className="btn btn-secondary smallerButton" onClick={cancelEditUser}>Cancel</button>
                <button className="btn btn-primary smallerButton" email={data.email} onClick={(e) => {updatePersonSop(e)}}>Done</button>
            </div>
        </div>
    </div>)
    }

    async function updatePersonSop(e){
        const activeSopsUser = []
        userData.data.Sops.forEach(sop => {
            if (document.getElementById(`sopCheck${sop.Name}`).checked) activeSopsUser.push(sop);
        })
        const email = e.target.getAttribute("email");
        try{
            await fire.updateUser(email, {Sops: activeSopsUser});
            createNotif({title: "Person Updated", text: "Succesfully updated the user", mode: "success"});
            cancelEditUser();
        }catch (e){
            createNotif({title: "Error", text: "System failed to update user", mode: "danger"});
        }
    }

    async function showcaseSet(e){
        e.stopPropagation();
        const email = e.target.parentElement.getAttribute("email");
        const cases = document.getElementById("showcases");
        const panels = document.getElementById("panels");
        panels.classList.add('hidden');
        cases.textContent = "";
        cases.classList.remove("hidden");
        const data = await fire.getPerson(email);
        const elem = showPerson(data);
        const root = ReactDOM.createRoot(cases);
        root.render(elem);
    }

    function sendInviteShow(opt){
        if (opt){
            document.getElementById("inviteForm").classList.remove("hidden");
            document.getElementById("plusIconRow").classList.add("hidden");
        }else{
            document.getElementById("inviteForm").classList.add("hidden");
            document.getElementById("plusIconRow").classList.remove("hidden");
        }
    }

    async function deleteDocument(e){
        console.log("disabled for now!");
        e.stopPropagation();
        // const email = e.target.getAttribute("email");
        // document.getElementById(`adminPanelUser${email}`).remove();
        // try{
        //     await fire.deleteUser(email);
        //     createNotif({title: "Person Deleted", text: "Succesfully deleted the person", mode: "success"});
        // }
        // catch(e){
        //     createNotif({title: "Failed", text: "Failed to delete the user", mode: "danger"});
        // }
        // userData.data.invitations = userData.data.invitations.filter((inv) => {
        //     return inv.email !== email;
        // })
        // await fire.updateUser(userData.data.email, {invitations: userData.data.invitations});
    }

    function cancelEditUser(){
        const cases = document.getElementById("showcases");
        const panels = document.getElementById("panels");
        panels.classList.remove('hidden');
        cases.classList.add("hidden");
        cases.textContent = "";
    }

    return ((<div className='adminContainer'>
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
                <div className='adminPanelRow' id='plusIconRow'>
                    <div className='plusIconCont' onClick={() => {sendInviteShow(true)}}><img className='plusIcon' src={icons.plus} alt='You will never get to see this image muhahahahaha!!!'/></div>
                </div>
            </div>
        </div>
    </div>)
)

}