const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "A record with this data already exists",
      });
    }
  }

  return res.status(500).json({
    error: "Internal server error",
  });
};

export { errorHandler };
