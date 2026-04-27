import { RouteObject } from 'react-router-dom';
import { PublicRoute } from '../Components/Auth/Wrapper/PublicRoute';
import { ProtectedRoute } from '../Components/Auth/Wrapper/ProtectedRoute';

import HOME from '../Components/Pages/HomePage';
import LoginPage from '../Components/AuthenticationPages/loginPage';
import MyProfile from '../Components/Pages/currentuserprofile';
import MyProfileSettings from '../Components/Pages/myprofilesettings';
import UserProfile from '../Components/Pages/userprofile';
import SearchResults from '../Components/searchResults';
import Follow from '../Components/Pages/follow';
import BlogPost from '../Components/Pages/blogpost';
import VideoPost from '../Components/Pages/videopost';
import ImagePost from '../Components/Pages/imagepost';
import Environments from '../Components/Pages/environments';
import EnvSpecificHomePage from '../Components/Pages/envSpecificHomePage';
import Messages from '../Components/messages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HOME />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <MyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <MyProfileSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/:username',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/searchresults',
    element: (
      <ProtectedRoute>
        <SearchResults />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home/follow',
    element: (
      <ProtectedRoute>
        <Follow />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home/blog',
    element: (
      <ProtectedRoute>
        <BlogPost modalId="temp" data={{}} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home/video',
    element: (
      <ProtectedRoute>
        <VideoPost modalId="temp" data={{}} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home/image',
    element: (
      <ProtectedRoute>
        <ImagePost modalId="temp" data={{}} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/environments',
    element: (
      <ProtectedRoute>
        <Environments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/env-home-page/:envname',
    element: (
      <ProtectedRoute>
        <EnvSpecificHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/home/messages',
    element: (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
  },
];
