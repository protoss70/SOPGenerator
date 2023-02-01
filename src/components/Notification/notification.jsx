import './notification.css';
import ReactDOM from 'react-dom/client';

function Notification(settings) {
	return (
        <div id='notificationBody' className={`notificationBody ${settings.mode === "success" ? "greenNotif" : "redNotif"}`}>
            <h4 className='notificationTitle'>{settings.title}</h4>
            <span className='notificationText'>{settings.text}</span>
        </div>
	);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function delay() {
    await sleep(2200);
    const elem = document.getElementById("notificationBody");
    elem.classList.add("hideNotif");
    await sleep(700);
    elem.remove();
}

function createNotif(settings){
    const elem = Notification(settings);
    const root = ReactDOM.createRoot(
        document.getElementById('notifBody')
    );
    root.render(elem);
    delay();

}

export default createNotif;