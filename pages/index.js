import styles from '../styles/Home.module.css'
import Router, { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
export default function Home({ userData }) {
  const router = useRouter()
  return (
    <div className={styles.main}>
      <div style={{ width: '300px' }} className={styles.form}>
        <p>Hi {userData ? userData.name : 'Unknown person'}</p>
        {userData ? (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button onClick={() => router.push('/account')}>My Account</button>
            <button onClick={() => router.push('/validate')}>
              Validate Email
            </button>
          </div>
        ) : (
          <button onClick={() => router.push('/register')}>
            Register Now!!
          </button>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    let returnData = {
      name: session.user.name,
      email: session.user.email,
    }
    return {
      props: {
        userData: returnData,
      },
    }
  }
  return {
    props: {},
  }
}

Home.noAuth = true
