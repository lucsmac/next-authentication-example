import { FormEvent, useContext } from "react"
import { useState } from "react"
import Head from 'next/head'

import { AuthContext } from '../contexts/AuthContext'

import styles from '../styles/Home.module.css'
import { withSSRGuest } from "../utils/withSSRGuest"

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext)
  
  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    
    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextauth | Sign In</title>
      </Head>
      
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="email" value={ email } onChange={ e => setEmail(e.target.value) } placeholder="E-mail" />
        <input type="password" value={ password } onChange={ e => setPassword(e.target.value) } placeholder="Password" />
        <button type="submit" >Enviar</button>
      </form>
    </div>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})
