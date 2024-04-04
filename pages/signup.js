import React from 'react'
import Link from 'next/link';
import { useRef, useState } from 'react'
import mongoose from 'mongoose'

export default function Signup() {

const info = useRef();  
const firstname = useRef();
const lastname = useRef();
const email = useRef();
const phone = useRef();
const pass = useRef();

const [comm, setComm] = useState();

const handleSignIn = (e) => {
    console.log(email.current.value+" with pass: "+pass.current.value)
    
    e.preventDefault();

    fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: firstname.current.value,
          lastname: lastname.current.value,
          email: email.current.value,
          phone: phone.current.value,
          pass: pass.current.value,
        })
      })
      
    }

return (
  <form className='bg-gray-100 w-[300px] flex flex-col p-5 mx-auto mt-52'>
  <div className='text-center text-lg pb-5 font-bold'>Logowanie</div>
    <div ref={info} className='invisible w-80 h-10 bg-red-600 text-white text-center'>{comm}</div>
    <label id="firstname">Imię</label>
    <input ref={firstname} name="firstname" type="mail" className='border-2 rounded-md mb-3 h-10'></input>
    <label id="lastname">Nazwisko</label>
    <input ref={lastname} name="lastname" type="mail" className='border-2 rounded-md mb-3 h-10'></input>
    <label id="email">Adres e-mail</label>
    <input ref={email} name="email" type="mail" className='border-2 rounded-md mb-3 h-10'></input>
    <label id="phone">Numer telefonu</label>
    <input ref={phone} name="phone" type="mail" className='border-2 rounded-md mb-3 h-10'></input>
    <label id="pass">Hasło</label>
    <input ref={pass} name="pass" className='border-2 rounded-md h-10'></input>
    <button type="submit" onClick={handleSignIn} name="submit" className='mt-6 h-10 bg-green-600 text-white rounded-md font-bold'>Zarejestruj się się</button>
    <div className='text-center text-sm mt-3'>Nie masz konta? <Link href='/login' className='text-blue-500 font-semibold'>Zaloguj się</Link></div>
</form>
  )
}
