import {RouterProvider} from "react-router-dom"
import { routes } from './app.routes';
import { Provider } from "react-redux";
import { store } from './app.store';
Provider



const App = () => {
  return (

    <RouterProvider router={routes}>

    </RouterProvider>

  )
}

export default App