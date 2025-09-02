import React, { useRef, useState } from 'react'
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

export default function Login() {

const router = useRouter();

const email = useRef();
const pass = useRef();
const info = useRef();
const [comm, setComm] = useState();

const handleLogin = async() => {
    console.log(email.current.value+" with pass: "+pass.current.value)

    let ref = await fetch('/api/login', {
        method: 'POST',
        model:"no-cors",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods':'GET, POST',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          email: email.current.value,
          pass: pass.current.value
        })
      }
      )

      if(ref.status === 200){
        info.current.style.visibility = "visible"
        info.current.style.backgroundColor = "green"
        setTimeout(() => {
          router.push("/panel")
        }, 900)
        setComm("Zalogowano")
      } else {
        info.current.style.visibility = "visible"
        setComm("Dane nie są zgodne")
      }

  }

  return (
    <div className='bg-gray-100 w-[500px] flex flex-col p-5 mx-auto mt-52'>
      <div className='text-center text-lg pb-5 font-bold'>Logowanie</div>
        <div ref={info} className='invisible w-full h-10 bg-red-600 text-white text-center leading-10'>{comm}</div>
        <label id="login">Adres e-mail</label>
        <input ref={email} name="email" type="mail" className='border-2 rounded-md mb-3 h-10'></input>
        <label id="pass">Hasło</label>
        <input ref={pass} name="pass" className='border-2 rounded-md h-10'></input>
        <button type="submit" onClick={handleLogin} name="submit" className='mt-6 h-10 bg-green-600 text-white rounded-md font-bold'>Zaloguj się</button>
        <div className='text-center text-sm mt-3'>Nie masz konta? <Link href='/signup' className='text-blue-500 font-semibold'>Zarejestruj się</Link></div>
    </div>
  )
}
