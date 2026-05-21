/**
 * @generated SignedSource<<daafbb6d03b03f1621cd382ce4270910>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AdminFragment$data = {
  readonly email: any;
  readonly id: string;
  readonly isActive: boolean;
  readonly name: string;
  readonly slug: string;
  readonly " $fragmentType": "AdminFragment";
};
export type AdminFragment$key = {
  readonly " $data"?: AdminFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AdminFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AdminFragment",
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
  "type": "Admin",
  "abstractKey": null
};

(node as any).hash = "22bc23cb1f683187337c2fc27f711fb8";

export default node;
