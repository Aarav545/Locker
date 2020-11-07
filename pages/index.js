import { Page, Button, Spacer } from "@geist-ui/react";
import * as Icon from '@geist-ui/react-icons'
import { useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

export default function Home() {
  const [isLoggedIn, setLoggedIn] = useState(false)

  const clientID = '670037657499-5ak3trgnr5b1lgkj0kod8hh5bpo2qvi8.apps.googleusercontent.com'

  const onSuccess = res => {
    setLoggedIn(true)
    console.log("[Login Success]:", res)
  }

  const onFailure = res => {
    setLoggedIn(false)
    console.log("[Login Failed]:", res)
  }

  const onLogoutSuccess = () => {
    setLoggedIn(false)
    console.log("Logged Out!")
  }

  return (
    <>
    <Page style={{paddingTop: '56px', paddingBottom: '56px'}} size="mini">
      <div>
        <h1>locker</h1>
        <div>Note taking made for students.</div>
      </div>
      <Spacer y={2} />
      {isLoggedIn ? <GoogleLogout 
          clientId={clientID}
          onLogoutSuccess={onLogoutSuccess}
          render={renderProps => (
            <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
              Logout
            </Button>
          )}
      /> : <GoogleLogin 
        clientId={clientID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        isSignedIn={false}
        render={renderProps => (
          <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign in with Google
          </Button>
        )}
      />
      }
    </Page>
    </>
  )
}