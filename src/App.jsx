// import "./App.css"
// import { AuthProvider } from "./auth/AuthContext"
// import AppRouter from "./router/Router"

// function App() {
//   return (
//     <AuthProvider>
//       <AppRouter />
//     </AuthProvider>
//   )
// }

// export default App


import "./App.css"
import { RouterProvider } from "react-router-dom"
import ToastProvider from "./components/ToastProvider"
import { AuthProvider } from "./auth/AuthContext"
import Router from "./router/Router"
function App(){
  return(
    <AuthProvider>

      <RouterProvider router={Router}/>
    </AuthProvider>
  )
}
export default App