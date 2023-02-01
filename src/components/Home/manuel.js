import icons from '../../icons';
import ReactDOM from 'react-dom/client';
import createNotif from '../Notification/notification';

export function adminManuelPanel(userData, fire){

    var editFieldUpdated = false;
    var fileFieldUpdated = false;

    function adminSop(data){
    return (
    <div className='adminPanelRow adminPanelRowUser' fileName={data.Name} onClick={(e) => {showcaseSetSop(e)}}>
        <div className="nameSopFormHead addedElem generalFormHead generalFormSopHead">{data.Name}</div>
        <div className="descriptionSopFormHead urlFileFormHead scrollable addedElem generalFormHead generalFormSopHead"><a onClick={(e) => {e.stopPropagation()}} target="_blank" href={data.url}>{data.url}</a></div>
        <div className="iconCont generalFormHead addedElem generalFormSopHead"><img className='trashIcon' fileName={data.Name} src={icons.trash} alt="hehee" /></div>
    </div>)
    }

    async function showcaseSetSop(e){
        e.stopPropagation();
        const fileName = e.target.parentElement.getAttribute("fileName");
        const cases = document.getElementById("showcases");
        const panels = document.getElementById("panels");
        panels.classList.add('hidden');
        cases.classList.remove("hidden");
        cases.textContent = "";
        console.log(fileName);
        const fileId = findFileId(fileName);
        console.log(fileId);
        const data = await fire.getFile(fileId);
        console.log(data);
        const elem = showFile(data);
        const root = ReactDOM.createRoot(cases);
        root.render(elem);
    }

    function showFile(data){
        return(<div className="showcaseContainer">
        <div className="showcase">
            <div className="showcasePersonMail"><b>{data.Name}</b></div>
            <span className='accessText'>Update or inspect uploaded files.</span>
            <div className='dataDescription'>
                <div className='descContainer'>
                    <b>Description: </b>
                    <div onClick={toggleEditFiels}>
                        <img src={icons.edit} id="showcaseEditIcon" className="editIcon" alt='he'/>
                    </div>
                </div>
                <div className='fileDescription' id="showcaseDesc">{data.Description}</div>
                <textarea className='fileEditText hidden' defaultValue={data.Description} id='showcaseDescEdit' onChange={() => {document.getElementById("fileUpdateButton").classList.remove("hidden"); editFieldUpdated=true}}></textarea>
            </div>
            <b>Url: </b>
            <div className='urlShowcase'><a target="_blank" href={data.url}>{data.url}</a></div>
            <b>Upload New File: </b>
            <input type="file" id="updateFileInp" onChange={e => fileUpdateChange(e)} accept="application/pdf" />
            <div className="accessButtonCont">
                <button className="btn btn-secondary smallerButton" onClick={cancelEditUser}>Close</button>
                <button className="btn btn-success smallerButton hidden" onClick={e => {updateButton(e)}} id='fileUpdateButton' fileName={data.Name}>Update</button>
            </div>
        </div>
        </div>)
    }

    function findFileId(fileName){
        var fileId = null;
        userData.data.Files.forEach(file => {
            if (file.Name === fileName) fileId = file.id;
        });
        return fileId
    }

    function cancelEditUser(){
        const cases = document.getElementById("showcases");
        cases.classList.add("hidden");
        const panels = document.getElementById("panels");
        panels.classList.remove('hidden');
        cases.textContent = "";
    }

    function toggleEditFiels(){
        if (document.getElementById("showcaseDesc").classList.contains("hidden")){
            document.getElementById("showcaseDesc").classList.remove("hidden");
            document.getElementById("showcaseDescEdit").classList.add("hidden");
            document.getElementById("showcaseEditIcon").src= icons.edit;
            editFieldUpdated = false;
            if (!fileFieldUpdated){
                document.getElementById("fileUpdateButton").classList.add("hidden");
            }
        }else{
            document.getElementById("showcaseDesc").classList.add("hidden");
            document.getElementById("showcaseDescEdit").classList.remove("hidden");
            document.getElementById("showcaseEditIcon").src= icons.cross;
        }
    }

    async function updateButton(e){
        console.log(editFieldUpdated, fileFieldUpdated);
        const updates = {};
        const fileName = e.target.getAttribute("fileName");
        if (editFieldUpdated){
            updates.Description = document.getElementById("showcaseDescEdit").value;
        }
        if (fileFieldUpdated){
            //Do file updates later
        }
        const id = findFileId(fileName);
        console.log(id, updates);
        try{
            await fire.updateFile(id, updates);
            cancelEditUser();
            createNotif({title: "File Updated", text: "Succesfully updated the file", mode: "success"});
        }catch(e){
            createNotif({title: "Failed", text: "Failed to update file, please try again later", mode: "danger"});
        }
    }

    function fileUpdateChange(){
        console.log(document.getElementById("updateFileInp").value);
        if (document.getElementById("updateFileInp").value != ""){
            fileFieldUpdated = true;
            document.getElementById("fileUpdateButton").classList.remove("hidden");
            console.log("annei skym");
        }else if (!editFieldUpdated){
            document.getElementById("fileUpdateButton").classList.add("hidden");
        }else{
            fileFieldUpdated = false;
        }
    }

    return(<div className='adminContainer'>
    <div className="adminPanelContainer">
        <div id="adminPanel">
            <div className="adminPanelRow">
                <div className="nameSopFormHead generalFormHead b topLeftPad">File Name</div>
                <div className="urlFileFormHead generalFormHead b">url</div>
                <div className="generalFormHead b headEmptySpace topRightPad"></div>
            </div>
            {userData !== null ? userData.data.Files.map(file => {return (adminSop(file))}) : <></>}
            <div className='adminPanelRow' id='plusIconRow'>
                <div className='plusIconCont'><img className='plusIcon' src={icons.plus} alt='You will never get to see this image muhahahahaha!!!'/></div>
            </div>
        </div>
    </div>
</div>)
}