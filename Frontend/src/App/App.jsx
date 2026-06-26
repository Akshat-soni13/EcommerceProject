import React, { useEffect } from 'react';
import { RouterProvider } from "react-router-dom"
import { routes } from './app.routes';
import { userAuth } from '../Features/Auth/Hook/useAuth';

const App = () => {
  const { FetchCurrentUser } = userAuth();

  useEffect(() => {
    FetchCurrentUser();
  }, []);

  return (
    <RouterProvider router={routes} />
  );
}

export default App;