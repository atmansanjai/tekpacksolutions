/**
 * @generated SignedSource<<f09493b85bf6685af1488403abd63d07>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AdminBySlugQuery$variables = {
  slug: string;
};
export type AdminBySlugQuery$data = {
  readonly adminBySlug: {
    readonly " $fragmentSpreads": FragmentRefs<"AdminFragment">;
  };
};
export type AdminBySlugQuery = {
  response: AdminBySlugQuery$data;
  variables: AdminBySlugQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Admin",
        "kind": "LinkedField",
        "name": "adminBySlug",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AdminFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "AdminBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "Admin",
        "kind": "LinkedField",
        "name": "adminBySlug",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isActive",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "206418b2660e090e14cdbb7fb385748c",
    "id": null,
    "metadata": {},
    "name": "AdminBySlugQuery",
    "operationKind": "query",
    "text": "query AdminBySlugQuery(\n  $slug: String!\n) {\n  adminBySlug(slug: $slug) {\n    ...AdminFragment\n    id\n  }\n}\n\nfragment AdminFragment on Admin {\n  id\n  email\n  isActive\n  name\n  slug\n}\n"
  }
};
})();

(node as any).hash = "7eab2dfb44928cf626802864d424f7a3";

export default node;
