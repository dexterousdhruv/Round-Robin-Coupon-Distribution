const errorHandler = (statusCode, message) => {
  const error = new Error()
  error.statusCode = statusCode
  error.message = message

  return error
}

const errorResponse = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Something went wrong!'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })

}

export  {errorHandler, errorResponse}