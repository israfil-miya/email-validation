import '../styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import NextNProgress from 'nextjs-progressbar'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Email Validation</title>
      </Head>
      <NextNProgress
        color="#ff0000"
        startPosition={0.3}
        stopDelayMs={200}
        height={1.5}
        showOnShallow={true}
        options={{ easing: 'ease', speed: 500, showSpinner: false }}
      />
      <ToastContainer />

      <SessionProvider session={pageProps.session}>
        {!Component.noAuth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  )
}

const Auth = ({ children }) => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const hasUser = !!session?.user
  const router = useRouter()
  useEffect(() => {
    if (!loading && !hasUser) {
      router.push('/register?error=You have to login first')
    }
  }, [loading, hasUser, router])
  if (loading || !hasUser) {
    return <div>Please wait...</div>
  }
  return children
}
export default MyApp
