import { decode, encode, TAlgorithm } from "jwt-simple";
import { DecodeResult, EncodeResult, PartialSession, Session } from "./jwt.types";

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = "HS512";

    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session: Session = {
        ...partialSession,
        issued: issued,
        expires: expires
    };

    return {
        token: encode(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}




export function isTokenExpired(token: Session): Boolean {
    const now = Date.now();
    if (token.expires > now) return false;
    // Find the timestamp for the end of the token's grace period
    // const threeHoursInMs = 3 * 60 * 60 * 1000;
    // const threeHoursAfterExpiration = token.expires + threeHoursInMs;
    // if (threeHoursAfterExpiration > now) return "grace";
    return true;
}


export function decodeSession(secretKey: string, tokenString: string): DecodeResult {
    // Always use HS512 to decode the token
    const algorithm: TAlgorithm = "HS512";

    let result: Session;

    try {
        result = decode(tokenString, secretKey, false, algorithm);
    } catch (_e) {
        const e: Error = _e;

        // These error strings can be found here:
        // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
        if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
            return {
                type: "invalid-token"
            };
        }

        if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
            return {
                type: "integrity-error"
            };
        }

        // Handle json parse errors, thrown when the payload is nonsense
        if (e.message.indexOf("Unexpected token") === 0) {
            return {
                type: "invalid-token"
            };
        }

        throw e;
    }

    return {
        type: "valid",
        session: result
    }
}