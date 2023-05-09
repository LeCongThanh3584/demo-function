exports.successsHandler = (res, errCode, data, status = 200, message) => {
  return res.status(status).json({
    errCode,
    message,
    data,
  });
};
