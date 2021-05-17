import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let isRefreshing = false
let failedRequestsQueue = []

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  })
  
  api.interceptors.response.use(response => response, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        const interceptorCookies = parseCookies(ctx)
        const { 'nextauth.refreshToken': refreshToken } = interceptorCookies
        const originalConfig = error.config
  
        if(!isRefreshing) {
          isRefreshing = true
          
          api.post('/refresh', {
            refreshToken
          }).then(response => {
            const { token, refreshToken: newRefreshToken } = response.data
    
            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })
    
            setCookie(ctx, 'nextauth.refreshToken', newRefreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })
    
            api.defaults.headers['Authorization'] = `Bearer ${token}`
  
            failedRequestsQueue.forEach(request => request.resolve(token))
          }).catch(err => {
            failedRequestsQueue.forEach(request => request.reject(err))
            failedRequestsQueue = []
  
            if (process.browser) {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false
          })
        }
  
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`
  
              resolve(api(originalConfig))
            },
            reject: (err: AxiosError) => reject(err)
          })
        })
      } else {
        signOut()
      }
    }
  
    return Promise.reject(error)
  })

  return api
}

