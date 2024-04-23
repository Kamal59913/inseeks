import { BrowserRouter,Routes, Route} from 'react-router-dom';
// import { PostAnyThing } from './Components/CreatePost/postAnything';
// import { PostStory } from './Components/CreatePost/postStory';
// import { PostImages } from './Components/CreatePost/postImage';
// import { PostVideo } from './Components/CreatePost/postVideo';
import HOME from './Components/Pages/HomePage'
// import ENV from './Components/environments'
// import MESSAGES from './Components/messages'
// import MYPROFILE from './Components/myProfile'
// import PROFILESETTINGS from './Components/myprofile-settings'
// import SINGLESTORY from './Components/singlestory'
// import MULTISTORIES from './Components/stories'
// import SINGLEPOST from './Components/zoompost'
// import USER from './Components/user-profile'
// import PHOTOARRAY from './Components/singlephoto'
// import VideoCalling from './Components/videoChat'
// import OpenEvent from './Components/singleEvent'
// import SignUpPage from './Components/AuthenticationPages/signUpPage'
import LoginPage from './Components/AuthenticationPages/loginPage';
import MyProfile from './Components/Pages/currentuserprofile';
import MyProfileSettings from './Components/Pages/myprofilesettings';
import UserProfile from './Components/Pages/userprofile'
import SearchResults from './Components/searchResults';
import Follow from './Components/Pages/follow';
import BlogPost from './Components/Pages/blogpost'
import VideoPost from './Components/Pages/videopost'
import ImagePost from './Components/Pages/imagepost'

import "./styles/color.css";
import "./styles/font.css";
import "./styles/index.css";
import "./styles/tailwind.css";


import './Global.scss';
import './events.css'
import './singlestory.css'
import './homepage.css'
import { UserListProvider } from './Context/myContext';

function App() {
  return (   
    <UserListProvider>
    <BrowserRouter>
       <Routes>
        <Route path='/' element={<LoginPage/>}></Route>
        <Route path='/h' element={<HOME/>}></Route>
        <Route path='/profile' element={<MyProfile/>}></Route>
        <Route path='/settings' element={<MyProfileSettings/>}></Route>
        <Route path='/user/:username' element={<UserProfile/>}></Route>
        <Route path='/searchresults' element={<SearchResults/>}></Route>
        <Route path='/h/follow' element={<Follow/>}></Route>
        <Route path='/h/blog' element={<BlogPost/>}></Route>
        <Route path='/h/video' element={<VideoPost/>}></Route>
        <Route path='/h/image' element={<ImagePost/>}></Route>
       </Routes>
    </BrowserRouter>
    </UserListProvider>
  );
}

export default App;
