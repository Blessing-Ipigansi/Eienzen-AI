function errorMiddleware (err, req, res, next) {
  // Returns response objects with error style
  const authError = () => {
    switch (true) {
      case err.name === "SignUpError" && err.why === "WeakPassword":
        return {
          success: false,
          statusCode: 400,
          error: {
            name: err.name,
            why: err.why,
            message:
              "Password must be greater than 8 characters, contain" +
              " uppercase, lowercase, number, and one of @$!%*?&",
          },
        };
      case err.name === "SignUpError" && err.why === "MissingField":
        return {
          success: false,
          statusCode: 400,
          error: {
            name: err.name,
            why: err.why,
            message:
              "One or more required fields were missing " +
              "from the sign up request",
          },
        };
      case err.name === "SignInError" && err.why === "MissingField":
        return {
          success: false,
          statusCode: 400,
          error: {
            name: err.name,
            why: err.why,
            message:
              "One or more required fields were missing " +
              "from the login request",
          },
        };
      case err.name === "SignInError" && err.why === "InvalidCredentials":
        return {
          success: false,
          statusCode: 401,
          error: {
            name: err.name,
            why: err.why,
            message: "The credentials you provided for login are invalid",
          },
        };
      case err.name === "RouteAccessError" && err.why === "InvalidCredentials":
        return {
          success: false,
          statusCode: 403,
          error: {
            name: err.name,
            why: err.why,
            message:
              "The credentials you provided to access this route are invalid"
          },
        };
      default:
        return null;
    }
  }
  const mongooseError = () => {
    switch (true) {
      case err.name === "CastError":
        return {
          success: false,
          statusCode: 404,
          error: {
            name: err.name,
            message: err.message,
          },
        };
      case err.name === "ValidationError":
        return {
          success: false,
          statusCode: 400,
          error: {
            name: err.name,
            message: err.message,
          },
        };
      case err.name === "StrictModeError":
        return {
          success: false,
          statusCode: 400,
          error: {
            name: err.name,
            message: err.message,
          },
        };
      default:
        return null;
    }
  }

  try {
    const error = [
      authError(),
      mongooseError(),
    ]
    let errorResponse = null
    for (const e of error) {
      if (e) {
        errorResponse = e
        break;
      } else continue;
    }
    res.status(errorResponse ? errorResponse.statusCode : 500).json(
      errorResponse || {
        success: false,
        error: { name: err.name, message: err.message },
      }
    );
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware;