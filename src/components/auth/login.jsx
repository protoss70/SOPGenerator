import icons from "../../icons";
import "./auth.css";
import  { useNavigate } from 'react-router-dom';


function LogIn(props) {
    const fire = props.fire;
    const history = useNavigate();
    var userType = "User";

    if (props.user !== null){
        history("/");
    }

    async function sign(){
        await fire.sign();
        const pass = await fire.newUser();
        console.log(pass);
        if (pass){
            history("/");
        }else{
            console.log("some error!");
        }
    }

    return (
        <div className="sign">
            <div>
                <h2>Log In</h2>
                <div className="restSign">
                    <button onClick={sign} className="instantLogIn btn btn-light"> 
                        <img src={icons.google} className="googleIcon"/>
                        <div className="googleLogText">Login with Google</div>
                    </button>
                </div>
            </div>
            
        </div>
    );
}

export default LogIn;