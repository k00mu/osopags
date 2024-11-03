import { crypto } from "@std/crypto/crypto";

export const generateApiKey = async () => {
    const key = await crypto.subtle.generateKey(
        {
            name: "HMAC",
            hash: "SHA-256",
            length: 256,
        },
        true,
        ["sign", "verify"],
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);

    const hexString = Array.from(new Uint8Array(exportedKey))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

    return hexString;
};
