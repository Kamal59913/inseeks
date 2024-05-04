import { BrowserRouter,Routes, Route} from 'react-router-dom';

import HOME from './Components/Pages/HomePage'
import LoginPage from './Components/AuthenticationPages/loginPage';
import MyProfile from './Components/Pages/currentuserprofile';
import MyProfileSettings from './Components/Pages/myprofilesettings';
import UserProfile from './Components/Pages/userprofile'
import SearchResults from './Components/searchResults';
import Follow from './Components/Pages/follow';
import BlogPost from './Components/Pages/blogpost'
import VideoPost from './Components/Pages/videopost'
import ImagePost from './Components/Pages/imagepost'
import Environments from './Components/Pages/environments'
import EnvSpecificHomePage from './Components/Pages/envSpecificHomePage'
import Messages from './Components/messages'

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
        <Route path='/environments' element={<Environments/>}></Route>
        <Route path='/env-home-page/:envname' element={<EnvSpecificHomePage/>}></Route>
        <Route path='/h/messages' element={<Messages/>}></Route>

       </Routes>
    </BrowserRouter>
    </UserListProvider>
  );
}

export default App;
