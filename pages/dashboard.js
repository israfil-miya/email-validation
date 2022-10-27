import styles from '../styles/Dashboard.module.css'
import { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'
import checkAdmin from '../utils/admin.js'

export default function Dashboard({ usersData }) {
  const router = useRouter()

  useEffect(() => {
    const { error, success } = router.query
    console.log(success)
    console.log(error)
    if (error) {
      toast.error(error, { toastId: 'error' })
      router.replace('/dashboard')
    }
    if (success) {
      toast.success(success, { toastId: 'success' })
      router.replace('/dashboard')
    }
  }, [router])

  return (
    <div className={styles.main}>
      <table border={1} className={styles.table}>
        <thead>
          <tr>
            <th>SNO</th>
            <th>Name</th>
            <th>Email</th>
            <th>Credits</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {usersData.length ? (
            usersData.map((data, index) => (
              <>
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.balance}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/edit-account/${data._id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </>
            ))
          ) : (
            <strong>No Users !!</strong>
          )}
        </tbody>
      </table>
    </div>
  )
}

export async function getServerSideProps(context) {
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
        destination:
          '/account?error=You need to be an Admin to access Dashboard',
        permanent: false,
      },
      props: {},
    }
  }

  let queryString = 'SELECT * FROM `users`;'
  const res = await fetch(process.env.NEXTAUTH_URL + '/api/queryDB-api', {
    method: 'POST',
    body: JSON.stringify({ queryString }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = await res.json()
  let data = resData.result
  let returnData = data

  return {
    props: {
      usersData: returnData,
    }, // will be passed to the page component as props
  }
}
