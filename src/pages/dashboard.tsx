import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { Can } from "../components/Can"

function Dashboard () {
  const { user, signOut } = useContext(AuthContext)

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextauth | Dashboard</title>
      </Head>

      <h1>Dashboard for: { user?.email }</h1>
      <button onClick={signOut}>Sign Out</button>

      <Can permissions={['metrics.list']}>
        <div>
          <h2>Métricas</h2>
        </div>
      </Can>
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