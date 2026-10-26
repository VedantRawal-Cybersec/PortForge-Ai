import type {Exercise} from "./practice";
/** Reviewed educational capstones using local sample tests, not certified practical assessments. */
export const capstoneExercises:Exercise[]=[
  {
    "id": "capstone-frontend-form",
    "title": "Capstone: validate a student application",
    "topic": "Frontend / Real-world forms",
    "level": "Advanced",
    "functionName": "validateApplication",
    "brief": "Validate a fictional student application. Return {valid,errors}, where errors is an ordered list of field names: name if fewer than 2 trimmed characters, email if it lacks a basic address form, and portfolio if provided but not an HTTPS URL. All errors must be independently reported. This trains input reasoning, not server security.",
    "starter": "function validateApplication(input) {\n  // Validate name, email, optional portfolio. Preserve error order.\n  return {valid:true,errors:[]};\n}",
    "hint": "Check each field separately. Trim name; use a simple regex for email; for nonblank portfolio use new URL() and check protocol. Return the errors in order.",
    "tests": [
      {
        "label": "Valid without optional link",
        "args": [
          {
            "name": "Ada",
            "email": "ada@example.com",
            "portfolio": ""
          }
        ],
        "expected": {
          "valid": true,
          "errors": []
        }
      },
      {
        "label": "Missing name",
        "args": [
          {
            "name": " ",
            "email": "ada@example.com"
          }
        ],
        "expected": {
          "valid": false,
          "errors": [
            "name"
          ]
        }
      },
      {
        "label": "Invalid email and insecure link",
        "args": [
          {
            "name": "Ada",
            "email": "invalid",
            "portfolio": "http://example.com"
          }
        ],
        "expected": {
          "valid": false,
          "errors": [
            "email",
            "portfolio"
          ]
        }
      },
      {
        "label": "All invalid",
        "args": [
          {
            "name": "",
            "email": "none",
            "portfolio": "javascript:alert(1)"
          }
        ],
        "expected": {
          "valid": false,
          "errors": [
            "name",
            "email",
            "portfolio"
          ]
        }
      }
    ]
  },
  {
    "id": "capstone-data-quality",
    "title": "Capstone: reconcile clean sales data",
    "topic": "Data Analysis / Audited reporting",
    "level": "Advanced",
    "functionName": "reconcileSales",
    "brief": "From synthetic order records, sum amounts only for status 'paid' with finite nonnegative numeric amount; count malformed paid amounts as invalid, and return {total,invalid,matched}, where matched is true when valid totals are within 0.001 of expected and invalid is zero. Ignore non-paid records.",
    "starter": "function reconcileSales(orders,expected) {\n  // Only use finite nonnegative paid amounts; report invalid rows.\n  return {total:0,invalid:0,matched:false};\n}",
    "hint": "Use Number.isFinite(row.amount) and amount>=0. Increment invalid for a bad paid record. matched needs zero invalid records and absolute difference <=0.001.",
    "tests": [
      {
        "label": "Reconciled paid rows",
        "args": [
          [
            {
              "status": "paid",
              "amount": 30
            },
            {
              "status": "void",
              "amount": 100
            },
            {
              "status": "paid",
              "amount": 2.5
            }
          ],
          32.5
        ],
        "expected": {
          "total": 32.5,
          "invalid": 0,
          "matched": true
        }
      },
      {
        "label": "Bad paid amount blocks match",
        "args": [
          [
            {
              "status": "paid",
              "amount": -2
            },
            {
              "status": "paid",
              "amount": 10
            }
          ],
          10
        ],
        "expected": {
          "total": 10,
          "invalid": 1,
          "matched": false
        }
      },
      {
        "label": "Empty source",
        "args": [
          [],
          0
        ],
        "expected": {
          "total": 0,
          "invalid": 0,
          "matched": true
        }
      },
      {
        "label": "Mismatch",
        "args": [
          [
            {
              "status": "paid",
              "amount": 10
            }
          ],
          9
        ],
        "expected": {
          "total": 10,
          "invalid": 0,
          "matched": false
        }
      }
    ]
  },
  {
    "id": "capstone-security-ownership",
    "title": "Capstone: two-user data isolation rules",
    "topic": "Defensive Security / Authorization",
    "level": "Advanced",
    "functionName": "allowRecordAccess",
    "brief": "Build a fictional owner-only policy: allow read or update only if actor.id and actor.tenant are nonempty strings, record.ownerId matches actor.id, and record.tenantId matches actor.tenant. Deny deletion and all mismatches. This pure-function exercise is NOT production authorization.",
    "starter": "function allowRecordAccess(actor,record,operation) {\n  // Enforce both owner and tenant; deny by default.\n  return false;\n}",
    "hint": "Validate actor and record existence, ensure nonblank id and tenant, compare exact ownerId and tenantId, then require read/update.",
    "tests": [
      {
        "label": "Owner read",
        "args": [
          {
            "id": "u1",
            "tenant": "t1"
          },
          {
            "ownerId": "u1",
            "tenantId": "t1"
          },
          "read"
        ],
        "expected": true
      },
      {
        "label": "Cross-user denied",
        "args": [
          {
            "id": "u2",
            "tenant": "t1"
          },
          {
            "ownerId": "u1",
            "tenantId": "t1"
          },
          "update"
        ],
        "expected": false
      },
      {
        "label": "Cross-tenant denied",
        "args": [
          {
            "id": "u1",
            "tenant": "t2"
          },
          {
            "ownerId": "u1",
            "tenantId": "t1"
          },
          "read"
        ],
        "expected": false
      },
      {
        "label": "Delete denied",
        "args": [
          {
            "id": "u1",
            "tenant": "t1"
          },
          {
            "ownerId": "u1",
            "tenantId": "t1"
          },
          "delete"
        ],
        "expected": false
      }
    ]
  }
];
