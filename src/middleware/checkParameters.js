const checkParameters = (type, requiredParameters) => (req, res, next) => {
  const hasAllParameters = requiredParameters.every(param =>
    req[type][param]
  )

  if (hasAllParameters) {
    next()
  } else {
    const params = requiredParameters.map(p => '?' + p).join(', ')
    return res
      .status(401)
      .send('Requires parameters; ' + params)
  }
}

module.exports = checkParameters
