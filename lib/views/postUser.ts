import { PostFn } from "../types";
import UserRepresentation from "./UserRepresentation";

const postUser: PostFn = (instance, request, requestBody) => {
    if (typeof requestBody !== "object") {
        return [403, "Access denied"];
    }

    let userRepresentation = (requestBody as unknown) as UserRepresentation;
    if(userRepresentation.credentials && userRepresentation.credentials.length >= 0){

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
    }

};

export default postUser;
