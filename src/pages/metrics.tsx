import Head from 'next/head'

import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"


import styles from '../styles/Home.module.css'

function Metrics () {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextauth | Metrics</title>
      </Head>

      <h2>Métricas</h2>
    </div>
  )
}

export default Metrics

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')
  
  console.log(response.data)
  
  return {
    props: {}
  }
}, { 
  permissions: ['metrics.list'],
  roles: ['administrator']
})