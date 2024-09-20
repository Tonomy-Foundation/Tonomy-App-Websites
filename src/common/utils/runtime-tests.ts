import { Resolver } from "did-resolver";
import { getResolver } from "@tonomy/antelope-did-resolver";

async function testAntelopeDid() {
  const resolver = new Resolver({
    ...getResolver(),
  });

  const res = await resolver.resolve("did:antelope:eos:eoscanadacom");

  if (!res.didDocument) throw new Error("No DID document found");
  if (res.didDocument.id !== "did:antelope:eos:eoscanadacom")
    throw new Error("DID document id incorrect");
}

export async function runTests() {
  await testAntelopeDid();
}
