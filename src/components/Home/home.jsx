import './home.css';
import icons from '../../icons';
import ReactDOM from 'react-dom/client';

function Home(props) {
    const user = props.user.user;
    const userData = props.user.userData;
    const fire = props.fire;
    const path = window.location.pathname;
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

    function cancelEditUser(){
        const cases = document.getElementById("showcases");
        cases.classList.add("hidden");
        cases.textContent = "";
    }

    async function deleteDocument(e){
        console.log("disabled for now!");
        // const email = e.target.getAttribute("email");
        // document.getElementById(`adminPanelUser${email}`).remove();
        // await fire.deleteUser(email);
        // userData.data.invitations = userData.data.invitations.filter((inv) => {
        //     return inv.email !== email;
        // })
        // await fire.updateUser(userData.data.email, {invitations: userData.data.invitations});
    }

    async function updateSopFile(e) {
        const activeFiles = []
        userData.data.Files.forEach(file => {
            if (document.getElementById(`fileCheck${file.Name}`).checked) activeFiles.push(file);
        })
        const sopName = e.target.getAttribute("sopName");
        const sopId = findSopId(sopName)
        console.log(sopId);
        await fire.sopUpdate(sopId, {Files: activeFiles});
        cancelEditUser();
    }

    async function updatePersonSop(e){
        const activeSopsUser = []
        userData.data.Sops.forEach(sop => {
            if (document.getElementById(`sopCheck${sop.Name}`).checked) activeSopsUser.push(sop);
        })
        const email = e.target.getAttribute("email");
        await fire.updateUser(email, {Sops: activeSopsUser});
        cancelEditUser();
    }

    async function showcaseSet(e){
        const email = e.target.getAttribute("email");
        const cases = document.getElementById("showcases");
        cases.textContent = "";
        cases.classList.remove("hidden");
        const data = await fire.getPerson(email);
        const elem = showPerson(data);
        const root = ReactDOM.createRoot(cases);
        root.render(elem);
    }

    function findSopId(sopName){
        var sopId = null;
        userData.data.Sops.forEach(sop => {
            if (sop.Name === sopName) sopId = sop.id;
        });
        return sopId
    }

    function findFileId(fileName){
        var fileId = null;
        userData.data.Files.forEach(file => {
            if (file.Name === fileName) fileId = file.id;
        });
        return fileId
    }

    async function showcaseSetSop(e){
        const sopName = e.target.getAttribute("sopName");
        const cases = document.getElementById("showcases");
        cases.textContent = "";
        cases.classList.remove("hidden");
        const sopId = findSopId(sopName);
        const data = await fire.getSop(sopId);
        const elem = showSop(data);
        const root = ReactDOM.createRoot(cases);
        root.render(elem);
    }

    async function sendInvite(){
        const email = document.getElementById("mailInv").value;
        const roles = [document.getElementById("userInvRoleSelect").value];
        await fire.sendInvite(userData, {email, roles});
        sendInviteShow(false);
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
            <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='editIcon' sopName={data.Name} onClick={(e) => {showcaseSetSop(e)}} src={icons.edit} alt="hehee" /></div>
            <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='trashIcon' sopName={data.Name} src={icons.trash} alt="hehee" /></div>
        </div>)
    }

    function showSop(data){
        function checkFile(fileName, check){
            return(<div className="sopAccess">
            <div className="accessCheckCont">
                <input type="checkbox" defaultChecked={check} className={`sopAccessCheck ${check ? "checkedAccessBox" : ""}`} name={`fileCheck${fileName}`} id={`fileCheck${fileName}`} />
            </div>
            <label className="sopAccessName" htmlFor={`fileCheck${fileName}`}>{fileName}</label>
        </div>)}

        function findState(data, fileName){
            if (data.Files === null || data.Files === undefined || data.Files.length === 0) return false;
            var res = false;
            data.Files.forEach(file => {
                if(file.Name === fileName){
                    res = true;
                }
            });
            return res;
        }
        return(<div className="showcaseContainer">
        <div className="showcase">
            <div className="showcasePersonMail"><b>{data.Name}</b></div>
            <h6>Files</h6>
            {userData.data.Files.map(file => {return(checkFile(file.Name, findState(data, file.Name)))})}
            <div className="accessButtonCont">
                <button className="btn btn-secondary smallerButton" onClick={cancelEditUser}>Cancel</button>
                <button className="btn btn-primary smallerButton" sopName={data.Name} onClick={(e) => {updateSopFile(e)}}>Done</button>
            </div>
        </div>
    </div>)
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
            {userData.data.Sops.map(sop => {return(checkSop(sop.Name, findState(data, sop.Name)))})}
            <div className="accessButtonCont">
                <button className="btn btn-secondary smallerButton" onClick={cancelEditUser}>Cancel</button>
                <button className="btn btn-primary smallerButton" email={data.email} onClick={(e) => {updatePersonSop(e)}}>Done</button>
            </div>
        </div>
    </div>)
    }

    function adminUser(data){
        return (
        <div className="adminPanelRow adminPanelRowUser" id={`adminPanelUser${data.email}`}>
            <div className="nameFormHead addedElem generalFormHead">{data.Name !== null ? data.Name : "NONE"}</div>
            <div className="emailFormHead addedElem generalFormHead">{data.email}</div>
            <div className="roleFormHead addedElem generalFormHead">{data.Role}</div>
            <div className="activeFormHead addedElem generalFormHead"><span className={data.init ? "activeNo" : "activeYes"}>{data.init ? "No" : "Yes"}</span></div>
            <div className="iconCont generalFormHead addedElem"><img email={data.email} className='editIcon' src={icons.edit} onClick={(e) => {showcaseSet(e)}} alt="hehee" /></div>
            <div className="iconCont generalFormHead addedElem"><img email={data.email} onClick={(e) => {deleteDocument(e)}} className='trashIcon' src={icons.trash} alt="hehee" /></div>
        </div>)
    }

	return (
        <div className='homeAdmin'>
            <div className='panels'>
                {userActive() && userRoleCheck("Admin") && path === '/people' ? adminUserPanel : <></>}
                {userActive() && userRoleCheck("Admin") && path === '/sop' ? adminSopPanel : <></>}
            </div>
            <div className='showcases hidden' id='showcases'>
            </div>
        </div>
	);
}

export default Home;