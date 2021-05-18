import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import { api } from "../services/apiClient"
import { useCan } from "../hooks/useCan"
import { Can } from "../components/Can"

function Dashboard () {
  const { user } = useContext(AuthContext)

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list']
  })

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