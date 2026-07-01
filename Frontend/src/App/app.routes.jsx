import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../Features/Auth/Pages/Register"
import KrishnaLoader from "../Features/Auth/Styles/Loader"
import Login from "../Features/Auth/Pages/Login"
import CreateProduct from "../Features/Products/pages/CreateProduct"
import { Dashboard } from "../Features/Products/pages/Dashboard";
import Protected from "../Features/Auth/components/Protected";

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
        element:<Protected
        role="seller"
        >
          <CreateProduct></CreateProduct>
        </Protected>
      }
      ,
      {
        path:"/seller/dashBoard",
        element:
        <Protected role="seller">
          <Dashboard></Dashboard>
        </Protected>
      }
    ]
  }
]);
