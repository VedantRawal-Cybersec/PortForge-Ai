import type {Exercise} from "./practice";
/** Executable browser-local practice tasks. Not production API/security validation. */
export const flagshipExercises:Exercise[]=[
  {
    "id": "real-form-validation",
    "title": "Validate a real signup form",
    "topic": "Frontend / Forms",
    "level": "Beginner",
    "brief": "Implement validateSignup(user). Return {valid,errors}; required name must have at least 2 non-space characters and email must contain nonblank text around @ and a dot in the domain. Report errors in name, email order. This is a training example, not a complete email standard.",
    "functionName": "validateSignup",
    "starter": "function validateSignup(user) {\n  // Required name and simple email check.\n  return {valid:true,errors:[]};\n}",
    "hint": "Trim both inputs. Push 'name' if trimmed name length is below 2. Push 'email' if a simple regex fails. Return the errors and validity.",
    "tests": [
      {
        "label": "Realistic valid input",
        "args": [
          {
            "name": "Ada Lovelace",
            "email": "ada@example.org"
          }
        ],
        "expected": {
          "valid": true,
          "errors": []
        }
      },
      {
        "label": "Blank name",
        "args": [
          {
            "name": " ",
            "email": "ada@example.org"
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
        "label": "Malformed email",
        "args": [
          {
            "name": "Ada",
            "email": "wrong"
          }
        ],
        "expected": {
          "valid": false,
          "errors": [
            "email"
          ]
        }
      },
      {
        "label": "Both missing",
        "args": [
          {
            "name": "",
            "email": ""
          }
        ],
        "expected": {
          "valid": false,
          "errors": [
            "name",
            "email"
          ]
        }
      }
    ]
  },
  {
    "id": "immutable-task-update",
    "title": "Update a task without mutation",
    "topic": "Frontend / State",
    "level": "Intermediate",
    "brief": "Implement completeTask(tasks,id), returning a new array with matching task done:true, without mutating any input object; tasks that do not match stay unchanged. Multiple tasks may exist.",
    "functionName": "completeTask",
    "starter": "function completeTask(tasks,id) {\n  // Return a new array; do not change the input objects.\n  return tasks;\n}",
    "hint": "Use tasks.map(task => task.id === id ? {...task,done:true} : task). Never assign to task.done directly.",
    "tests": [
      {
        "label": "One matching task",
        "args": [
          [
            {
              "id": 1,
              "done": false
            },
            {
              "id": 2,
              "done": false
            }
          ],
          2
        ],
        "expected": [
          {
            "id": 1,
            "done": false
          },
          {
            "id": 2,
            "done": true
          }
        ]
      },
      {
        "label": "Missing ID",
        "args": [
          [
            {
              "id": 1,
              "done": false
            }
          ],
          9
        ],
        "expected": [
          {
            "id": 1,
            "done": false
          }
        ]
      },
      {
        "label": "Empty tasks",
        "args": [
          [],
          1
        ],
        "expected": []
      },
      {
        "label": "Preserve other fields",
        "args": [
          [
            {
              "id": "a",
              "done": false,
              "title": "Learn"
            }
          ],
          "a"
        ],
        "expected": [
          {
            "id": "a",
            "done": true,
            "title": "Learn"
          }
        ]
      }
    ]
  },
  {
    "id": "valid-revenue-report",
    "title": "Reconcile paid revenue by category",
    "topic": "Data Analysis / Aggregation",
    "level": "Intermediate",
    "brief": "Implement paidTotals(rows), returning an object of category:total. Include only status 'paid', finite numeric nonnegative amount, and nonblank category. This works on synthetic input; real datasets need source validation.",
    "functionName": "paidTotals",
    "starter": "function paidTotals(rows) {\n  // Group only valid paid rows by category.\n  return {};\n}",
    "hint": "Check status, Number.isFinite(amount), amount>=0 and trimmed category, then accumulate into a plain object.",
    "tests": [
      {
        "label": "Exclude refunded orders",
        "args": [
          [
            {
              "category": "Books",
              "amount": 80,
              "status": "paid"
            },
            {
              "category": "Books",
              "amount": 40,
              "status": "refunded"
            },
            {
              "category": "Audio",
              "amount": 25,
              "status": "paid"
            }
          ]
        ],
        "expected": {
          "Books": 80,
          "Audio": 25
        }
      },
      {
        "label": "Invalid amount excluded",
        "args": [
          [
            {
              "category": "Books",
              "amount": -4,
              "status": "paid"
            },
            {
              "category": "Books",
              "amount": 11,
              "status": "paid"
            },
            {
              "category": "Books",
              "amount": "3",
              "status": "paid"
            }
          ]
        ],
        "expected": {
          "Books": 11
        }
      },
      {
        "label": "Empty rows",
        "args": [
          []
        ],
        "expected": {}
      },
      {
        "label": "Different categories",
        "args": [
          [
            {
              "category": "A",
              "amount": 0,
              "status": "paid"
            },
            {
              "category": "B",
              "amount": 2.5,
              "status": "paid"
            }
          ]
        ],
        "expected": {
          "A": 0,
          "B": 2.5
        }
      }
    ]
  },
  {
    "id": "data-quality-counts",
    "title": "Audit missing customer fields",
    "topic": "Data Analysis / Quality",
    "level": "Beginner",
    "brief": "Implement qualityReport(rows). Return {rows,missingEmail,missingRegion}; count a value as missing when it is null, undefined, non-string, or an all-whitespace string. Count missing fields independently.",
    "functionName": "qualityReport",
    "starter": "function qualityReport(rows) {\n  // Count total rows and missing email/region independently.\n  return {rows:0,missingEmail:0,missingRegion:0};\n}",
    "hint": "Use a helper missing(v) that checks typeof v!=='string' || v.trim()==='' and count each field separately.",
    "tests": [
      {
        "label": "Mixed quality",
        "args": [
          [
            {
              "email": "x@a.test",
              "region": "West"
            },
            {
              "email": "",
              "region": " East "
            },
            {
              "email": "ok@b.test",
              "region": null
            }
          ]
        ],
        "expected": {
          "rows": 3,
          "missingEmail": 1,
          "missingRegion": 1
        }
      },
      {
        "label": "Missing both",
        "args": [
          [
            {
              "email": " ",
              "region": ""
            }
          ]
        ],
        "expected": {
          "rows": 1,
          "missingEmail": 1,
          "missingRegion": 1
        }
      },
      {
        "label": "Empty source",
        "args": [
          []
        ],
        "expected": {
          "rows": 0,
          "missingEmail": 0,
          "missingRegion": 0
        }
      },
      {
        "label": "Non-string values",
        "args": [
          [
            {
              "email": 5,
              "region": false
            },
            {
              "email": "valid",
              "region": "South"
            }
          ]
        ],
        "expected": {
          "rows": 2,
          "missingEmail": 1,
          "missingRegion": 1
        }
      }
    ]
  },
  {
    "id": "owner-authorization-model",
    "title": "Model owner-only record access",
    "topic": "Defensive Security / Authorization",
    "level": "Intermediate",
    "brief": "Implement canReadRecord(authenticatedId,record) returning true only when a nonempty authenticatedId exactly matches record.ownerId. This is a pure-function training model, NOT real server authorization.",
    "functionName": "canReadRecord",
    "starter": "function canReadRecord(authenticatedId,record) {\n  // Deny by default; allow only the authenticated owner.\n  return false;\n}",
    "hint": "Check authenticatedId is a nonempty string and record is an object with matching ownerId; do not trust client-side flags.",
    "tests": [
      {
        "label": "Authenticated owner",
        "args": [
          "u1",
          {
            "ownerId": "u1",
            "private": true
          }
        ],
        "expected": true
      },
      {
        "label": "Cross-user denied",
        "args": [
          "u2",
          {
            "ownerId": "u1",
            "private": true
          }
        ],
        "expected": false
      },
      {
        "label": "No authentication denied",
        "args": [
          null,
          {
            "ownerId": "u1"
          }
        ],
        "expected": false
      },
      {
        "label": "Missing record denied",
        "args": [
          "u1",
          null
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "synthetic-auth-log-counts",
    "title": "Summarize synthetic login failures",
    "topic": "Defensive Security / Log Analysis",
    "level": "Beginner",
    "brief": "Implement countFailures(events), returning an object mapping nonblank usernames to counts of events whose outcome is exactly 'failure'. Ignore successes and events with invalid user labels. A count is not proof of an attack.",
    "functionName": "countFailures",
    "starter": "function countFailures(events) {\n  // Count failed sign-ins by user; ignore invalid records.\n  return {};\n}",
    "hint": "Iterate events. If e.outcome==='failure' and typeof e.user==='string' with nonblank trim, increment a count.",
    "tests": [
      {
        "label": "Failure versus success",
        "args": [
          [
            {
              "user": "ada",
              "outcome": "failure"
            },
            {
              "user": "ada",
              "outcome": "success"
            },
            {
              "user": "ada",
              "outcome": "failure"
            }
          ]
        ],
        "expected": {
          "ada": 2
        }
      },
      {
        "label": "Multiple users",
        "args": [
          [
            {
              "user": "alice",
              "outcome": "failure"
            },
            {
              "user": "bob",
              "outcome": "failure"
            },
            {
              "user": "alice",
              "outcome": "failure"
            }
          ]
        ],
        "expected": {
          "alice": 2,
          "bob": 1
        }
      },
      {
        "label": "Empty events",
        "args": [
          []
        ],
        "expected": {}
      },
      {
        "label": "Bad labels",
        "args": [
          [
            {
              "user": " ",
              "outcome": "failure"
            },
            {
              "user": null,
              "outcome": "failure"
            },
            {
              "user": "jane",
              "outcome": "success"
            }
          ]
        ],
        "expected": {}
      }
    ]
  }
];
