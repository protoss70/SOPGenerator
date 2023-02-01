import './Nav.css';
import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';

function Nav(props) {
  	const history = useNavigate();

	async function logout(){
		await props.logout();
		history("/");
	}

	var [path, setPath] = useState("");
	useEffect(() => {
		setPath(window.location.pathname);
	}, [window.location.pathname])

	function hideShowcase(){
		document.getElementById("panels").classList.remove('hidden');;
		document.getElementById("showcases").classList.add("hidden");
	}

    function loggedOptions(){
        return props.user !== null ? (
            <div>
                <div className="listOfNavItems">
                    <Link className='aOfNav' to={"/people"}><button onClick={hideShowcase} className={`item1 btn navBtn ${path === "/people" ? "active" : ""}`}>People</button></Link>
                    <Link className='aOfNav' to={"/sop"}><button onClick={hideShowcase} className={`item2 btn navBtn ${path === "/sop" ? "active" : ""}`}>Sop</button></Link>
                    <Link className='aOfNav' to={"/files"}><button onClick={hideShowcase} className={`item3 btn navBtn ${path === "/files" ? "active" : ""}`}>Files</button></Link>
                </div>
			</div>
        ) : <></>
    }

	return (
		<div className="Nav">
			<Link to="/" className='logA'><div className="logo">SOP Generator</div></Link>
            {loggedOptions()}
			{props.user === null ? <Link className='loginLink logA' to="/login">Log In</Link> : <></>}
			{props.user === null ? <></> : <Link className='loginLink logA' onClick={logout} to="/">Log Out</Link>}
		</div>
	);
}

export default Nav;