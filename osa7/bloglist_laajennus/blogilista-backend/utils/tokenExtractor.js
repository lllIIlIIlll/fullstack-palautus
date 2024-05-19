const getTokenFrom = (request) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer')) {
    return auth.replace('Bearer ', '')
  }
  return null
}

const getToken = (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token
  next()
}

module.exports = { getToken }
