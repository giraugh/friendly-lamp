const errorResponse = (message, code, res) => error => {
  console.error(error)
  res
    .status(code)
    .send({message, error, success: false, auth: false})
}

const failureResponse = (message, code, res) =>
  res
    .status(code)
    .send({message, success: false, auth: false})

module.exports = {
  errorResponse,
  failureResponse
}
