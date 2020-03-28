import axios from "axios";
import { setupBefore, teardownAfter, getMockInstance } from "./util";

describe("postUser", () => {
  beforeAll(setupBefore);
  afterAll(teardownAfter);

  it("rejects with 400 on user without credentials", async () => {
    const kmock = getMockInstance();
    const url = kmock.createURL(
      "/realms/myrealm/users"
    );

    const user = kmock.database.users[0];
    const token = kmock.createBearerToken(user.id);

    const response = await axios.post(
      url,
      {
          username: "Karl Gundarsson",
          firstName: "Karl",
          lastName: "Gundarsson",
          email: "karl@sectorlabs.com",
          emailVerified: true,
          enabled: true,
      },
      {
          headers: { authorization: `Bearer ${token}` },
          validateStatus: () => true
      }
    );
    expect(response.status).toBe(400);
  });

  it("responds with 200 on user with credentials, returns userId", async () => {
      const kmock = getMockInstance();
      const url = kmock.createURL(
          "/realms/myrealm/users"
      );

      const user = kmock.database.users[0];
      const token = kmock.createBearerToken(user.id);

      const response = await axios.post(
          url,
          {
              username: "Karl Gundarsson",
              firstName: "Karl",
              lastName: "Gundarsson",
              email: "karl@sectorlabs.com",
              emailVerified: true,
              enabled: true,
              credentials: [{
                  temporary: false,
                  type: "password",
                  value: "ThisIs4Test!"
              }]
          },
          {
              headers: { authorization: `Bearer ${token}` },
              validateStatus: () => true
          }
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
          expect.objectContaining({
              id: expect.any(String)
          })
      );
  });
});
