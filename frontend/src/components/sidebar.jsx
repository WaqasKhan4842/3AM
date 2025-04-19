import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
    const menuItems = [
        { name: "Course Creation", path: "/", icon: faGraduationCap },
        { name: "Teachers", path: "/teachers", icon: faGraduationCap },
    ];

    return (
        <div className="w-1/5 bg-[#02010A] text-white p-6">
            <div className="flex items-center mb-8">
                <FontAwesomeIcon icon={faGraduationCap} className="text-[#FED766] text-2xl mr-3" />
                <h1 className="text-xl font-bold">EduPlatform</h1>
            </div>
            <nav>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <Link
                                to={item.path}
                                className="w-full flex items-center p-3 rounded-lg hover:bg-[#FED766] hover:text-[#02010A] font-medium transition"
                            >
                                <FontAwesomeIcon icon={item.icon} className="mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-6">
                    <div className="bg-gray-800 p-4 rounded-lg mt-6">
                        <h3 className="text-sm font-semibold text-[#97EFE9] mb-2">Need Help?</h3>
                        <p className="text-xs text-gray-300">Check out our guides on creating effective educational content.</p>
                        <button className="mt-3 text-xs flex items-center text-[#FED766] hover:text-white">
                            <FontAwesomeIcon icon={faQuestionCircle} className="mr-1" />
                            View Instructor Resources
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
