import React, { useState, useRef } from 'react'
import firebase from 'firebase/compat/app';
import * as userActionCreators from "../../redux/actions/userActions"
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAuth, signInWithPopup, FacebookAuthProvider, AppleAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, OAuthProvider } from "firebase/auth";
import axios from 'axios';
import ResetPassword from './includes/ResetPassword';
import { Link } from 'react-router-dom';

require("firebase/compat/auth")

const Login = ({ ...props }) => {
    const [progress, setProgress] = useState(false)
    const [error, setError] = useState(false)
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const loginWithApple = async (e) => {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        setProgress(true)
        try {
            const auth = getAuth();
            signInWithPopup(auth, provider)
                .then((result) => {
                    // The signed-in user info.
                    const user = result.user;

                    // Apple credential
                    const credential = OAuthProvider.credentialFromResult(result);
                    const accessToken = credential.accessToken;
                    const idToken = credential.idToken;
                    console.log(credential)
                    // ...
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // The credential that was used.
                    const credential = OAuthProvider.credentialFromError(error);

                    // ...
                });
        } catch (error) {
            setProgress(false)
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000)
            console.log(error)
        }
    }
    const loginWithGoogle = async (e) => {
        setProgress(true)
        try {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (userCred) => {
                if (userCred) {
                    props.actions.changeAuth(true)
                    props.actions.changeUserCred(userCred)
                    console.log("ımhere     ")
                    //userCred.user.uid userCred.credential.idToken
                    await axios({
                        url: 'http://localhost:5000/users/googleFacebookAuth',
                        method: 'POST',
                        data: { token: await userCred.user.getIdToken(), uid: userCred.user.uid },
                        withCredentials: true,
                    })
                    window.localStorage.setItem("auth", true)
                    setTimeout(() => {
                        setProgress(false)
                        props.auth ? console.log("login") : window.history.pushState("", "", "/")

                    }, 3000)

                }
            }).catch()
        } catch (error) {
            setProgress(false)
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000)
            console.log(error)
        }
    }
    const loginWithEmailHandler = async (e) => {
        setProgress(true)
        const auth = await getAuth();
        console.log(auth)
        await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                console.log(userCredential)
                // Signed in 
                if (userCredential) {
                    props.actions.changeAuth(true)
                    props.actions.changeUserCred(userCredential)
                    window.localStorage.setItem("auth", true)
                    setTimeout(() => {
                        setProgress(false)
                        props.auth ? console.log("login") : window.history.pushState("", "", "/")

                    }, 3000)

                }
                else {
                    setProgress(false)
                    setError(true)
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                    console.log("Login yapılamadı")
                }
                // ...
            })
            .catch((error) => {
                setProgress(false)
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 3000)
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }
    const loginWithFacebook = async (e) => {
        const provider = new FacebookAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (user) {
                    const credential = FacebookAuthProvider.credentialFromResult(result);
                    const accessToken = credential.accessToken;
                    props.actions.changeAuth(true)
                    props.actions.changeUserCred(credential)
                    window.localStorage.setItem("auth", true)
                    props.auth ? console.log("login") : window.history.pushState("", "", "/")
                }
                else {
                    window.alert("Login başarısız!")
                }


            })
            .catch((error) => {
                console.log(error)

                // ...
            });
    }
    return (
        <div>
            <div className='px-5 py-5'>
                {props.auth ? "" : (
                    <>   <h1>Login Page</h1>
                        {error ? (
                            <button class="btn btn-danger my-3" type="button" disabled>

                                Giriş Yapılamadı...
                            </button>
                        ) : ""}
                        {progress ? (
                            <button class="btn btn-primary my-3" type="button" disabled>
                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Giriş Yaplıyor...
                            </button>
                        ) : ""}
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Email address</label>
                            <input ref={emailRef} type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                            <input ref={passwordRef} type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                        </div> <div class="mb-3">
                            <Link to={"/reset-password"}>ResetPassword</Link>
                        </div>
                        <button onClick={loginWithApple} className='btn btn-primary'>Signin Via Email</button><br />
                        <button onClick={loginWithFacebook} className='btn btn-primary my-3'>Signin With FacebookAuthProvider <i class="ms-2    fa-brands fa-facebook"></i>
                        </button>
                        <br />
                        <button onClick={loginWithGoogle} className='btn btn-primary'>Signin With GoogleAuthProvider <img className='ms-2' style={{ width: 20 }} src='/google.png' />
                        </button></>
                )}
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    console.log(state)
    return {
        auth: state.authReducer,
        token: state.tokenReducer,
        userCred: state.usercredReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            changeAuth: bindActionCreators(userActionCreators.changeAuth, dispatch),
            changeToken: bindActionCreators(userActionCreators.changeToken, dispatch),
            changeUserCred: bindActionCreators(userActionCreators.changeUserCred, dispatch),
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)