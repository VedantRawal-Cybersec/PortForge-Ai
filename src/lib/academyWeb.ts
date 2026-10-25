import {composeAcademyTracks,type TrackSpec} from "./academyFactory";
const items:TrackSpec[]=[
  [
    "frontend",
    "Frontend Developer",
    "Web & Software",
    "🌐",
    "Build usable, responsive websites.",
    "Build an accessible responsive personal site with a working form and keyboard test.",
    "frontend",
    [
      [
        "Semantic HTML",
        "Semantic elements describe content roles to browsers and assistive technology. Use a main landmark for the page's primary content.",
        "Wrap the core article in <main>, navigation in <nav>.",
        "Which element identifies the page's main content?",
        "<main>",
        "<small>",
        "<style>",
        "A main landmark makes primary content easier to navigate.",
        "Look for meaning rather than styling."
      ],
      [
        "Responsive layout",
        "Fluid sizes, grid and media queries adapt interfaces to different viewports. Test narrow and zoomed screens.",
        "Use grid-template-columns and minmax() to allow cards to wrap.",
        "What is a robust approach to mobile cards?",
        "Fluid grid with minmax()",
        "Fixed 1400px container",
        "Disable zoom",
        "Fluid layouts accommodate changing widths.",
        "Think about 320px screens."
      ],
      [
        "Accessibility tests",
        "An interface needs keyboard operation, visible focus, labels and clear errors. A pretty screenshot is not a usability test.",
        "Navigate the form with Tab, submit it empty, check label and error descriptions.",
        "What best validates keyboard usability?",
        "Perform a tab/enter/escape walkthrough",
        "Change the border color",
        "Use only mouse testing",
        "Real keyboard interaction exposes inaccessible controls.",
        "Test a user action without a mouse."
      ]
    ]
  ],
  [
    "backend",
    "Backend Developer",
    "Web & Software",
    "🖧",
    "Build APIs and trustworthy data services.",
    "Create a small documented API with input validation and owner-only access checks.",
    "backend",
    [
      [
        "HTTP requests",
        "An API maps request methods and paths to server behaviors. GET generally retrieves; POST often creates.",
        "GET /tasks lists tasks; POST /tasks validates and adds a task.",
        "What is GET normally used for?",
        "Retrieving a resource",
        "Deleting a user automatically",
        "Encrypting the database",
        "GET is conventionally safe/read-only and should not mutate data.",
        "Look at REST method semantics."
      ],
      [
        "Validation",
        "Validate untrusted input on the server before storage or sensitive operations. A frontend form is bypassable.",
        "Reject a task title that is empty or exceeds the allowed length.",
        "Where must API input validation be enforced?",
        "On the server",
        "Only in the browser",
        "Only in CSS",
        "The server is the authoritative boundary for client-supplied data.",
        "Assume the browser can be modified."
      ],
      [
        "Authorization",
        "Authentication tells you who a user is; authorization checks which records they can access.",
        "Test that account A cannot request account B's private task by changing the URL ID.",
        "Which safeguard prevents cross-user data leaks?",
        "Per-request object authorization",
        "Long random URLs alone",
        "A spinner",
        "Ownership checks need to run for every private object access.",
        "Identity and permission are different."
      ]
    ]
  ],
  [
    "fullstack",
    "Full-Stack Developer",
    "Web & Software",
    "🧱",
    "Connect accessible UIs, APIs and databases.",
    "Build a small full-stack task board with validated operations and tested user isolation.",
    "full-stack",
    [
      [
        "Client-server flow",
        "A browser calls an API, which may validate input and work with a database. Different layers have different trust levels.",
        "A form sends POST /tasks; the server checks it and saves a row.",
        "Which layer must enforce authorization?",
        "Trusted server or database policies",
        "A hidden UI button",
        "Browser localStorage",
        "Client controls do not prevent direct API requests.",
        "Think where an attacker can bypass a check."
      ],
      [
        "State and persistence",
        "UI state is temporary unless data is persisted. Saving to a backend and fetching it after reload are separate concerns.",
        "Refresh a dashboard and confirm newly added tasks reappear.",
        "What proves a record was persisted?",
        "It survives reload and authorized retrieval",
        "It appears once after clicking",
        "A toast says saved",
        "A UI confirmation is not evidence the server committed data.",
        "Check after a reload."
      ],
      [
        "End-to-end tests",
        "Validate a complete user workflow from interface through data storage and error handling.",
        "Create, reload, edit and delete a test task, then verify a different user cannot see it.",
        "What is an end-to-end acceptance check?",
        "A user action and its observable system result",
        "A single CSS snapshot only",
        "A build passing without runtime tests",
        "E2E validates integrated behavior across layers.",
        "Test as a user, not only a function."
      ]
    ]
  ],
  [
    "html-css",
    "HTML & CSS",
    "Web & Software",
    "🎨",
    "Structure and style the web with accessible foundations.",
    "Create a responsive landing page with semantic sections and checked typography.",
    "html",
    [
      [
        "Document structure",
        "HTML provides document meaning. Headings should form a logical outline and buttons should be actual button elements.",
        "Use <h1> for the main page heading and <button> for a click action.",
        "What should trigger an accessible action?",
        "A semantic <button>",
        "An unlabelled <div> only",
        "A blank <span>",
        "Native elements provide keyboard and semantic behavior.",
        "Prefer a native interactive element."
      ],
      [
        "Layout fundamentals",
        "Flexbox arranges one dimension; Grid handles two-dimensional layouts. Both support flexible sizing.",
        "Use display:grid with repeat(auto-fit,minmax(220px,1fr)).",
        "Which CSS feature works well for a responsive two-dimensional card layout?",
        "CSS Grid",
        "position:absolute for every card",
        "Fixed pixel offsets",
        "Grid expresses rows and columns and adapts to available space.",
        "Think in rows and columns."
      ],
      [
        "Accessible visual design",
        "Contrast, readable size and visible focus improve access. Color alone must not convey important meaning.",
        "Show a field error with a message and icon, not only a red border.",
        "Which communicates an input error reliably?",
        "Text message and visible state",
        "Red color alone",
        "A hidden tooltip only",
        "Multiple cues help different users understand the issue.",
        "Color perception varies."
      ]
    ]
  ],
  [
    "javascript",
    "JavaScript",
    "Web & Software",
    "🟨",
    "Program interactive behavior and test logic.",
    "Implement a small form validator with meaningful edge-case tests.",
    "javascript",
    [
      [
        "Variables and types",
        "JavaScript values include numbers, strings, booleans and objects; let allows reassignment while const does not.",
        "let total=0; total+=5; console.log(total);",
        "What does total become after total+=5 if it started at 0?",
        "5",
        "0",
        "'05' always",
        "Numeric addition updates the number to five.",
        "Check the original value and operator."
      ],
      [
        "Functions and arrays",
        "Functions encapsulate reusable behavior; map transforms values and filter selects matching ones.",
        "[1,2,3].filter(x=>x>1) produces [2,3].",
        "What does array.filter() return?",
        "Items matching the predicate",
        "Only the first item always",
        "A mutated global variable",
        "filter returns a new array of selected elements.",
        "Notice the condition in the callback."
      ],
      [
        "Async and errors",
        "Promises represent eventual results; failures need explicit handling and recoverable user states.",
        "Try await fetch() in try/catch and display an error message on failure.",
        "What should async UI do on a rejected request?",
        "Handle error and preserve user progress",
        "Wait forever",
        "Assume data exists",
        "Async operations can fail and must not silently corrupt state.",
        "Think beyond the happy path."
      ]
    ]
  ],
  [
    "typescript",
    "TypeScript",
    "Web & Software",
    "🔷",
    "Use types to clarify contracts and reduce avoidable bugs.",
    "Type a small task API and validate user input at runtime.",
    "typescript",
    [
      [
        "Static type checking",
        "TypeScript checks code during development and is erased when compiled to JavaScript. Types do not validate untrusted runtime JSON.",
        "type Task={id:string;done:boolean};",
        "Does TypeScript alone validate data arriving from an API?",
        "No, runtime validation is still needed",
        "Yes, every response is verified",
        "Only for arrays",
        "Compile-time types do not inspect arbitrary runtime values.",
        "Separate static and runtime checks."
      ],
      [
        "Unions and narrowing",
        "A discriminated union makes states explicit and enables exhaustive code branches.",
        "type Result={ok:true;value:string}|{ok:false;error:string};",
        "What safely distinguishes these union cases?",
        "Check the discriminant field ok",
        "Assume all responses are successful",
        "Cast everything to any",
        "Narrow using the discriminant before accessing properties.",
        "Look at the field shared by alternatives."
      ],
      [
        "Type boundaries",
        "Avoid any at external interfaces. Validate unknown values before trusting object shape.",
        "Parse JSON as unknown, then check typeof value==='object'.",
        "How should an unknown API payload be handled?",
        "Validate before using its fields",
        "Assert it is correct without checking",
        "Store it in a CSS class",
        "Unknown forces an explicit proof before property use.",
        "An external response is not inherently trusted."
      ]
    ]
  ],
  [
    "react",
    "React",
    "Web & Software",
    "⚛️",
    "Build component interfaces with predictable state.",
    "Build a small stateful dashboard with loading, failure and accessibility tests.",
    "react",
    [
      [
        "Components and props",
        "A component describes part of the UI; props pass information from a parent. Components should be composed, not copied.",
        "<TaskCard title='Study' /> renders a reusable task card.",
        "What are props for?",
        "Passing inputs to a component",
        "Saving every user account",
        "Styling browsers globally",
        "Props parameterize reusable components.",
        "Think parent-to-child input."
      ],
      [
        "State updates",
        "State changes should be immutable and based on current state when updates depend on the previous value.",
        "setCount(previous=>previous+1) avoids stale closures.",
        "Which update uses the previous state safely?",
        "setCount(prev=>prev+1)",
        "count++ without setting state",
        "Assigning directly to props",
        "Functional updates receive the latest previous state.",
        "Use the previous value when computing the next."
      ],
      [
        "Effects and cleanup",
        "Effects synchronize with external systems; clean up subscriptions to avoid duplicate handlers and leaks.",
        "An effect adds an event listener and removes it in its cleanup return.",
        "When is effect cleanup especially important?",
        "When subscribing or starting intervals",
        "Only when changing text color",
        "Never",
        "External resources outlive renders without cleanup.",
        "Think listeners and timers."
      ]
    ]
  ],
  [
    "nextjs",
    "Next.js",
    "Web & Software",
    "▲",
    "Build React applications with routing and server behavior.",
    "Implement a responsive content listing and validate protected server actions.",
    "nextjs",
    [
      [
        "Routing",
        "App Router maps folders and page files to URLs, while layouts can share navigation.",
        "app/articles/page.tsx defines an articles page route.",
        "Where is an App Router page usually declared?",
        "A page.tsx file in app/ route hierarchy",
        "Only index.css",
        "A public PDF",
        "The App Router organizes routes by filesystem segments.",
        "Think route folders."
      ],
      [
        "Rendering boundaries",
        "Server and client components have distinct roles. Client components enable browser interactivity; server code must not leak secrets.",
        "Use 'use client' only in components needing browser state or effects.",
        "What belongs in the client?",
        "Interactive UI that needs browser APIs",
        "Server secrets",
        "Database admin tokens",
        "Secret-bearing work must stay server-side.",
        "Which environment can visitors inspect?"
      ],
      [
        "Secure server work",
        "Authentication and per-resource authorization must be verified in server actions and handlers; frontend hiding is insufficient.",
        "Reject an update unless the authenticated user owns that record.",
        "Can a hidden client button enforce object ownership?",
        "No, enforce authorization server-side",
        "Yes, if hidden with CSS",
        "Yes, if its name is random",
        "Clients can invoke endpoints directly.",
        "Assume requests can be constructed manually."
      ]
    ]
  ],
  [
    "api-design",
    "API Design",
    "Web & Software",
    "🔌",
    "Specify consistent, versionable service interfaces.",
    "Document and validate a task-management API with error examples.",
    "api-design",
    [
      [
        "Resource contracts",
        "APIs communicate via routes, methods and schemas. A clear contract defines required inputs and possible errors.",
        "POST /tasks expects {title:string} and responds with an id.",
        "What reduces API consumer ambiguity?",
        "Defined request and response schemas",
        "Only a logo",
        "Random endpoint names",
        "Contracts clarify what clients may send and receive.",
        "Think input and output structure."
      ],
      [
        "Errors and status codes",
        "Choose meaningful HTTP statuses: 400 for malformed requests, 401 for unauthenticated, 403 for forbidden.",
        "A logged-in user asking for another person's private record receives 403 or an intentional 404.",
        "What does 401 generally mean?",
        "Authentication is required or invalid",
        "The request succeeded",
        "The payload is too large only",
        "401 communicates missing or invalid authentication.",
        "Distinguish identity from permission."
      ],
      [
        "Versioning and tests",
        "Contract tests protect clients against accidental breaking changes and distinguish additive updates from incompatible ones.",
        "Add a field without removing an old required response key.",
        "What catches unexpected response-contract regressions?",
        "Automated schema/contract tests",
        "Browser theme checks only",
        "Changing all endpoints at once",
        "Contract tests assert stable responses across releases.",
        "Test consumers' expectations."
      ]
    ]
  ],
  [
    "system-design",
    "System Design",
    "Web & Software",
    "🏛️",
    "Reason about components, scale and failure modes.",
    "Draw a small service architecture with capacity and failure assumptions.",
    "system-design",
    [
      [
        "Requirements",
        "Begin with users, constraints, scale and expected behavior before drawing infrastructure.",
        "Clarify whether a chat app needs offline access or strict ordering.",
        "What is the first useful design step?",
        "Clarify functional and quality requirements",
        "Choose a database immediately",
        "Add ten microservices",
        "Architecture depends on the actual problem and constraints.",
        "Ask what must work first."
      ],
      [
        "Data trade-offs",
        "Caching, partitioning and consistency each solve different problems and introduce failure modes.",
        "Cache public article lists while checking freshness and invalidation.",
        "Which issue must a cache design address?",
        "Invalidation and staleness",
        "Font selection",
        "HTML headings only",
        "Cached values may become stale without a strategy.",
        "Think freshness after an update."
      ],
      [
        "Reliability plans",
        "Model failure modes, safe retries and idempotency for actions that must not occur twice.",
        "Use an idempotency key for a payment request retry.",
        "Why use idempotency for side effects?",
        "Prevent duplicate effects on retries",
        "Remove authentication",
        "Always make queries faster",
        "Retries can repeat an action unless the service deduplicates it.",
        "Think duplicate messages and payments."
      ]
    ]
  ],
  [
    "dsa",
    "Data Structures & Algorithms",
    "Web & Software",
    "🧮",
    "Choose efficient structures and explain complexity.",
    "Compare implementations of searching and grouping tasks with measured test cases.",
    "datastructures-and-algorithms",
    [
      [
        "Arrays and maps",
        "Arrays provide ordered access; maps provide key-based lookup. Choose by access patterns.",
        "Map user IDs to records when repeated lookup is required.",
        "Which structure supports convenient key-based lookup?",
        "Map / dictionary",
        "Only an unsorted list",
        "CSS selector",
        "Hash maps commonly offer fast average key lookup.",
        "Think repeated ID lookup."
      ],
      [
        "Time complexity",
        "Big-O describes growth of resource cost with input size rather than exact milliseconds.",
        "A linear scan of n items is O(n); nested loops may be O(n²).",
        "What is the time growth of one full pass over n elements?",
        "O(n)",
        "O(n²)",
        "O(1) for all inputs",
        "One proportional loop examines each element once.",
        "Count iterations as n grows."
      ],
      [
        "Correctness testing",
        "Test base cases, duplicates, negatives and empty input before optimizing code.",
        "Check binary search on a missing value and empty array.",
        "Which tests help reveal algorithm edge cases?",
        "Empty, duplicate and boundary inputs",
        "Only one ordinary example",
        "Only timing on one machine",
        "Correctness must hold beyond the happy path.",
        "Think about unusual input shapes."
      ]
    ]
  ],
  [
    "git",
    "Git & GitHub",
    "Web & Software",
    "🌿",
    "Track changes and collaborate safely.",
    "Create a project with commits, a branch, a reviewed PR and a changelog.",
    "git-github",
    [
      [
        "Commits",
        "A commit is a local snapshot of tracked changes. Small descriptive commits improve review and recovery.",
        "Commit a working feature separately from a subsequent bug fix.",
        "What does a commit capture?",
        "A versioned snapshot of tracked changes",
        "A deployed website automatically",
        "An encryption key",
        "Commits record repository history, not deployment status.",
        "Separate version control from release."
      ],
      [
        "Branches",
        "Branches let you isolate changes before integration and review.",
        "Create a feature branch and open a pull request against main.",
        "Why develop on a feature branch?",
        "Review changes separately before merging",
        "Erase everyone else's work",
        "Disable tests",
        "Branches provide independent development context.",
        "Think isolated change sets."
      ],
      [
        "Safe collaboration",
        "A PR should run tests and receive review; conflicts need deliberate resolution.",
        "Review diff, check CI and resolve conflicts before merge.",
        "When should a branch be merged?",
        "After reviewing changes and passing required checks",
        "Immediately regardless of tests",
        "When the build is red",
        "Merge gates reduce unintended regressions.",
        "Look at verification first."
      ]
    ]
  ],
  [
    "python",
    "Python",
    "Web & Software",
    "🐍",
    "Learn practical scripting, data handling and testing.",
    "Write a robust CSV-cleaning script with unit tests and error reporting.",
    "python",
    [
      [
        "Python values",
        "Python supports lists, dictionaries, strings, numbers and explicit indentation. Types can be inspected and validated.",
        "counts={'ok':2}; counts['ok'] returns 2.",
        "Which structure maps keys to values?",
        "Dictionary",
        "Tuple only",
        "Comment",
        "Dictionaries associate keys with values.",
        "Think lookup by label."
      ],
      [
        "Functions",
        "Functions take inputs and return results; small pure functions are easier to test.",
        "def add(a,b): return a+b",
        "What does return do inside a Python function?",
        "Sends a value to the caller",
        "Prints to the screen always",
        "Exits the interpreter",
        "return defines the value a caller receives.",
        "Distinguish return from print."
      ],
      [
        "Exceptions and tests",
        "Catch expected exceptions narrowly and test malformed input; avoid silently swallowing every error.",
        "Test float('abc') and produce a clear validation message.",
        "What is a robust response to malformed input?",
        "Report a clear error without silently dropping it",
        "Catch everything and do nothing",
        "Assume the value is numeric",
        "Errors need enough context for diagnosis.",
        "Consider invalid user data."
      ]
    ]
  ],
  [
    "java",
    "Java",
    "Web & Software",
    "☕",
    "Develop typed object-oriented applications.",
    "Build a small contact service with validation and tests.",
    "java",
    [
      [
        "Classes and objects",
        "A class specifies fields and behavior; objects are instances with state.",
        "class User { String name; } declares a class with a name field.",
        "What is an object?",
        "An instance of a class",
        "A Java package manager",
        "A database automatically",
        "Objects instantiate class definitions.",
        "Distinguish blueprint from instance."
      ],
      [
        "Interfaces",
        "Interfaces specify contracts that different classes can implement.",
        "interface Repository { User find(String id); }",
        "What does an interface usually define?",
        "A behavior contract",
        "A screenshot",
        "An executable database migration",
        "Interfaces express required methods across implementations.",
        "Think multiple implementations."
      ],
      [
        "Tests and errors",
        "Use clear exceptions, validation and repeatable tests for normal and exceptional cases.",
        "Write a JUnit test for a missing contact ID.",
        "What should a service do with invalid input?",
        "Validate and return/throw a defined error",
        "Crash without explanation",
        "Ignore it always",
        "Explicit failure contracts make programs predictable.",
        "Test both valid and invalid cases."
      ]
    ]
  ],
  [
    "cpp",
    "C++",
    "Web & Software",
    "⚙️",
    "Explore performance-minded systems programming.",
    "Implement a container utility and test ownership, bounds and runtime.",
    "cpp",
    [
      [
        "Types and memory",
        "C++ distinguishes value lifetimes and resource ownership. Modern RAII ties cleanup to object lifetime.",
        "Use std::vector<int> rather than a raw manually allocated array for dynamic collections.",
        "What manages dynamic array memory automatically?",
        "std::vector",
        "A raw pointer alone",
        "A macro only",
        "Standard containers manage resources safely by default.",
        "Look for a standard collection."
      ],
      [
        "References",
        "References provide aliases to objects; const references can avoid copies while preventing mutation through that reference.",
        "void inspect(const std::string& name) avoids copying a string.",
        "Why pass a large object by const reference?",
        "Avoid a copy without changing it",
        "To delete it automatically",
        "To cast it to void",
        "Const references can reduce copies and preserve read-only intent.",
        "Consider ownership and copies."
      ],
      [
        "Bounds and tests",
        "Out-of-bounds access can cause undefined behavior; use safe container operations and sanitizers.",
        "Test at(100) on a vector with only three items.",
        "Why run address sanitizers in development?",
        "Find memory misuse and access errors",
        "Improve graphics automatically",
        "Replace functional tests entirely",
        "Sanitizers help reveal memory safety problems.",
        "Think about invalid indices."
      ]
    ]
  ],
  [
    "rust",
    "Rust",
    "Web & Software",
    "🦀",
    "Learn ownership and safe systems programming.",
    "Build a small file parser using Result, ownership and tests.",
    "rust",
    [
      [
        "Ownership",
        "Rust tracks ownership and moves to manage memory safely without garbage collection.",
        "Move a String into a function or borrow it with &str.",
        "Why use borrowing?",
        "Use data without taking ownership",
        "Turn errors into warnings",
        "Disable the type system",
        "References let code access values under borrowing rules.",
        "Think who owns the value."
      ],
      [
        "Enums and Result",
        "Result<T,E> represents success or failure explicitly, encouraging callers to handle both.",
        "Read a file and match on Ok(contents) and Err(error).",
        "What does Result model?",
        "Either success data or an error",
        "Only true or false",
        "A mutable global variable",
        "Result makes failure a part of the type contract.",
        "Think two possible outcomes."
      ],
      [
        "Lifetimes and safety",
        "Borrowing and lifetime rules prevent dangling references in safe code. Tests still need semantic correctness.",
        "Reject returning a reference to a local String.",
        "What can Rust's borrow checker help prevent?",
        "Dangling references in safe code",
        "All business logic bugs",
        "All performance regressions",
        "Ownership checks address a class of memory errors, not every bug.",
        "Memory safety is not complete correctness."
      ]
    ]
  ],
  [
    "go",
    "Go",
    "Web & Software",
    "🐹",
    "Build simple services with concurrency and explicit errors.",
    "Implement a concurrent request collector with cancellation and tests.",
    "golang",
    [
      [
        "Packages and functions",
        "Go organizes programs into packages and uses multiple return values for explicit error handling.",
        "func divide(a,b float64)(float64,error) returns a value and error.",
        "Why might a Go function return two values?",
        "A result and an error",
        "Two CPUs",
        "A CSS class and font",
        "Explicit error values are conventional in Go.",
        "Think value plus possible failure."
      ],
      [
        "Goroutines",
        "A goroutine schedules a lightweight concurrent function; concurrency still needs coordination.",
        "Launch workers and collect results using a channel.",
        "What is a channel useful for?",
        "Passing values between concurrent goroutines",
        "Defining HTML layout",
        "Encrypting a JWT by itself",
        "Channels coordinate communication across goroutines.",
        "Think communicating workers."
      ],
      [
        "Context and races",
        "Use context cancellation, synchronization and the race detector for shared state.",
        "Cancel a slow request via ctx.Done() and test goroutine cleanup.",
        "What helps detect unsafe concurrent memory access?",
        "Go's race detector",
        "Only a code formatter",
        "An HTTP redirect",
        "A race detector reveals unsynchronized accesses.",
        "Look for shared mutable state."
      ]
    ]
  ]
];
export const webAndProgrammingTracks=composeAcademyTracks(items);
