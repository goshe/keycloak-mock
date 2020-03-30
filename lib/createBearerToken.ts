import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { JWK } from "node-jose";

export interface CreateTokenOptions {
  type: string;
  sub: string;
  expiresIn: number;
  key: JWK.Key;
  realm: string;
  clientID: string;
  authServerURL: string;
}

const createBearerToken = (options: CreateTokenOptions): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + options.expiresIn;

  return jwt.sign(
    {
      type: options.type,
      iss: `${options.authServerURL}/realms/${options.realm}`,
      iat: expiresAt,
      exp: expiresAt,
      nbf: 0,
      typ: "Bearer",
      sub: options.sub,
      azp: options.clientID,
      session_state: uuidv4(),
    },
    options.key.toPEM(true),
    {
      algorithm: "RS256",
      header: {
        typ: "JWT",
        kid: options.key.kid,
      },
    }
  );
};

export default createBearerToken;
