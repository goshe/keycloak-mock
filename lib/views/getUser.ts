import { ViewFn } from "../types";
import { MockInstance } from "../instance";

const getUser: ViewFn = (instance, request) => {
  const { user } = request;

  if (!user) {
    return [403, "Access denied"];
  }

  return [
    200,
    {
      ...user,
      // TODO: make these configurable
      disableableCredentialTypes: ["password"],
      requiredActions: [],
      federatedIdentities: [],
      notBefore: 0,
      access: {
        manageGroupMembership: true,
        view: true,
        mapRoles: true,
        impersonate: false,
        manage: true,
      },
    },
  ];
};

export default getUser;
