'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login(){
    const[nisn, setNisn] = useState('')
    const[password, setPassword] = useState('')
    const router = useRouter()
    const handelSubmit = async(e) => {
        e.preventDefault();
        const data = { nisn, password }

        try {
            const response = await fetch("/api/siswa", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) { 
                alert(result.message || 'responsenya ga oke ni bray');
            } else {
                alert('Welcome ' + result.user.nama);
                setNisn('');
                setPassword('');
                router.push(`/dashboard/${result.user.uuid}`); 
            }
        } catch (err) {
            console.error('errornya nih bray: ', err);
            alert('Servernya error bray');
        }
    }

    const [showPassword, setShowPassword] = useState('password')
    function handleShowPassword(){
        if(showPassword == 'password'){
            setShowPassword('text')
        }else{
            setShowPassword('password')
        }
    }
    return(
        <div className="bg-[url(/background-login.png)] bg-center bg-no-repeat bg-size-[100%_100%] flex gap-5 justify-start py-24 items-center w-full h-screen flex-col">
            <Image
                alt="ror"
                src="/logo.png"
                width={100}
                height={100}></Image>
            <h3 className="text-2xl text-gray-600 font-bold my-5">Sign in to your SIJA Account</h3>
            <form onSubmit={handelSubmit} className="bg-white px-8 py-10 flex flex-col text-gray-500 rounded-2xl">
                <label htmlFor="nisn">Nisn</label>
                <input 
                    name="nisn"
                    type="text" 
                    placeholder="Masukkan Nisn"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="border-2 border-gray-500 placeholder:text-gray-300 rounded-sm py-2 px-3 focus:border-blue-400 focus:outline-blue-400" required/>
                <label htmlFor="password" className="mt-5">Password</label>
                <input 
                    name="password"
                    type="password" 
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-gray-500 placeholder:text-gray-300 rounded-sm py-2 px-3 focus:border-blue-400 focus:outline-blue-400" required/>
                <button type="submit" className="bg-linear-to-r from-[#C786FE] to-[#4CC6FF] text-white font-bold text-xl shadow-[0px_0px_23px_-3px_#16A9FC] p-2 rounded mt-5 hover:cursor-pointer hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    )
}