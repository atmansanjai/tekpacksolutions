/**
 * @generated SignedSource<<9a7512d2b6a2405c53c5cb2f8be1788c>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AdminField = "CREATED_AT" | "EMAIL" | "%future added value";
export type sortOrder = "ASC" | "DESC" | "%future added value";
export type AdminFilter = {
  email?: string | null | undefined;
  isActive?: boolean | null | undefined;
};
export type AdminSort = {
  field?: AdminField | null | undefined;
  order?: sortOrder | null | undefined;
};
export type AdminQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  filter?: AdminFilter | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
  sort?: AdminSort | null | undefined;
};
export type AdminQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AdminPaginationFragment">;
};
export type AdminQuery = {
  response: AdminQuery$data;
  variables: AdminQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filter"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v6 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "filter",
    "variableName": "filter"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "sort",
    "variableName": "sort"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/),
      (v2/*:: as any*/),
      (v3/*:: as any*/),
      (v4/*:: as any*/),
      (v5/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminQuery",
    "selections": [
      {
        "args": (v6/*:: as any*/),
        "kind": "FragmentSpread",
        "name": "AdminPaginationFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*:: as any*/),
      (v4/*:: as any*/),
      (v0/*:: as any*/),
      (v1/*:: as any*/),
      (v2/*:: as any*/),
      (v5/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "AdminQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*:: as any*/),
        "concreteType": "AdminConnectionOutput",
        "kind": "LinkedField",
        "name": "admins",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AdminEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Admin",
                "kind": "LinkedField",
                "name": "node",
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasPreviousPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "startCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v6/*:: as any*/),
        "filters": [
          "filter",
          "sort",
          "after",
          "before"
        ],
        "handle": "connection",
        "key": "AdminQuery_admins",
        "kind": "LinkedHandle",
        "name": "admins"
      }
    ]
  },
  "params": {
    "cacheID": "d7d5085723a347b5231969ba363b938f",
    "id": null,
    "metadata": {},
    "name": "AdminQuery",
    "operationKind": "query",
    "text": "query AdminQuery(\n  $first: Int\n  $last: Int\n  $after: String\n  $before: String\n  $filter: AdminFilter\n  $sort: AdminSort\n) {\n  ...AdminPaginationFragment_30UBC1\n}\n\nfragment AdminFragment on Admin {\n  id\n  email\n  isActive\n  name\n  slug\n}\n\nfragment AdminPaginationFragment_30UBC1 on Query {\n  admins(first: $first, last: $last, after: $after, before: $before, filter: $filter, sort: $sort) {\n    edges {\n      cursor\n      node {\n        id\n        ...AdminFragment\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n      startCursor\n      totalCount\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1e76ceb4c7840631a4bdff8c93f7313a";

export default node;
