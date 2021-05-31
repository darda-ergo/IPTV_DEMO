import config from '../config.json'

/**
 * Getting Application Mode
 */
export const getApplicationMode = () => {
  return process.env.REACT_APP_NODE_ENV || 'production'
}

/**
 * Getting Application API Endpint
 */
export const getApiEndPoint = () => {
  return process.env.REACT_APP_API_ENDPOINT || config.apiEndpoint
}

/**
 * Set Login Token
 */
export const setToken = (token) => localStorage.setItem('_TOKEN', token)
/**
 * Get loggedin token
 */
export const getToken = () => localStorage.getItem('_TOKEN') || null

/**
 * Parsing JWT
 * @param {string} token
 */
export const parseJwt = (token) => {
  if (!token) return {}
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

/**
 * Get current logges in user
 */

export const getUser = () => {
  return parseJwt(getToken())
}

/**
 * Clear Local Storage
 */

export const clearLocalStorage = () => {
  return new Promise((resolve) => {
    localStorage.removeItem('_TOKEN')
    localStorage.removeItem('_PAYLOADS')
    resolve(true)
  })
}

export const getLoginStatus = () => {
  let token = getToken()
  if (token && token !== null) return true
  return false
}
