import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserListProvider } from './Context/myContext';
import { routes } from './routes/routes.config';

const router = createBrowserRouter(routes);

function App() {
  return (
    <UserListProvider>
      <RouterProvider router={router} />
    </UserListProvider>
  );
}

export default App;
