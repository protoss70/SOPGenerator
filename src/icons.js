import heartEmpty from './Icons/hearth_empty.svg';
import heartFilled from './Icons/hearth_filled.svg'
import comment from './Icons/comment.svg'
import inbox from './Icons/inbox.svg';
import profile from './Icons/profile.svg';
import search from './Icons/search.svg';
import plus from './Icons/plus.svg';
import defaultIcon from './Icons/defUser.svg';
import more from "./Icons/more.svg";
import logOut from "./Icons/logout.svg";
import settings from "./Icons/settings.svg";
import security from "./Icons/security.svg";
import exclamation from "./Icons/exc.svg";
import google from "./Icons/google.svg";

const iconHandler = (text) => {
    switch(text) {
        case "default":
          return defaultIcon
        case "likes":
          return heartFilled
        case "comments":
            return comment
        default:
          return text
      }
}

const icons = {
    iconHandler,
    heartEmpty,
    heartFilled,
    comment,
    inbox,
    profile,
    search,
    plus,
    defaultIcon,
    more,
    logOut,
    settings,
    security,
    exclamation,
    google,
}

export default icons;