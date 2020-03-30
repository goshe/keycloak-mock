import { PostFn } from "../types";
import UserRepresentation from "./UserRepresentation";

interface RoleRepresentation {
  clientRole?: boolean;
  composite?: boolean;
  composites?: {
    client: Record<string, any>;
    realm: string[];
  };
  containerId?: string;
  description?: string;
  id?: string;
  name?: string;
}

interface RoleMappingPayload extends RoleRepresentation {
  id: string;
  name: string;
}

// /{id}/role-mappings/realm'
const postRealmRoleMapping: PostFn = (instance, request, requestBody) => {
  if (typeof requestBody !== "object") {
    return [400, "Unparseable request body"];
  }

  let roleMappings = (requestBody as unknown) as RoleMappingPayload;
  /*if(userRepresentation.credentials && userRepresentation.credentials.length >= 0){

        let CreateMockUserProfileOptions = {
            ...userRepresentation,
            password: userRepresentation.credentials[0].value
        }

        let userProfile = instance.database.createUser(CreateMockUserProfileOptions)

        return [
            200,
            {
                id: userProfile.id,
            },
        ];
    } else {
        return [
            400, "Credentials not defined"
        ]
    }*/

  return [400, "Not implemented"];
};

export default postUser;
