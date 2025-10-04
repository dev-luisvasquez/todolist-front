'use client';

import { useState } from "react";
import { EditProfileForm } from "@/components/template/profile/EditProfileForm";
import { EditPasswordForm } from "../template/profile/EditPasswordForm";

export const ProfilePage = () => {
     const [activeTab, setActiveTab] = useState<"informacion" | "contraseña">("informacion");
    return (
        <div >
            
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white p-4 rounded-lg shadow h-fit">
                    <nav className="space-y-2">
                        <button 
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "informacion" 
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => setActiveTab("informacion")}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Información
                            </div>
                        </button>
                        <button 
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "contraseña" 
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => setActiveTab("contraseña")}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2m6 0a2 2 0 00-2-2m0 0a2 2 0 00-2 2v2m0 0V9a2 2 0 012-2m0 0a2 2 0 012 2v2" />
                                </svg>
                                Contraseña
                            </div>
                        </button>
                        
                    </nav>
                </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white p-4 rounded-lg shadow">
                    {activeTab === "informacion" ? (
                        <EditProfileForm />
                    ) : (
                        <EditPasswordForm />
                    )}
                </div>
            </div>
        
        </div>
    );
};