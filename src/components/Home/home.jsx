import './home.css';

function Home(props) {
    const user = props.user.user;
    const userData = props.user.userData;
    console.log(props)

    const adminPanel = (<div>
        <label htmlFor="mailInv">Email Adress</label>
        <input type="email" name="mailInv" id="mailInv" />
        <label htmlFor="superUser">Super User</label>
        <input type="checkbox" name="superUser" id="superUser" />
        <label htmlFor="superUser">Maintainer</label>
        <input type="checkbox" name="superUser" id="superUser" />
        <label htmlFor="superUser">Worker</label>
        <input type="checkbox" name="superUser" id="superUser" />
        <button className="btn btn-primary">Send Invite</button>
    </div>)

	return (
        <div>
            {userData.private.Roles.includes("Admin") ? adminPanel : <></>}
        </div>
	);
}

export default Home;