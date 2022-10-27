import styles from '../styles/Account.module.css'
import { useSession, getSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { toast } from 'react-toastify'

import checkAdmin from '../utils/admin.js'

export default function Account({ userData }) {
  const router = useRouter()
  const [apiKey, setApiKey] = useState(null)
  const [balance, setBalance] = useState(0)
  const [adminId, setAdminId] = useState(null)

  const { data: session } = useSession()

  useEffect(() => {
    console.log("the user data", userData)
    setBalance(userData.balance)
    setApiKey(userData.api_key)
    setAdminId(userData.admin_id)

    const { error, success } = router.query
    if (error) {
      toast.error(error, { toastId: 'error' })
      router.replace('/account')
    }
    if (success) {
      toast.success(success, { toastId: 'success' })
      router.replace('/account')
    }
  }, [userData.admin_id, userData.api_key, userData.balance, router])

  const generateAPIKey = async () => {
    let queryString =
      'UPDATE `users` SET `api_key` = ? WHERE `users`.`_id` = ?;'
    let queryParams = [session.user.id, session.user.id]
    const res = await fetch('/api/queryDB-api', {
      method: 'POST',
      body: JSON.stringify({ queryString, queryParams }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = await res.json()
    let confirmationData = resData.result

    if (confirmationData?.affectedRows) {
      setApiKey(session.user.id)
    } else {
      router.replace('/account?error=Unable to create api key')
    }
  }

  return (
    <div className={styles.main}>
      <div style={{ width: '300px' }} className={styles.form}>
        <strong>Name: </strong>
        <span>{session.user.name}</span>
        <br />
        <strong>Email: </strong>
        <span>{session.user.email}</span>
        <br />
        {balance != 0 && (
          <>
            <strong>Credits: </strong>
            <span>{balance}</span>
            <br />
          </>
        )}
        <button onClick={() => router.push('/credits')}>Top-Up</button>
        <br />
        {apiKey ? (
          <>
            <strong>API Key: </strong>
            <input readOnly value={apiKey} type="text" />
          </>
        ) : (
          <button onClick={() => generateAPIKey()}>Generate API Key</button>
        )}
        <br />
        {adminId && (
          <>
            <button onClick={() => router.push('/dashboard')}>Dashboard</button>
            <br />
          </>
        )}

        <button onClick={() => signOut({
          callbackUrl: `/register?error=Successfully logged out`
        })}>Log Out</button>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  console.log("session", session.user.id)

  let queryString = 'SELECT `balance`, `api_key` FROM `users` WHERE `_id` = ?;'
  let queryParams = [session.user.id]
  const res = await fetch(process.env.NEXTAUTH_URL + '/api/queryDB-api', {
    method: 'POST',
    body: JSON.stringify({ queryString, queryParams }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = await res.json()
  console.log("resData", resData)
  let [data] = resData.result
  console.log("mydata", data)

  let returnData = {
    balance: data.balance,
    api_key: data.api_key,
    admin_id: await checkAdmin(session.user.id),
  }

  return {
    props: {
      userData: returnData
    },
  }
}
