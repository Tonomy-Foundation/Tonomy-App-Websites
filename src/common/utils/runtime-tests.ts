import { Resolver } from "did-resolver";
import { getResolver } from "@tonomy/antelope-did-resolver";
import {
  dbConnection,
  setupDatabase,
  veramo,
  veramo2,
} from "@tonomy/tonomy-id-sdk";
import { Entities } from "@veramo/data-store";
import { DataSource } from "typeorm";
import Debug from "debug";
import initSqlJs from "sql.js";
import wasm from "sql.js/dist/sql-wasm.wasm?url";

const debug = Debug("tonomy-app-webites:common:util:runtime-tests");

async function initDataSource() {
  const SQL = await initSqlJs({
    locateFile: () => wasm,
  });

  const dataSource = new DataSource({
    type: "sqljs",
    driver: SQL,
    location: "sql.js.database.file",
    autoSave: true,
    synchronize: true,
    // migrations: migrations,
    // migrationsRun: true,
    logging: ["error", "info", "warn"],
    entities: Entities,
  });

  return dataSource;
}

async function testVeramo() {
  debug("testVeramo() called");
  await setupDatabase(await initDataSource());
  debug("Database setup");
  await veramo();
  debug("veramo() called");
  await veramo2();
  debug("veramo2() called");
  const entities = dbConnection.entityMetadatas;

  for (const entity of entities) {
    const repository = dbConnection.getRepository(entity.name);

    await repository.clear(); // This clears all entries from the entity's table.
  }

  debug("Database cleared");
}

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
  await testVeramo();
}
