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

    function loggedOptions(){
        return props.user !== null ? (

            <div>
                <div className="listOfNavItems">
                    <Link className='aOfNav' to={"/dashboard"}><button className={`item1 btn navBtn ${path === "/dashboard" ? "active" : ""}`}>Dashboard</button></Link>
                    <Link className='aOfNav' to={"/checkups"}><button className={`item2 btn navBtn ${path === "/checkups" ? "active" : ""}`}>New</button></Link>
                    <Link className='aOfNav' to={"/infograph"}><button className={`item3 btn navBtn ${path === "/infograph" ? "active" : ""}`}>People</button></Link>
                    <Link className='aOfNav' to={"/information"}><button className={`item4 btn navBtn ${path === "/information" ? "active" : ""}`}>Information</button></Link>
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