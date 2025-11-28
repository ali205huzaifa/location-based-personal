import sodium from "libsodium-wrappers-sumo";

const urlBase64ToBase64 = (str: string) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return base64;
};

export const decryptMessage = async (
  ciphertextBase64: string,
  nonceBase64: string,
  senderPublicKeyBase64: string,
  myPrivateKeyBase64: string,
  messageId: string
): Promise<string> => {
  await sodium.ready;

  try {
    const ciphertext = sodium.from_base64(
      urlBase64ToBase64(ciphertextBase64),
      sodium.base64_variants.ORIGINAL
    );
    const nonce = sodium.from_base64(
      urlBase64ToBase64(nonceBase64),
      sodium.base64_variants.ORIGINAL
    );
    const senderPublicKey = sodium.from_base64(
      urlBase64ToBase64(senderPublicKeyBase64),
      sodium.base64_variants.ORIGINAL
    );
    const myPrivateKey = sodium.from_base64(
      myPrivateKeyBase64,
      sodium.base64_variants.ORIGINAL
    );

    const plaintextBytes = sodium.crypto_box_open_easy(
      ciphertext,
      nonce,
      senderPublicKey,
      myPrivateKey
    );
    return sodium.to_string(plaintextBytes);
  } catch (err: any) {
    console.error(
      `❌ Decryption failed for message ${messageId}:`,
      err.message || err
    );
    console.log(
      "Check that the private key matches the intended recipient and that the sender's public key is correct."
    );
    throw err;
  }
};

export const decryptMessages = async (
  messages: any[],
  myPrivateKeyBase64: string,
  myUserId: string
) => {
  return Promise.all(
    messages.map(async (msg) => {
      try {
        const isSender = msg.senderId._id === myUserId;

        const ciphertext = isSender
          ? msg.ciphertext.forSender
          : msg.ciphertext.forRecipient;
        const nonce = isSender ? msg.nonce.forSender : msg.nonce.forRecipient;

        const content = await decryptMessage(
          ciphertext,
          nonce,
          msg.senderId.userPublicKey,
          myPrivateKeyBase64,
          msg._id
        );

        return {
          _id: msg._id,
          content,
          senderId: msg.senderId._id,
          createdAt: msg.createdAt,
        };
      } catch (err) {
        return {
          _id: msg._id,
          content: "[Failed to decrypt]",
          senderId: msg.senderId._id,
          createdAt: msg.createdAt,
        };
      }
    })
  );
};

// interface DecryptPrivateKeyHybridParams {
//   password: string;
//   wrappedMasterKey: string;
//   salt: string;
//   encryptedPrivateKey: string;
// }

// interface DecryptPrivateKeyHybridParams {
//   password: string;
//   wrappedMasterKey: string;
//   salt: string;
//   encryptedPrivateKey: string;
// }

interface DecryptParams {
  password: string;
  wrappedMasterKey: string;
  encryptedPrivateKey: string;
  nonce: string;
  masterKeyNonce: string;
  salt: string;
}

export async function decryptPrivateKeyHybrid({
  password,
  wrappedMasterKey,
  encryptedPrivateKey,
  nonce,
  masterKeyNonce,
  salt,
}: DecryptParams): Promise<string> {
  await sodium.ready;

  const wrappedMasterKeyBytes = sodium.from_base64(
    wrappedMasterKey,
    sodium.base64_variants.ORIGINAL
  );
  const encryptedPrivateKeyBytes = sodium.from_base64(
    encryptedPrivateKey,
    sodium.base64_variants.ORIGINAL
  );
  const nonceBytes = sodium.from_base64(nonce, sodium.base64_variants.ORIGINAL);
  const masterKeyNonceBytes = sodium.from_base64(
    masterKeyNonce,
    sodium.base64_variants.ORIGINAL
  );
  const saltBytes = sodium.from_base64(salt, sodium.base64_variants.ORIGINAL);

  const passwordKey = sodium.crypto_pwhash(
    32,
    password,
    saltBytes,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const masterKey = sodium.crypto_secretbox_open_easy(
    wrappedMasterKeyBytes,
    masterKeyNonceBytes,
    passwordKey
  );

  if (!masterKey) {
    throw new Error("Failed to unwrap master key — wrong password?");
  }

  const privateKeyBytes = sodium.crypto_secretbox_open_easy(
    encryptedPrivateKeyBytes,
    nonceBytes,
    masterKey
  );

  if (!privateKeyBytes) {
    throw new Error("Failed to decrypt private key");
  }

  return sodium.to_base64(privateKeyBytes, sodium.base64_variants.ORIGINAL);
}
