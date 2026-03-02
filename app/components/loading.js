'use client'

import { useState } from "react"

export default function Loading(){
    const [open, setOpen] = useState(false)
    return (
            <div className="flex flex-col md:flex-row gap-2.5 h-screen">
                <aside
                    className={`z-10
                        fixed top-0 left-0 h-screen px-2.5 py-2.5 gap-2.5 w-full md:w-60 bg-[#8B80FF]
                        flex flex-col transition-transform duration-300 
                        ${open ? "translate-y-0" : "-translate-y-full"}
                        sm:translate-y-0 sm:static
                    `}
                >
                    <div className="flex flex-row gap-2.5 items-center border-b-2 border-purple-100 py-2.5 justify-center">
                        <div className="h-10 w-10 rounded-md bg-purple-100/50 animate-pulse"></div>
                        <div className="w-32 h-3 bg-purple-100/50 rounded-full animate-pulse"></div>
                    </div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                        <div key={id} className="h-10 w-full bg-purple-100/50 rounded-2xl animate-pulse"></div>
                    ))}
                    
                </aside>
                <div className="flex flex-col w-screen mt-0 md:mt-10 px-2 md:px-5 overflow-y-scroll">
                    <div className="grid gap-3 md:gap-3 grid-cols-12 transition-all mt-14 md:mt-0">
                        <div className={`bg-white rounded-2xl col-span-12 lg:col-span-7 p-5 w-full min-w-0 shadow-md`}>
                            <div className="flex flex-col gap-2.5">
                                <div className="pl-1 flex flex-row items-center gap-5">
                                    <div className="bg-gray-300 rounded-full font-bold text-lg md:text-xl w-20 h-6 animate-pulse"></div>
                                    <div className="flex flex-row gap-2.5 bg-gray-300 w-24 h-6 text-white border-2 py-1 px-3 rounded-lg text-sm items-center font-bold animate-pulse"></div>    
                                </div>
                                <div className="flex flex-row justify-between items-center bg-gray-50 px-3 py-5 rounded-full animate-pulse">
                                    <div className="flex gap-3.5 flex-row items-center"> {/* Tambahkan items-center di sini juga */}
                                        <div className="h-15 w-15 hrink-0 overflow-hidden rounded-full object-cover border bg-gray-300 animate-pulse">

                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <p className="bg-gray-300 leading-tight rounded-full w-64 h-6 animate-pulse"></p>
                                            <div className="bg-gray-300 w-32 h-3 rounded-full animate-pulse mt-2"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-16 w-16 text-center px-3 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}