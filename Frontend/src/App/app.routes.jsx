import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../Features/Pages/Register";
import KrishnaLoader from "../Features/Styles/Loader"

import Login from "../Features/Pages/Login"

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1 style={{ color: "black ", fontFamily: "sans-serif", padding: "40px" }}>Home Page</h1>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {

    path: "/loader",
    element: <KrishnaLoader></KrishnaLoader>
  },

  {

    path: "/Login",
    element: <Login></Login>
  },
]);
