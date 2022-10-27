import styles from '../styles/Credits.module.css'
import { useSession, getSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
export default function Credits({ userData }) {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const { data: session } = useSession()

  useEffect(() => {
    setBalance(userData.balance)
    const { error, success } = router.query
    if (error) {
      toast.error(error, { toastId: 'error' })
      router.replace('/credits')
    }
    if (success) {
      toast.success(success, { toastId: 'success' })
      router.replace('/credits')
    }
  }, [userData.balance, router])

  const topUp = async (amount) => {
    let queryString =
      'UPDATE `users` SET `balance` = ? WHERE `users`.`_id` = ?;'
    let queryParams = [balance + amount, session.user.id]
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
      setBalance(balance + amount)
    } else {
      router.replace('/credits?error=Unable to top-up')
    }
  }

  return (
    <div className={styles.main}>
      <div style={{ width: '300px' }} className={styles.form}>
        <strong>Your current balance: </strong>
        <span>{balance}</span>
      </div>
      <br />
      <div style={{ width: '300px' }} className={styles.form}>
        <center>
          <strong>Top-up Credits</strong>
        </center>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button onClick={() => topUp(500)}>Get 500</button>
          <button onClick={() => topUp(1000)}>Get 1000</button>
          <button onClick={() => topUp(2000)}>Get 2000</button>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  let queryString = 'SELECT `balance` FROM `users` WHERE `_id` = ?;'
  let queryParams = [session.user.id]
  const res = await fetch(process.env.NEXTAUTH_URL + '/api/queryDB-api', {
    method: 'POST',
    body: JSON.stringify({ queryString, queryParams }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = await res.json()
  let [data] = resData.result

  let returnData = {
    balance: data.balance,
  }

  return {
    props: {
      userData: returnData,
    },
  }
}
