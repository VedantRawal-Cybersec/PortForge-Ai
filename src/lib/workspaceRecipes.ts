import type {PracticeLevel} from "./practiceLevels";
export type WorkspaceRecipe={
  id:string;title:string;language:"javascript"|"python"|"sql";difficulty:PracticeLevel;
  description:string;brief:string;acceptance:string[];starter:string;
};
export const workspaceRecipes:WorkspaceRecipe[]=[
  {
    id:"js-validator",title:"Validate a registration form",language:"javascript",difficulty:"beginner",
    description:"Build and test honest input validation",brief:"Make a small validator that checks email formatting and minimum name length.",
    acceptance:["Reject blank and very short names","Reject malformed email input","Return explicit errors, never silently accept invalid data"],
    starter:`function validateUser(user) {
  const errors = [];
  // TODO: check name length and email syntax.
  return { valid: errors.length === 0, errors };
}
const examples = [
  {name: "Sam", email: "sam@example.com"},
  {name: "", email: "not-an-email"}
];
for (const user of examples) console.log(JSON.stringify(validateUser(user)));`,
  },
  {
    id:"js-tasks",title:"Build a task manager",language:"javascript",difficulty:"beginner",
    description:"Practice arrays, state and predictable data changes",brief:"Build pure helpers for adding, completing and filtering tasks.",
    acceptance:["Create tasks without mutating an original array","Complete by id and preserve other entries","Test invalid or missing ids"],
    starter:`function addTask(tasks, title) {
  // TODO: return a new array with a task.
  return tasks;
}
function completeTask(tasks, id) {
  // TODO: return a new array with one completed item.
  return tasks;
}
const tasks = [{id: 1, title: "Plan project", done: false}];
console.log(JSON.stringify(addTask(tasks, "Write tests")));
console.log(JSON.stringify(completeTask(tasks, 1)));`,
  },
  {
    id:"js-analytics",title:"Analyse product transactions",language:"javascript",difficulty:"intermediate",
    description:"Transform raw rows with deterministic tests",brief:"Summarize valid purchase records by category, omitting refunds and malformed values.",
    acceptance:["Exclude missing and negative amounts","Group records by category","Handle empty data and verify a known sample"],
    starter:`const transactions = [
  {category:"Books",amount:150,status:"paid"},
  {category:"Books",amount:50,status:"refunded"},
  {category:"Software",amount:300,status:"paid"},
  {category:"Books",amount:75,status:"paid"}
];
function totalsByCategory(rows) {
  // TODO: implement totals for valid paid transactions.
  return {};
}
const result = totalsByCategory(transactions);
console.log(JSON.stringify(result));
console.log("Expected Books=225 and Software=300");`,
  },
  {
    id:"js-auth",title:"Design authorization rules",language:"javascript",difficulty:"advanced",
    description:"Model denial-first access control with negative tests",brief:"Create a pure permission function without client-editable admin roles.",
    acceptance:["Default to deny","Reject access to another user's private record","Reject unauthenticated access","Use server-authenticated user identity as an input, not arbitrary client claims"],
    starter:`function mayReadProject(authenticatedUserId, project) {
  // TODO: deny if no user, then allow owner or public projects.
  return false;
}
const own = {ownerId:"u1",isPublic:false};
const other = {ownerId:"u2",isPublic:false};
const cases = [
  ["u1",own,true],
  ["u1",other,false],
  [null,own,false]
];
for (const [userId,project,expected] of cases) {
  const actual = mayReadProject(userId,project);
  console.log("expected:",expected,"actual:",actual);
}
console.log("Pure-function lab only, NOT a real server authorization policy.");`,
  },
  {
    id:"python-clean",title:"Clean and validate a CSV",language:"python",difficulty:"intermediate",
    description:"Data processing, edge cases and quality checks",brief:"Write a simple parser for rows and report malformed values.",
    acceptance:["Safely parse valid numeric values","Skip or record errors rather than crash silently","Explain how to test empty or duplicate rows"],
    starter:`from typing import Iterable
def clean_amounts(values: Iterable[str]):
    clean = []
    errors = []
    for value in values:
        # TODO: parse or report invalid values.
        pass
    return clean, errors

samples = ["12.5", "", "not-a-number", "-3"]
print(clean_amounts(samples))
# Python editing and AI review only. Run in your local Python environment.`,
  },
  {
    id:"python-api",title:"Build an API response validator",language:"python",difficulty:"advanced",
    description:"Schema boundaries and robust error paths",brief:"Normalize untrusted API responses and test missing fields.",
    acceptance:["Validate required keys and types","Avoid unsafe assumptions about nested data","Document error handling and security boundaries"],
    starter:`def normalize_response(payload):
    if not isinstance(payload, dict):
        raise ValueError("Expected an object")
    # TODO: validate nested records, limits, and acceptable values.
    return {}

examples = [{"items": []}, {"items": "wrong type"}]
for item in examples:
    try:
        print(normalize_response(item))
    except ValueError as error:
        print("Invalid:", error)
# Run with Python locally. PortForge does not execute this language here.`,
  },
  {
    id:"sql-report",title:"Design a reliable SQL report",language:"sql",difficulty:"intermediate",
    description:"JOINs, aggregations and duplicate checks",brief:"Write a query that reports customer totals without counting refunded orders.",
    acceptance:["Use joins with deliberate null behavior","Exclude refunds in a verifiable way","Handle customers who have no purchases"],
    starter:`-- Example schema: customers(id,name), orders(id,customer_id,amount,status).
-- TODO: report every customer's paid order total including zero totals.
SELECT c.id, c.name
FROM customers AS c;
-- SQL is editor-only. Execute against a disposable database you control.`,
  },
];
export function findWorkspaceRecipe(id:string){return workspaceRecipes.find(r=>r.id===id);}
