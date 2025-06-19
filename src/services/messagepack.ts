import { decode, encode } from "@msgpack/msgpack";

export function MsgPackEncode(data: any): Uint8Array {
  return encode(data, {
    useBigInt64: true,
  });
}
export function MsgPackDecode(data: Uint8Array): any {
  console.log("Length:", data.byteLength);
  return decode(data, {
    useBigInt64: true,
  });
}
