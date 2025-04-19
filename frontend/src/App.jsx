import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CourseCreation from "./components/CourseCreation";
import Teacher from "./components/Teacher";

const App = () => {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="w-4/5">
                    <Routes>
                        <Route path="/" element={<CourseCreation />} />
                        <Route path="/teachers" element={<Teacher />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
