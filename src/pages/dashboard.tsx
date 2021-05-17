import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { api } from "../services/apiClient"

function Dashboard () {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextauth | Dashboard</title>
      </Head>

      <h1>Dashboard for: { user?.email }</h1>
    </div>
  )
}

export default Dashboard

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')
  
  console.log(response.data)
  
  return {
    props: {}
  }
})