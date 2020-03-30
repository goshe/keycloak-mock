import { PostFn } from "../types";

const postToken: PostFn = (instance, request, requestBody) => {
  if (typeof requestBody !== "object") {
    return [403, "Access denied"];
  }

  let { username, password, client_id, client_secret } = (requestBody as unknown) as Record<
    string,
    any
  >;
  let clientIdNotMatches = instance.params.clientID !== client_id;

  if(client_secret){
    username = '';
    password = ''
  }

  let clientSecretIsNotSet = !client_secret;
  let usernameIsNotSet = !username;
  let passwordIsNotSet = !password;

  if ( clientIdNotMatches &&  clientSecretIsNotSet && (usernameIsNotSet && passwordIsNotSet) ) {
    return [403, "Access denied"];
  }

  let access_token;
  let refresh_token;

  if(clientSecretIsNotSet) {
    let user = instance.database.findUserByEmail(username);
    if (!user || password !== user.password) {
      return [403, "Access denied"];
    }

    access_token = instance.createBearerToken(user.id);
    refresh_token = instance.createBearerToken(user.id);
  } else {

    if (client_secret !== instance.params.clientSecret) {
      return [403, "Access denied"];
    }
    // we have succesfully auhenticated a client
    access_token = instance.createClientBearerToken();
    refresh_token = instance.createClientBearerToken();
  }

  return [
    200,
    {
      access_token: access_token,
      expires_in: 300,
      refresh_expires_in: 1800,
      refresh_token: refresh_token,
      token_type: "bearer",
      "not-before-policy": 0,
      session_state: "39b4a1a3-3900-412f-82d3-bf538da5658e",
      scope: "email profile",
    },
  ];
};

export default postToken;
