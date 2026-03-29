const authApiConfig = Object.freeze({
  login: Object.freeze({
    path: '/login',
    method: 'POST',
  }),
  sessionCourante: Object.freeze({
    path: '/me',
    method: 'GET',
  }),
  logout: Object.freeze({
    path: '/logout',
    method: 'POST',
  }),
})

module.exports = {
  authApiConfig,
}
