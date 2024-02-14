import * as jose from "jose";

function getEncKey(secret: string) {
  return jose.base64url.decode(secret);
}

export async function sign(data: any, secret: string, exp = "1h") {
  const jwt = await new jose.EncryptJWT(data)
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .encrypt(getEncKey(secret));

  return jwt;
}

export async function decode(token: string, secret: string) {
  const { payload } = await jose.jwtDecrypt(token, getEncKey(secret));
  return payload as any;
}
