import styles from '../styles/Register.module.css'
import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { toast } from 'react-toastify'

export default function Register() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatpassword, setReatPassword] = useState('')

  useEffect(() => {
    const { error, success } = router.query
    const errors = {
      Signin: 'Try signing with a different account.',
      OAuthSignin: 'Try signing with a different account.',
      OAuthCallback: 'Try signing with a different account.',
      OAuthCreateAccount: 'Try signing with a different account.',
      EmailCreateAccount: 'Try signing with a different account.',
      Callback: 'Try signing with a different account.',
      OAuthAccountNotLinked:
        'To confirm your identity, sign in with the same account you used originally.',
      EmailSignin: 'Check your email address.',
      CredentialsSignin:
        'Sign in failed. Check the details you provided are correct.',
    }

    if (error) {
      const errorMessage = error && (errors[error] ?? error)
      toast.error(errorMessage, { toastId: 'error' })
      router.replace('/register')
    }
    if (success) {
      toast.success(success, { toastId: 'success' })
      router.replace('/register')
    }
  }, [router])

  const signinSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('signin', {
      redirect: false,
      email,
      password,
    })

    if (!result.error) {
      router.replace('/account?success=Successfully logged in')
    }
    if (result.error) {
      router.replace('/register?error=' + result.error)
    }

    setEmail('')
    setPassword('')
  }
  const signupSubmit = async (e) => {
    e.preventDefault()
    if (repeatpassword != password) {
      toast.error("Retyped password doesn't match", { toastId: 'error' })
      return
    }

    // console.log("my name", name)
    // console.log("my password", password)
    // console.log("my email", email)

    const result = await signIn('signup', {
      redirect: false,
      name,
      email,
      password,
    })

    if (!result.error) {
      router.replace('/account?success=Successfully signed up')
    }
    if (result.error) {
      router.replace('/register?error=' + result.error)
    }
    setName('')
    setEmail('')
    setReatPassword('')
    setPassword('')
  }

  return (
    <div className={styles.main}>
      <form
        onSubmit={signupSubmit}
        style={{ width: '300px' }}
        className={styles.form}
      >
        <strong>Sign Up</strong>
        <br />
        <input
          required
          placeholder="enter name"
          value={name}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <input
          required
          placeholder="enter email"
          value={email}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          required
          placeholder="enter password"
          value={password}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <input
          required
          placeholder="repeat password"
          value={repeatpassword}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setReatPassword(e.target.value)}
          type="password"
        />
        <br />
        <input
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          value="Submit"
          type="submit"
        />
      </form>
      <br />
      <form
        onSubmit={signinSubmit}
        style={{ width: '300px' }}
        className={styles.form}
      >
        <strong>Log In</strong>
        <br />
        <input
          required
          placeholder="enter email"
          value={email}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          required
          placeholder="enter password"
          value={password}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <br />
        <input
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          value="Submit"
          type="submit"
        />
      </form>
    </div>
  )
}

Register.noAuth = true

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/account?error=You are already logged in',
        permanent: false,
      },
      props: {},
    }
  }
  return {
    props: {},
  }
}
