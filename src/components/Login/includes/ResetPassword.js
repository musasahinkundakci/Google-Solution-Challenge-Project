import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState, useRef } from 'react'
const ResetPassword = () => {
    const emailRef = useRef("")
    const loginWithEmailHandler = async (e) => {
        const auth = getAuth()
        await sendPasswordResetEmail(auth, emailRef.current.value).then((res) => {
            console.log(res)
        }).catch(err => console.log(err))

    }

    return (
        <div className='px-5 py-5'>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                <input ref={emailRef} type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
            </div>   <button onClick={loginWithEmailHandler} className='btn btn-primary my-3'>Send reset password Link <i class="ms-2    fa-brands fa-facebook"></i></button>
        </div>
    )
}

export default ResetPassword