import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../Features/Auth/Pages/Register"
import KrishnaLoader from "../Features/Auth/Styles/Loader"
import Login from "../Features/Auth/Pages/Login"
import CreateProduct from "../Features/Products/pages/CreateProduct"
import { Dashboard } from "../Features/Products/pages/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element:<h1>Hello</h1>
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
  {
    path:"/seller",
    children:[
      {
        path:"/seller/create-product",
        element:<CreateProduct></CreateProduct>
      }
      ,
      {
        path:"/seller/dashBoard",
        element:<Dashboard></Dashboard>
      }
    ]
  }
]);
