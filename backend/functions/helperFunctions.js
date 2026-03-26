import { JWT_COOKIE_NAME, JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'
import JWT from 'jsonwebtoken'
import { fileTypeFromFile } from 'file-type'
import mimeResolver from "mime-types"

export async function authorize(req) {
  try {
    const credentialsError = new Error();
    credentialsError.name = "RouteAccessError";
    credentialsError.why = "InvalidCredentials";
    
    const authToken = req.cookies[String(JWT_COOKIE_NAME)];
    if (authToken) {
      const user = await User.findOne({ accessToken: authToken });

      // Verify token or throw error
      if (user) {
        const decoded = JWT.verify(authToken, String(JWT_SECRET));
      } else throw credentialsError
    } else throw credentialsError
  } catch (error) {
    throw error
  }
}


// Dev help functions Delete after use ------------------------------------------
export async function fileData(files, upload) {
  async function* googleUriGenerator() {
    async function parter (f) {
      const mimeGotten = await fileTypeFromFile(f)
      const mime =
        mimeGotten?.mime ||
        mimeResolver.lookup(f) ||
        "application/octet-stream";

      const uri = await upload({
        file: f,
        config: { mimeType: mime }
      })
      
      return { "fileData": {
        "fileUri": uri,
        "mimeType": mime
      }}
    }

    for (let file of files) yield await parter(file)
  }

  const googleUriIterable = googleUriGenerator()
  const parts = []

  for await (let part of googleUriIterable) {
    parts.push(part);
  }
  return parts
}