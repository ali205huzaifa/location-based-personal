import sodium from "libsodium-wrappers";

export async function encryptForChat({
  message,
  myPrivateKeyBase64,
  myPublicKeyBase64,
  receiverPublicKeyBase64,
}: {
  message: string;
  myPrivateKeyBase64: string;
  myPublicKeyBase64: string;
  receiverPublicKeyBase64: string;
}) {
  await sodium.ready;
  const myPrivateKey = sodium.from_base64(
    myPrivateKeyBase64,
    sodium.base64_variants.ORIGINAL
  );
  const myPublicKey = sodium.from_base64(
    myPublicKeyBase64,
    sodium.base64_variants.ORIGINAL
  );
  const receiverPublicKey = sodium.from_base64(
    receiverPublicKeyBase64,
    sodium.base64_variants.ORIGINAL
  );

  if (myPrivateKey.length !== 32 || myPublicKey.length !== 32) {
    throw new Error("Sender keys must be 32 bytes");
  }
  if (receiverPublicKey.length !== 32) {
    throw new Error("Receiver public key must be 32 bytes");
  }

  const messageBytes = sodium.from_string(message);
  const nonceRecipient = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const ciphertextRecipient = sodium.crypto_box_easy(
    messageBytes,
    nonceRecipient,
    receiverPublicKey,
    myPrivateKey
  );

  const nonceSender = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const ciphertextSender = sodium.crypto_box_easy(
    messageBytes,
    nonceSender,
    myPublicKey,
    myPrivateKey
  );

  return {
    ciphertext: {
      forRecipient: sodium.to_base64(ciphertextRecipient),
      forSender: sodium.to_base64(ciphertextSender),
    },
    nonce: {
      forRecipient: sodium.to_base64(nonceRecipient),
      forSender: sodium.to_base64(nonceSender),
    },
  };
}
