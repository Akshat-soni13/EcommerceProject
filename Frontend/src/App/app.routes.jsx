import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../Features/Pages/Register";
import KrishnaLoader from "../Features/Styles/Loader"
import Login from "../Features/Pages/Login"
import HomePage from "../Features/Pages/Home";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
