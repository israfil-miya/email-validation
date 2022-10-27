import styles from '../../styles/Edit.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'
import checkAdmin from '../../utils/admin.js'

export default function Edit({ userData }) {
  const router = useRouter()
  let id = router.query.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    setName(userData.name)
    setEmail(userData.email)
    setBalance(userData.balance)
  }, [userData.balance, userData.email, userData.name])

  const editSubmit = async (e) => {
    e.preventDefault()

    let queryString =
      'UPDATE `users` SET `name` = ?, `email` = ?, `balance` = ? WHERE `users`.`_id` = ?;'
    let queryParams = [name, email, balance, id]
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
      toast.success('Edited user info', { toastId: 'success' })
    } else {
      toast.error('Unable t0 edit user info', { toastId: 'error' })
    }
  }
  const deleteAccount = async () => {
    let queryString = 'DELETE FROM users WHERE `users`.`_id` = ?'
    let queryParams = [id]
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
      toast.success('Deleted the users account', { toastId: 'success' })
      router.replace('/dashboard')
    } else {
      toast.error('Unable to delete the account', { toastId: 'error' })
    }
  }
  return (
    <div className={styles.main}>
      <form
        onSubmit={editSubmit}
        style={{ width: '300px' }}
        className={styles.form}
      >
        <strong>Edit Acccount</strong>
        <br />
        <input
          required
          placeholder="edit name"
          value={name}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <input
          required
          placeholder="edit email"
          value={email}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          required
          placeholder="edit balance"
          value={balance}
          style={{ width: '220px', padding: '5px', margin: '5px' }}
          onChange={(e) => setBalance(e.target.value)}
          type="number"
        />
        <br />
        <input
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          value="Submit"
          type="submit"
        />
        <br />
        <button
          style={{ padding: '8px 10px', fontWeight: 'bold' }}
          onClick={() => deleteAccount()}
        >
          Delete Account
        </button>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  let id = context.params.id

  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/register?error=Not logged in',
        permanent: false,
      },
      props: {},
    }
  }

  if (!(await checkAdmin(session.user.id))) {
    return {
      redirect: {
        destination: '/account?error=You need to be an Admin to edit account',
        permanent: false,
      },
      props: {},
    }
  }

  let queryString = 'SELECT * FROM `users` WHERE `_id` = ?;'
  let queryParams = [id]
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
    ID: data.ID,
    _id: data._id,
    name: data.name,
    email: data.email,
    balance: data.balance,
  }

  return {
    props: {
      userData: returnData,
    }, // will be passed to the page component as props
  }
}
