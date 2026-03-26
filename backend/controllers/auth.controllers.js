import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { JWT_SECRET, JWT_COOKIE_NAME } from '../config/env.js'

export async function signUp (req, res, next) {
  if (req.body && req.body.password && req.body.email && req.body.userName) {
    // validate password
    const isStrongPass = (password) => {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordRegex.test(password);
    };

    if (!isStrongPass(req.body.password)) {
      const passwordError = new Error();
      passwordError.name = "SignUpError";
      passwordError.why = "WeakPassword";
      throw passwordError;
    }

    // Hash password, generate access token, and save the document
    const passHash = await bcrypt.hash(req.body.password, 10);

    let newUser = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: passHash,
      accessToken: passHash,
    });

    let userLog = newUser.toObject();

    const accessToken = JWT.sign(
      {
        id: userLog._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    userLog.accessToken = accessToken;

    newUser = await User.updateOne(
      { _id: userLog._id },
      { accessToken: accessToken }
    );

    console.log(
      "New user created: ",
      (() => {
        delete userLog.password;
        delete userLog.accessToken;
        return userLog;
      })()
    );

    // Set httpOnly cookie and respond to client
    res.cookie(String(JWT_COOKIE_NAME), accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    res.status(201).json({
      success: true,
      message: "New user created successfully",
    })
  } else {
    const missingFieldError = new Error()
    missingFieldError.name = 'SignUpError'
    missingFieldError.why = 'MissingField'
    throw missingFieldError
  }
}

export async function signIn (req, res, next) {
  const authToken = req.cookies[String(JWT_COOKIE_NAME)]
  let user = null
  if (authToken) user = await User.findOne({ accessToken: authToken })
  if (user) {
    // Verify token
    let decoded = null
    try { decoded = JWT.verify(authToken, String(JWT_SECRET)) }
    catch (error) { decoded = null }

    if (decoded) res.status(302).json({ success: true, message: 'Logged in' })
    else {
      const credentialsError = new Error();
      credentialsError.name = "SignInError"
      credentialsError.why = "InvalidCredentials"
      throw credentialsError;
    }
  } else if (
    req.body &&
    req.body.password &&
    req.body.email &&
    req.body.userName
  ) {
    // look for the requested credentials in database
    const user = await User.findOne({
      userName: req.body.userName,
      email: req.body.email,
    });

    if (!user) {
      const credentialsError = new Error();
      credentialsError.name = "SignInError"
      credentialsError.why = "InvalidCredentials"
      throw credentialsError;
    }

    // verify password
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      const credentialsError = new Error();
      credentialsError.name = "SignInError"
      credentialsError.why = "InvalidCredentials"
      throw credentialsError;
    }

    // generate JWT and update credentials
    const accessToken = JWT.sign(
      {
        id: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    const updateUser = await User.updateOne(
      { userName: req.body.userName, email: req.body.email },
      { accessToken: accessToken }
    );

    console.log(`${user.userName} with ${user.email} logged in`);

    // Set httpOnly cookie and respond to client
    res.cookie(String(JWT_COOKIE_NAME), accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    })
    res.status(200).json({
      success: true,
      accessToken: accessToken,
      message: 'Logged in'
    });
  } else {
    const missingFieldError = new Error();
    missingFieldError.name = "SignInError";
    missingFieldError.why = "MissingField";
    throw missingFieldError;
  }
}

export async function signOut (req, res, next) {
  res.cookie(String(JWT_COOKIE_NAME), '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0)
  })

  const user = await User.findOne({
    accessToken: req.cookies[String(JWT_COOKIE_NAME)],
  });
  if (user) console.log(`${user.userName} with ${user.email} signed out`)
  else console.log('User signed out')

  res.status(200).json({ success: true, message: 'Signed out'})
}

export default { signUp, signIn, signOut }