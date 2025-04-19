// import Home from "./pages/home"
// import Login from "./pages/login"
// import Register from "./pages/register"
// import { ContestantDashboard } from "./pages/contestantDashboard.jsx";
import CourseCreation from "./components/course-creation.jsx";



import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
      
      <Route path="/" element={<CourseCreation />} />


        {/* <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ContestantDashboard />} /> */}
       

      </Routes>
    </BrowserRouter>
  )
}

export default App
