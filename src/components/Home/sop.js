import icons from '../../icons';
import ReactDOM from 'react-dom/client';
import createNotif from '../Notification/notification';

export function adminSopPanel(userData, fire){

    var editFieldUpdated = false;
    var checkFieldUpdated = false;

    function adminSop(data){
    return (
    <div className='adminPanelRow adminPanelRowUser' sopName={data.Name} onClick={(e) => {showcaseSetSop(e)}}>
        <div className="nameSopFormHead addedElem generalFormHead generalFormSopHead">{data.Name}</div>
        <div className="descriptionSopFormHead scrollable addedElem generalFormHead generalFormSopHead">{data.Description}</div>
        <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='trashIcon' sopName={data.Name} src={icons.trash} alt="hehee" /></div>
    </div>)
    }

    async function showcaseSetSop(e){
        e.stopPropagation();
        const sopName = e.target.parentElement.getAttribute("sopName");
        const cases = document.getElementById("showcases");
        const panels = document.getElementById("panels");
        panels.classList.add('hidden');
        cases.textContent = "";
        cases.classList.remove("hidden");
        const sopId = findSopId(sopName);
        const data = await fire.getSop(sopId);
        const elem = showSop(data);
        const root = ReactDOM.createRoot(cases);
        root.render(elem);
    }

    function showSop(data){
        function checkFile(fileName, check){
            return(<div className="sopAccess">
            <div className="accessCheckCont">
                <input type="checkbox" onChange={() => {checkFieldUpdated = true}} defaultChecked={check} className={`sopAccessCheck ${check ? "checkedAccessBox" : ""}`} name={`fileCheck${fileName}`} id={`fileCheck${fileName}`} />
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
            <div className='dataDescription'>
                <div className='descContainer'>
                    <b>Description: </b>
                    <div onClick={toggleEditFiels}>
                        <img src={icons.edit} id="showcaseEditIcon" className="editIcon" alt='he'/>
                    </div>
                </div>
                <div className='fileDescription' id="showcaseDesc">{data.Description}</div>
                <textarea className='fileEditText hidden' defaultValue={data.Description} id='showcaseDescEdit' onChange={() => {editFieldUpdated=true}}></textarea>
            </div>
            <h6>Files</h6>
            <span className='accessText'>Manage the manuel files that will be searched in order to answer the questions of your users.</span>
            {userData.data.Files.map(file => {return(checkFile(file.Name, findState(data, file.Name)))})}
            <div className="accessButtonCont">
                <button className="btn btn-secondary smallerButton" onClick={cancelEditUser}>Cancel</button>
                <button className="btn btn-primary smallerButton" sopName={data.Name} onClick={(e) => {updateSopFile(e)}}>Done</button>
            </div>
        </div>
        </div>)
    }

    function toggleEditFiels(){
        if (document.getElementById("showcaseDesc").classList.contains("hidden")){
            document.getElementById("showcaseDesc").classList.remove("hidden");
            document.getElementById("showcaseDescEdit").classList.add("hidden");
            document.getElementById("showcaseEditIcon").src= icons.edit;
            editFieldUpdated = false;
        }else{
            document.getElementById("showcaseDesc").classList.add("hidden");
            document.getElementById("showcaseDescEdit").classList.remove("hidden");
            document.getElementById("showcaseEditIcon").src= icons.cross;
        }
    }

    function findSopId(sopName){
    var sopId = null;
    userData.data.Sops.forEach(sop => {
        if (sop.Name === sopName) sopId = sop.id;
    });
    return sopId
    }

    async function updateSopFile(e) {
        console.log(editFieldUpdated, checkFieldUpdated);
        if (editFieldUpdated && checkFieldUpdated){
            //do batch
        }else if (checkFieldUpdated){
            const activeFiles = []
            userData.data.Files.forEach(file => {
                if (document.getElementById(`fileCheck${file.Name}`).checked) activeFiles.push(file);
            })
            const sopName = e.target.getAttribute("sopName");
            const sopId = findSopId(sopName)
            console.log(sopId);
            try{
                await fire.sopUpdate(sopId, {Files: activeFiles});
                cancelEditUser();
                createNotif({title: "Sop Updated", text: "Succesfully updated the sop", mode: "success"});
            }catch(e){
                createNotif({title: "Failed", text: "Failed to update, please try again later.", mode: "danger"});
            }
        }
    }

    function cancelEditUser(){
    const cases = document.getElementById("showcases");
    cases.classList.add("hidden");
    const panels = document.getElementById("panels");
    panels.classList.remove('hidden');
    cases.textContent = "";
    }

    return(<div className='adminContainer'>
    <div className="adminPanelContainer">
        <div id="adminPanel">
            <div className="adminPanelRow">
                <div className="nameSopFormHead generalFormHead b topLeftPad">Sop Name</div>
                <div className="descriptionSopFormHead generalFormHead b">Description</div>
                <div className="generalFormHead b headEmptySpace topRightPad"></div>
            </div>
            {userData !== null ? userData.data.Sops.map(sop => {return (adminSop(sop))}) : <></>}
            <div className='adminPanelRow' id='plusIconRow'>
                <div className='plusIconCont'><img className='plusIcon' src={icons.plus} alt='You will never get to see this image muhahahahaha!!!'/></div>
            </div>
        </div>
    </div>
</div>)
}