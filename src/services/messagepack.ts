import { decode, encode } from "@msgpack/msgpack";

export function MsgPackEncode(data: any): Uint8Array {
  const encoded = encode(data, {
    useBigInt64: true,
  });
  console.debug("Sending message of length:", encoded.byteLength);
  return encoded;
}
export function MsgPackDecode(data: Uint8Array): any {
  console.debug("Received message of length:", data.byteLength + 1);
  return decode(data, {
    useBigInt64: true,
  });
}
