import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from  "./pages/home";
import Sidebar from "./components/Sidebar";
import CourseCreation from "./components/CourseCreation";
import Teacher from "./components/Teacher";
import TutorDashboard from "./components/teacherDashboard";


const App = () => {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="w-4/5">
                    <Routes>
                    <Route path="/home" element={< Home/>} />
                        <Route path="/course-creation" element={<CourseCreation />} />
                        <Route path="/teachers" element={<Teacher />} />
                       <Route path="/dashboard" element={<TutorDashboard />} />

                    </Routes>
                </div>
            </div>
          
        </BrowserRouter>
        
    );
};

export default App;
