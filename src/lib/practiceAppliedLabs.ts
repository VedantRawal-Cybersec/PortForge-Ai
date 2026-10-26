import type {Exercise} from "./practice";
/** Evaluated in an isolated browser frame; no server code execution or certified assessment. */
export const appliedLabs:Exercise[]=[
  {
    "id": "frontend-form-errors",
    "title": "Build an accessible form error summary",
    "topic": "Frontend / Forms",
    "level": "Intermediate",
    "functionName": "formErrors",
    "brief": "Implement formErrors(data). Return field names in fixed order name, email, consent when: trimmed name is shorter than 2 characters, email does not match a basic address pattern, or consent is not exactly true. Return only the invalid field names. This is a controlled lesson, not a standards-complete email validator.",
    "starter": "function formErrors(data) {\n  // Return invalid field names, ordered name/email/consent.\n  return [];\n}",
    "hint": "Check every field independently. Use trim for name, a simple /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/ email check, and consent===true.",
    "tests": [
      {
        "label": "All valid",
        "args": [
          {
            "name": "Ada",
            "email": "ada@example.org",
            "consent": true
          }
        ],
        "expected": []
      },
      {
        "label": "Missing name",
        "args": [
          {
            "name": " ",
            "email": "ada@example.org",
            "consent": true
          }
        ],
        "expected": [
          "name"
        ]
      },
      {
        "label": "Missing consent and email",
        "args": [
          {
            "name": "Ada",
            "email": "invalid",
            "consent": false
          }
        ],
        "expected": [
          "email",
          "consent"
        ]
      },
      {
        "label": "Everything missing",
        "args": [
          {
            "name": "",
            "email": "",
            "consent": false
          }
        ],
        "expected": [
          "name",
          "email",
          "consent"
        ]
      }
    ]
  },
  {
    "id": "frontend-filter-products",
    "title": "Implement useful product search",
    "topic": "Frontend / Search",
    "level": "Beginner",
    "functionName": "filterProducts",
    "brief": "Implement filterProducts(products,query) returning the original-order list of products whose title contains query without case sensitivity. Ignore surrounding whitespace in query; a blank query returns all products. Do not mutate input data.",
    "starter": "function filterProducts(products,query) {\n  return [];\n}",
    "hint": "const q=query.trim().toLowerCase(); use products.filter(p=>p.title.toLowerCase().includes(q)).",
    "tests": [
      {
        "label": "Partial matching",
        "args": [
          [
            {
              "title": "Blue Shoes"
            },
            {
              "title": "Red Boots"
            }
          ],
          "shoe"
        ],
        "expected": [
          {
            "title": "Blue Shoes"
          }
        ]
      },
      {
        "label": "Case insensitive",
        "args": [
          [
            {
              "title": "Camera"
            },
            {
              "title": "Tripod"
            }
          ],
          " CAMERA "
        ],
        "expected": [
          {
            "title": "Camera"
          }
        ]
      },
      {
        "label": "Blank returns all",
        "args": [
          [
            {
              "title": "A"
            },
            {
              "title": "B"
            }
          ],
          " "
        ],
        "expected": [
          {
            "title": "A"
          },
          {
            "title": "B"
          }
        ]
      },
      {
        "label": "Nothing matches",
        "args": [
          [
            {
              "title": "A"
            }
          ],
          "none"
        ],
        "expected": []
      }
    ]
  },
  {
    "id": "frontend-pagination",
    "title": "Paginate accessible result cards",
    "topic": "Frontend / Lists",
    "level": "Intermediate",
    "functionName": "pageItems",
    "brief": "Implement pageItems(items,page,size). Pages are one-based. For invalid page or size values (not positive integers), return []. Do not mutate input; return a new slice of items. Useful for browsable mobile result lists.",
    "starter": "function pageItems(items,page,size) {\n  return [];\n}",
    "hint": "Check Number.isInteger(page) and Number.isInteger(size), ensure both >0, then slice((page-1)*size,page*size).",
    "tests": [
      {
        "label": "First page",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          1,
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "label": "Final partial page",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          3,
          2
        ],
        "expected": [
          5
        ]
      },
      {
        "label": "Out of bounds",
        "args": [
          [
            1,
            2
          ],
          6,
          2
        ],
        "expected": []
      },
      {
        "label": "Invalid page",
        "args": [
          [
            1,
            2
          ],
          0,
          2
        ],
        "expected": []
      }
    ]
  },
  {
    "id": "frontend-task-toggle",
    "title": "Implement immutable task toggling",
    "topic": "Frontend / State",
    "level": "Intermediate",
    "functionName": "toggleTask",
    "brief": "Implement toggleTask(tasks,id), returning a new array with only the matching item's done boolean inverted and other fields preserved. If no ID matches, return a shallow copy of the original array. Never modify input tasks.",
    "starter": "function toggleTask(tasks,id) {\n  return tasks;\n}",
    "hint": "Return tasks.map(task=>task.id===id ? {...task,done:!task.done} : task).",
    "tests": [
      {
        "label": "Toggle one task",
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
          1
        ],
        "expected": [
          {
            "id": 1,
            "done": true
          },
          {
            "id": 2,
            "done": false
          }
        ]
      },
      {
        "label": "Toggle off",
        "args": [
          [
            {
              "id": "a",
              "done": true
            }
          ],
          "a"
        ],
        "expected": [
          {
            "id": "a",
            "done": false
          }
        ]
      },
      {
        "label": "No match",
        "args": [
          [
            {
              "id": "a",
              "done": false
            }
          ],
          "b"
        ],
        "expected": [
          {
            "id": "a",
            "done": false
          }
        ]
      },
      {
        "label": "Preserve title",
        "args": [
          [
            {
              "id": "a",
              "title": "Code",
              "done": false
            }
          ],
          "a"
        ],
        "expected": [
          {
            "id": "a",
            "title": "Code",
            "done": true
          }
        ]
      }
    ]
  },
  {
    "id": "data-monthly-sales",
    "title": "Analyze monthly paid revenue",
    "topic": "Data / Revenue",
    "level": "Intermediate",
    "functionName": "monthlyRevenue",
    "brief": "Implement monthlyRevenue(orders). Sum nonnegative finite numeric amount for status 'paid' and ISO-shaped YYYY-MM-DD dates, grouping by first seven date characters. Ignore invalid rows. Return an object with month keys; assume input dates are synthetically validated and within supported years.",
    "starter": "function monthlyRevenue(orders) {\n  return {};\n}",
    "hint": "Use /^\\d{4}-\\d{2}-\\d{2}$/ on date, Number.isFinite(amount), amount>=0 and status==='paid'. month=date.slice(0,7).",
    "tests": [
      {
        "label": "Two months",
        "args": [
          [
            {
              "date": "2026-01-05",
              "amount": 20,
              "status": "paid"
            },
            {
              "date": "2026-01-31",
              "amount": 10,
              "status": "paid"
            },
            {
              "date": "2026-02-01",
              "amount": 8,
              "status": "paid"
            }
          ]
        ],
        "expected": {
          "2026-01": 30,
          "2026-02": 8
        }
      },
      {
        "label": "Ignore refund",
        "args": [
          [
            {
              "date": "2026-01-05",
              "amount": 40,
              "status": "refunded"
            }
          ]
        ],
        "expected": {}
      },
      {
        "label": "Reject bad value",
        "args": [
          [
            {
              "date": "2026-01-05",
              "amount": -5,
              "status": "paid"
            },
            {
              "date": "n/a",
              "amount": 5,
              "status": "paid"
            }
          ]
        ],
        "expected": {}
      },
      {
        "label": "Zero included",
        "args": [
          [
            {
              "date": "2026-01-01",
              "amount": 0,
              "status": "paid"
            }
          ]
        ],
        "expected": {
          "2026-01": 0
        }
      }
    ]
  },
  {
    "id": "data-event-dedup",
    "title": "Deduplicate raw event identifiers",
    "topic": "Data / Quality",
    "level": "Intermediate",
    "functionName": "dedupeEvents",
    "brief": "Implement dedupeEvents(events). Keep the earliest event with each nonblank string id; ignore entries without a valid id. Preserve original ordering and return a new array, without changing the objects. Real deduplication requires clearly defined business keys.",
    "starter": "function dedupeEvents(events) {\n  return [];\n}",
    "hint": "Use a Set of seen IDs and filter. Reject empty/whitespace IDs. Keep first appearance.",
    "tests": [
      {
        "label": "Duplicated event",
        "args": [
          [
            {
              "id": "e1",
              "v": 1
            },
            {
              "id": "e2",
              "v": 2
            },
            {
              "id": "e1",
              "v": 3
            }
          ]
        ],
        "expected": [
          {
            "id": "e1",
            "v": 1
          },
          {
            "id": "e2",
            "v": 2
          }
        ]
      },
      {
        "label": "Invalid keys",
        "args": [
          [
            {
              "id": " "
            },
            {
              "value": 2
            },
            {
              "id": "good",
              "v": 1
            }
          ]
        ],
        "expected": [
          {
            "id": "good",
            "v": 1
          }
        ]
      },
      {
        "label": "Empty list",
        "args": [
          []
        ],
        "expected": []
      },
      {
        "label": "Distinct IDs",
        "args": [
          [
            {
              "id": "a"
            },
            {
              "id": "b"
            }
          ]
        ],
        "expected": [
          {
            "id": "a"
          },
          {
            "id": "b"
          }
        ]
      }
    ]
  },
  {
    "id": "data-conversion-rate",
    "title": "Calculate a safe conversion rate",
    "topic": "Data / Metrics",
    "level": "Beginner",
    "functionName": "conversionPercent",
    "brief": "Implement conversionPercent(converted,eligible) returning a number in percent, not a string. Inputs must be nonnegative integers, eligible > 0, and converted <= eligible; invalid inputs return null. Do not round the result.",
    "starter": "function conversionPercent(converted,eligible) {\n  return null;\n}",
    "hint": "Check Number.isInteger for both values, 0<=converted<=eligible and eligible>0, then return converted/eligible*100.",
    "tests": [
      {
        "label": "Regular conversion",
        "args": [
          25,
          100
        ],
        "expected": 25
      },
      {
        "label": "Zero conversion",
        "args": [
          0,
          10
        ],
        "expected": 0
      },
      {
        "label": "No denominator",
        "args": [
          0,
          0
        ],
        "expected": null
      },
      {
        "label": "Impossible numerator",
        "args": [
          11,
          10
        ],
        "expected": null
      }
    ]
  },
  {
    "id": "data-missing-status",
    "title": "Build a data-quality status summary",
    "topic": "Data / Cleaning",
    "level": "Beginner",
    "functionName": "statusCounts",
    "brief": "Implement statusCounts(rows) returning an object with keys active, inactive, missing. Recognize only exact string statuses active and inactive; all other, null or missing statuses count as missing. This is a bounded synthetic dataset task.",
    "starter": "function statusCounts(rows) {\n  return {active:0,inactive:0,missing:0};\n}",
    "hint": "Start with all counts at zero and loop through rows, updating only the two known statuses; treat everything else as missing.",
    "tests": [
      {
        "label": "Three status kinds",
        "args": [
          [
            {
              "status": "active"
            },
            {
              "status": "inactive"
            },
            {
              "status": null
            }
          ]
        ],
        "expected": {
          "active": 1,
          "inactive": 1,
          "missing": 1
        }
      },
      {
        "label": "Unknown counted missing",
        "args": [
          [
            {
              "status": "pending"
            },
            {
              "status": "active"
            }
          ]
        ],
        "expected": {
          "active": 1,
          "inactive": 0,
          "missing": 1
        }
      },
      {
        "label": "No rows",
        "args": [
          []
        ],
        "expected": {
          "active": 0,
          "inactive": 0,
          "missing": 0
        }
      },
      {
        "label": "Repeated inactive",
        "args": [
          [
            {
              "status": "inactive"
            },
            {
              "status": "inactive"
            }
          ]
        ],
        "expected": {
          "active": 0,
          "inactive": 2,
          "missing": 0
        }
      }
    ]
  },
  {
    "id": "security-role-access",
    "title": "Test a simple RBAC permission model",
    "topic": "Defensive Security / RBAC",
    "level": "Intermediate",
    "functionName": "mayPerform",
    "brief": "Implement mayPerform(role,action). Recognize only admin, editor, viewer and only view, edit, delete actions. Admin may perform all three; editor may view and edit; viewer may only view. Unknown roles/actions always deny. This is a model, not a backend access control.",
    "starter": "function mayPerform(role,action) {\n  return false;\n}",
    "hint": "Define allowedActions={admin:['view','edit','delete'],editor:['view','edit'],viewer:['view']} and check includes(action).",
    "tests": [
      {
        "label": "Admin delete",
        "args": [
          "admin",
          "delete"
        ],
        "expected": true
      },
      {
        "label": "Editor delete denied",
        "args": [
          "editor",
          "delete"
        ],
        "expected": false
      },
      {
        "label": "Viewer view",
        "args": [
          "viewer",
          "view"
        ],
        "expected": true
      },
      {
        "label": "Unknown permission denied",
        "args": [
          "owner",
          "view"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "security-mask-email",
    "title": "Redact addresses in support output",
    "topic": "Defensive Security / Privacy",
    "level": "Beginner",
    "functionName": "redactEmail",
    "brief": "Implement redactEmail(address). Return a string where a well-shaped email keeps the first character of the local part, masks all remaining local characters with *, and preserves the domain; invalid input returns '[invalid]'. The output is an educational redaction, not guaranteed irreversible anonymization.",
    "starter": "function redactEmail(address) {\n  return '[invalid]';\n}",
    "hint": "Split on exactly one @. Require a nonempty local part and a domain with a dot. Keep local[0], replace local.slice(1) with '*' repeated.",
    "tests": [
      {
        "label": "Multi character",
        "args": [
          "ada@example.org"
        ],
        "expected": "a**@example.org"
      },
      {
        "label": "One character",
        "args": [
          "a@example.org"
        ],
        "expected": "a@example.org"
      },
      {
        "label": "Invalid input",
        "args": [
          "not-email"
        ],
        "expected": "[invalid]"
      },
      {
        "label": "Empty input",
        "args": [
          ""
        ],
        "expected": "[invalid]"
      }
    ]
  },
  {
    "id": "security-failure-count",
    "title": "Summarize synthetic sign-in failures by IP",
    "topic": "Defensive Security / Triage",
    "level": "Intermediate",
    "functionName": "failureCountsByIp",
    "brief": "Implement failureCountsByIp(events). Count outcome==='failure' grouped by nonblank string ip. Ignore success and events without a valid IP. A failed-login count is not proof of attack and must be corroborated.",
    "starter": "function failureCountsByIp(events) {\n  return {};\n}",
    "hint": "Loop through events, require e.outcome==='failure' and trimmed nonblank e.ip, then increment an object counter.",
    "tests": [
      {
        "label": "Repeated IP",
        "args": [
          [
            {
              "ip": "198.51.100.1",
              "outcome": "failure"
            },
            {
              "ip": "198.51.100.1",
              "outcome": "failure"
            }
          ]
        ],
        "expected": {
          "198.51.100.1": 2
        }
      },
      {
        "label": "Ignore success",
        "args": [
          [
            {
              "ip": "198.51.100.1",
              "outcome": "success"
            }
          ]
        ],
        "expected": {}
      },
      {
        "label": "Different IPs",
        "args": [
          [
            {
              "ip": "A",
              "outcome": "failure"
            },
            {
              "ip": "B",
              "outcome": "failure"
            }
          ]
        ],
        "expected": {
          "A": 1,
          "B": 1
        }
      },
      {
        "label": "Invalid IP label",
        "args": [
          [
            {
              "ip": " ",
              "outcome": "failure"
            },
            {
              "outcome": "failure"
            }
          ]
        ],
        "expected": {}
      }
    ]
  },
  {
    "id": "security-minimal-audit",
    "title": "Redact tokens from sample logs",
    "topic": "Defensive Security / Logging",
    "level": "Advanced",
    "functionName": "safeAudit",
    "brief": "Implement safeAudit(events) returning an array of objects containing only timestamp, event and user, preserving those fields exactly when present. Never include tokens, passwords, IP addresses or unrelated original properties. This pure exercise models data minimization; production logging needs secure infrastructure.",
    "starter": "function safeAudit(events) {\n  return [];\n}",
    "hint": "Use map(e=>({timestamp:e.timestamp,event:e.event,user:e.user})) and do not spread the original object.",
    "tests": [
      {
        "label": "Exclude secret",
        "args": [
          [
            {
              "timestamp": 1,
              "event": "login",
              "user": "u1",
              "token": "SECRET"
            }
          ]
        ],
        "expected": [
          {
            "timestamp": 1,
            "event": "login",
            "user": "u1"
          }
        ]
      },
      {
        "label": "Many rows",
        "args": [
          [
            {
              "timestamp": 1,
              "event": "logout",
              "user": "a"
            },
            {
              "timestamp": 2,
              "event": "login",
              "user": "b",
              "password": "pw"
            }
          ]
        ],
        "expected": [
          {
            "timestamp": 1,
            "event": "logout",
            "user": "a"
          },
          {
            "timestamp": 2,
            "event": "login",
            "user": "b"
          }
        ]
      },
      {
        "label": "Empty",
        "args": [
          []
        ],
        "expected": []
      },
      {
        "label": "Remove unrelated",
        "args": [
          [
            {
              "timestamp": 4,
              "event": "view",
              "user": "u",
              "ip": "127.0.0.1",
              "private": "x"
            }
          ]
        ],
        "expected": [
          {
            "timestamp": 4,
            "event": "view",
            "user": "u"
          }
        ]
      }
    ]
  }
];
