import { JWK } from "node-jose";

import createBearerToken from "./createBearerToken";
import MockDatabase, {
  MockUserProfile,
  CreateMockUserProfileOptions,
} from "./database";

export interface CreateMockInstanceOptions {
  authServerURL: string;
  clientID: string;
  clientSecret: string;
  realm: string;

  /**
   * Default is 2048. Set to a lower number to speed
   * up tests. Absolute minimum is 512.
   */
  keySize?: number;
}

export interface MockInstanceParams {
  authServerURL: string;
  clientID: string;
  clientSecret: string;
  realm: string;
}

class MockInstance {
  store: JWK.KeyStore;
  defaultKey: JWK.Key;
  database: MockDatabase;
  params: MockInstanceParams;

  constructor(
    store: JWK.KeyStore,
    defaultKey: JWK.Key,
    database: MockDatabase,
    params: MockInstanceParams
  ) {
    this.store = store;
    this.defaultKey = defaultKey;
    this.database = database;
    this.params = params;
  }

  createURL(path: string): string {
    return `${this.params.authServerURL}${path}`;
  }

  createBearerToken(sub: string, expiresIn: number = 3600): string {
    const user = this.database.findUserByID(sub);
    if (!user) {
      throw new Error("Cannot create bearer token for non-existent user");
    }

    return createBearerToken({
      type: "user",
      sub: user.id,
      key: this.defaultKey,
      expiresIn,
      realm: this.params.realm,
      clientID: this.params.clientID,
      authServerURL: this.params.authServerURL,
    });
  }

  createClientBearerToken(expiresIn: number = 3600): string {
    return createBearerToken({
      type: "client",
      sub: this.params.clientID,
      key: this.defaultKey,
      expiresIn,
      realm: this.params.realm,
      clientID: this.params.clientID,
      authServerURL: this.params.authServerURL,
    });
  }
}

const createMockInstance = async (
  options: CreateMockInstanceOptions
): Promise<MockInstance> => {
  const store = JWK.createKeyStore();

  const keySize = options.keySize || 2048;
  const defaultKey = await store.generate("RSA", keySize, { use: "sig" });

  return new MockInstance(store, defaultKey, new MockDatabase(), {
    authServerURL: options.authServerURL,
    clientID: options.clientID,
    clientSecret: options.clientSecret,
    realm: options.realm,
  });
};

export { MockInstance, createMockInstance };
