import { Page, Button, Spacer, User } from '@geist-ui/react'
import * as Icon from '@geist-ui/react-icons'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/styles.module.css'
import GoogleLogin, { GoogleLogout } from 'react-google-login'
import Dashboard from '../components/dashboard'

export default function Home () {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    setupUser()
  }, [userData])

  const clientID = '670037657499-5ak3trgnr5b1lgkj0kod8hh5bpo2qvi8.apps.googleusercontent.com'

  const onSuccess = res => {
    if (!isLoggedIn) { setLoggedIn(true) }
    setUserData(res.profileObj)
    console.log('[Login Success]:', res)
  }

  function setupUser () {
    const req = fetch('/api/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    req.then(data => {
      data.text().then(response => {
        console.log(response)
      })
    })
  }

  const onFailure = res => {
    setLoggedIn(false)
    console.log('[Login Failed]:', res)
  }

  const onLogoutSuccess = () => {
    setLoggedIn(false)
    console.log('Logged Out!')
  }

  return (
    <>
    <Head>
      <title>locker | Note taking made for students.</title>
    </Head>
    <Page style={{ paddingTop: '56px', paddingBottom: '56px' }} size="large">
      <div>
        <div className={styles.header}>
          <div style={{ height: 72, display: 'flex', alignItems: 'center' }}>
            {
              isLoggedIn
                ? <div style={{ display: 'flex' }}>
                    <h2 className={styles.customTitle} style={{ margin: 0 }}>{userData.givenName}&#39;s locker</h2>
                    <User src={userData.imageUrl} />
                  </div>
                : <h1>locker</h1>
            }
          </div>
          <div>
        { isLoggedIn
          ? <GoogleLogout
              clientId={clientID}
              onLogoutSuccess={onLogoutSuccess}
              render={renderProps => (
                renderProps.disabled
                  ? <Button disabled={true} loading={true}>Loading...</Button>
                  : <Button onClick={renderProps.onClick}>Logout</Button>
              )}
            />
          : <GoogleLogin
              clientId={clientID}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy="single_host_origin"
              isSignedIn={true}
              render={renderProps => (
                renderProps.disabled
                  ? <Button disabled={true} loading={true}>Loading...</Button>
                  : <Button onClick={renderProps.onClick}>Sign in with Google</Button>
              )}
            />
        }
      </div>
        </div>
        <div style={{ margin: 0 }}>
          {
            isLoggedIn ? `Locker #${userData.googleId}` : 'Note taking made for students.'
          }
        </div>
      </div>
      <Spacer y={2} />
      { isLoggedIn ? <Dashboard userData={userData} /> : null }
    </Page>
    </>
  )
}
