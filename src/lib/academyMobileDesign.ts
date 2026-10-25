import {composeAcademyTracks,type TrackSpec} from "./academyFactory";
const items:TrackSpec[]=[
  [
    "android",
    "Android Development",
    "Mobile & Games",
    "🤖",
    "Build accessible Android apps with Kotlin fundamentals.",
    "Develop a simple task list app with lifecycle tests.",
    "android",
    [
      [
        "Activities and lifecycle",
        "Android components respond to lifecycle changes. Save essential state so rotation does not erase work.",
        "Store an in-progress form draft in a ViewModel or saved state.",
        "What must an app consider on rotation?",
        "Lifecycle and state restoration",
        "Only background color",
        "Only icon shape",
        "Configuration changes can recreate UI components.",
        "What happens to unsaved user input?"
      ],
      [
        "Kotlin app state",
        "Use observable state so Compose UI reflects data changes predictably.",
        "A mutableStateOf count updates visible Compose text.",
        "What connects state changes to Compose rendering?",
        "Observable state",
        "Only a global string",
        "Only XML comments",
        "Compose tracks state reads for recomposition.",
        "How does the UI know values changed?"
      ],
      [
        "Device testing",
        "Test small screens, permission denials, slow networks and accessibility settings.",
        "Check TalkBack labels and offline error behavior in an emulator.",
        "What is a meaningful mobile QA check?",
        "Permission denial and accessible navigation",
        "Only the flagship phone layout",
        "Only an app icon",
        "Real devices and constraints uncover interaction failures.",
        "Test an unfavorable condition."
      ]
    ]
  ],
  [
    "ios",
    "iOS Development",
    "Mobile & Games",
    "🍎",
    "Understand SwiftUI views, app state and privacy.",
    "Build a simple offline note app with state and VoiceOver checks.",
    "ios",
    [
      [
        "Swift basics",
        "Swift uses types, optionals and safe unwrapping for values that may be absent.",
        "if let name = optionalName safely handles a present String.",
        "What represents a possibly missing Swift value?",
        "Optional",
        "Mandatory force unwrap always",
        "A CSS selector",
        "Optionals make absence explicit in types.",
        "Think missing data."
      ],
      [
        "SwiftUI state",
        "SwiftUI re-renders views based on state; changes should flow through appropriate property wrappers.",
        "@State var count=0 and a button increments it.",
        "What does @State manage in a simple view?",
        "Local mutable view state",
        "An external server password",
        "A project build pipeline",
        "State changes trigger UI refresh.",
        "What changes on tap?"
      ],
      [
        "Privacy and testing",
        "Request only necessary permissions and explain their purpose; test VoiceOver and dynamic type.",
        "A notes app does not need location access unless a user requested location features.",
        "What is a safe mobile permission principle?",
        "Request only needed permissions",
        "Ask for all permissions at install",
        "Store all tokens in plain text",
        "Data minimization lowers user risk.",
        "Why does the feature need this permission?"
      ]
    ]
  ],
  [
    "flutter",
    "Flutter",
    "Mobile & Games",
    "🦋",
    "Build cross-platform interfaces using Dart widgets.",
    "Build a responsive habit tracker with tested state and screen-reader labels.",
    "flutter",
    [
      [
        "Widget tree",
        "Flutter UI is composed of nested widgets that describe layout and behavior.",
        "Scaffold contains an AppBar and body content.",
        "What is the basic Flutter UI composition unit?",
        "Widget",
        "SQL row",
        "Docker image",
        "Widgets build the interface hierarchy.",
        "Think declarative UI."
      ],
      [
        "State and rebuilding",
        "Use appropriate state tools to rebuild the right views when data changes.",
        "A StatefulWidget updates count with setState for a small local interaction.",
        "What signals a simple StatefulWidget to rebuild?",
        "setState",
        "CSS hover",
        "A SQL migration",
        "setState schedules rebuilding after state updates.",
        "Which call updates rendered state?"
      ],
      [
        "Adaptive and accessible",
        "Layouts should respond to text scale, screen width and focus/semantics needs.",
        "Test a scrolling form at large text scaling.",
        "What is essential for a responsive mobile form?",
        "Flexible layout and accessible labels",
        "Hardcoded dimensions only",
        "Disable text scaling",
        "Users have different viewport and accessibility settings.",
        "Test small devices and large fonts."
      ]
    ]
  ],
  [
    "react-native",
    "React Native",
    "Mobile & Games",
    "📱",
    "Build native-feeling cross-platform JavaScript apps.",
    "Create a small data-entry mobile app with resilient offline forms.",
    "react-native",
    [
      [
        "Native components",
        "React Native maps components such as View and Text to platform-native UI elements.",
        "Use <Text> inside <View> to render an accessible label.",
        "Which element displays text in React Native?",
        "Text",
        "div",
        "table",
        "Text is the platform-aware text component.",
        "Web tags do not always apply."
      ],
      [
        "Navigation and state",
        "Screen state and navigation should preserve drafts when moving between views.",
        "Move from an edit screen to settings and back without losing inputs.",
        "What improves form reliability across navigation?",
        "Explicit draft persistence",
        "Clear state on every screen change",
        "Disable Back",
        "Predictable navigation preserves user work.",
        "Think interrupted workflows."
      ],
      [
        "Mobile privacy",
        "Secure tokens with OS-appropriate protected storage and minimize permissions.",
        "Do not save an access token in public plaintext app files.",
        "Where should sensitive credentials live?",
        "Platform-protected credential storage",
        "Debug console logs",
        "A public screenshot",
        "Protected device storage limits casual exposure.",
        "Could someone inspect a public file?"
      ]
    ]
  ],
  [
    "game-dev",
    "Game Development",
    "Mobile & Games",
    "🎮",
    "Learn game loops, interaction, assets and performance.",
    "Build a small keyboard-controlled game with measured frame performance.",
    "game-developer",
    [
      [
        "Game loops",
        "Game simulations update over time; delta time helps movement remain consistent across frame rates.",
        "position += speed * deltaSeconds rather than moving a fixed amount every frame.",
        "Why multiply movement by delta time?",
        "Keep movement consistent across frame rates",
        "Always double speed",
        "Disable collisions",
        "Frame durations vary between devices.",
        "Compare 30 and 60 FPS."
      ],
      [
        "Collision and rules",
        "Collision checks identify overlaps, while gameplay logic decides what should happen on contact.",
        "A player touching a goal triggers a level-completion rule.",
        "What is collision detection used for?",
        "Detecting object overlap",
        "Designing font families",
        "Routing SQL transactions",
        "Overlap events support game interactions.",
        "When do two objects touch?"
      ],
      [
        "Performance and testing",
        "Profile frame time, avoid runaway objects and test input across devices.",
        "Record frame drops as enemy count increases.",
        "What is a meaningful game performance measure?",
        "Frame time distribution",
        "Only installed file name",
        "Number of marketing screenshots",
        "Frame timing reflects interactive smoothness.",
        "Test when scenes become busy."
      ]
    ]
  ],
  [
    "ux-design",
    "UX Research & Design",
    "Design & Product",
    "🧩",
    "Research user problems and validate usable solutions.",
    "Run a consent-based usability review and document observations.",
    "ux-design",
    [
      [
        "Research questions",
        "Start with what the user wants to accomplish, not a preselected interface.",
        "Ask participants to describe how they currently complete a task.",
        "What should a research session first clarify?",
        "User goals and context",
        "Only which color looks nicer",
        "Only a competitor logo",
        "Real needs guide meaningful design decisions.",
        "Which job is the user doing?"
      ],
      [
        "Flows and prototypes",
        "Sketch user paths and build lightweight prototypes before committing to costly implementation.",
        "Map onboarding: welcome, choose goal, start first task.",
        "Why test a simple prototype?",
        "Find usability issues before full build",
        "Prove every user will love it",
        "Replace security review",
        "Early feedback can prevent expensive rework.",
        "Try a flow before coding."
      ],
      [
        "Accessibility and findings",
        "Observe task success, confusion and assistive technology needs without blaming participants.",
        "Document when users cannot find Save and propose a clearer affordance.",
        "What is stronger usability evidence?",
        "Observed behavior with context",
        "Designer confidence alone",
        "A number without sample definition",
        "Observation supports defensible design changes.",
        "What actually happened in the test?"
      ]
    ]
  ],
  [
    "product-design",
    "Product Design",
    "Design & Product",
    "✏️",
    "Connect user needs, interaction and visual systems.",
    "Design and validate a beginner-friendly feature from research through prototype.",
    "product-design",
    [
      [
        "Problem definition",
        "A strong design brief identifies the audience, need, constraints and measurable outcome.",
        "Students cannot find their most recent saved learning activity.",
        "What belongs in a design problem statement?",
        "Observed user need and context",
        "Only a color palette",
        "Only future animations",
        "Problem framing guides solution choices.",
        "Who needs what and why?"
      ],
      [
        "Design systems",
        "Consistent components, typography and spacing reduce repeated decisions and usability inconsistencies.",
        "Use the same focus ring and button behavior across all tools.",
        "What is a design-system benefit?",
        "Consistent reusable interaction patterns",
        "A guarantee of sales",
        "Removal of accessibility needs",
        "Shared patterns improve predictability.",
        "Do common controls behave alike?"
      ],
      [
        "User validation",
        "Evaluate prototypes using representative tasks and test outcomes, not aesthetic opinion alone.",
        "Measure whether first-time users can save their progress unassisted.",
        "What proves a design flow is usable?",
        "Observed task completion and feedback",
        "Only dribbble likes",
        "Only a passing build",
        "User behavior reveals whether interactions work.",
        "Test a task, not a screenshot."
      ]
    ]
  ],
  [
    "product-manager",
    "Product Management",
    "Design & Product",
    "🗂️",
    "Prioritize customer problems, delivery and outcome metrics.",
    "Write a short product requirements document and test a release hypothesis.",
    "product-manager",
    [
      [
        "Customer problems",
        "Understand the target user and job before prioritizing features.",
        "Students want to share evidence of practical projects with recruiters.",
        "What helps establish a real product need?",
        "Researching user tasks and pain points",
        "Counting speculative features",
        "Only founder preference",
        "Actual user goals anchor valuable prioritization.",
        "Which problem is worth solving?"
      ],
      [
        "Prioritization",
        "Compare impact, reach, confidence, effort and risk; avoid false precision.",
        "Prioritize save-draft reliability over an animated hero for a failing onboarding flow.",
        "Which change often deserves priority?",
        "Fix a blocked core user action",
        "Add random decorative elements first",
        "Ignore customer failures",
        "Core workflow reliability creates more direct customer value.",
        "What prevents user success?"
      ],
      [
        "Success measurement",
        "Define activation and retention in terms of meaningful outcomes rather than page views alone.",
        "Track users who finish a real project with checked tests.",
        "What is an outcome-oriented metric?",
        "Verified project completion",
        "Raw page loads only",
        "Number of gradients",
        "Meaningful completed work reflects actual user benefit.",
        "What did the user achieve?"
      ]
    ]
  ],
  [
    "qa-engineering",
    "Software Quality Assurance",
    "Design & Product",
    "🧪",
    "Create repeatable checks and clear defect evidence.",
    "Write a test plan and bug reproduction suite for a sample app.",
    "qa",
    [
      [
        "Test design",
        "Separate expected behavior, normal cases, edge cases and known risks.",
        "For login test correct, invalid, empty and expired credentials.",
        "What belongs in test case design?",
        "Inputs, expected outcomes and edge conditions",
        "Only happy-path screenshot",
        "Only UI colors",
        "Tests need explicit expectations for useful results.",
        "What should happen on failure?"
      ],
      [
        "Bug reporting",
        "A useful defect report includes steps, observed versus expected behavior and environment.",
        "Record how a save action fails only after browser refresh.",
        "What makes a defect reproducible?",
        "Clear steps and actual/expected results",
        "A vague 'broken' label",
        "Only a severity guess",
        "Reproduction lets engineers investigate the same failure.",
        "Could someone repeat it?"
      ],
      [
        "Regression coverage",
        "Prioritize tests for critical flows and past bugs while avoiding flaky unmaintainable suites.",
        "Rerun export, authentication and editor save checks after changes.",
        "What is regression testing?",
        "Checking existing functionality after changes",
        "Only testing new button labels",
        "Deleting older tests",
        "Changes can break previously working flows.",
        "Retest important old behavior."
      ]
    ]
  ],
  [
    "automation-testing",
    "Test Automation",
    "Design & Product",
    "🦾",
    "Write stable automated browser and API tests.",
    "Implement an end-to-end test for save/reload with an error scenario.",
    "qa",
    [
      [
        "Stable selectors",
        "Prefer accessible roles, labels and stable identifiers over brittle DOM positions.",
        "Locate the Save button by accessible role and name.",
        "Which selector is often resilient for browser tests?",
        "Accessible role and meaningful name",
        "Nth child of a deeply nested div only",
        "A random CSS hash",
        "Semantic selectors express user-facing controls.",
        "What would a screen reader announce?"
      ],
      [
        "Assertions and fixtures",
        "Each test needs controlled setup and observable outcomes, not arbitrary sleeps.",
        "Create a test task then assert it survives reload.",
        "What is an actionable assertion?",
        "Checking an expected saved record after reload",
        "Sleeping ten seconds only",
        "Printing a debug string only",
        "Assertions establish actual pass or failure.",
        "What result proves success?"
      ],
      [
        "Isolation and reliability",
        "Test runs should avoid shared mutable data and use deterministic fixtures.",
        "Give each test an isolated account and clear any test data afterwards.",
        "What reduces flaky tests?",
        "Deterministic setup and isolated state",
        "Random retries with no diagnosis",
        "Tests depending on previous test order",
        "Isolation keeps tests independent and repeatable.",
        "Could this pass in any order?"
      ]
    ]
  ],
  [
    "technical-writing",
    "Technical Writing",
    "Design & Product",
    "📝",
    "Write documentation people can actually follow.",
    "Produce a beginner quick-start guide tested with a first-time user.",
    "technical-writer",
    [
      [
        "Audience analysis",
        "Documentation needs the reader's starting knowledge, goals and environment assumptions.",
        "A beginner install guide defines CLI and explains required permissions.",
        "What makes a tutorial approachable?",
        "Clear prerequisites and defined terms",
        "Unexplained expert jargon",
        "Only promotional text",
        "Readers need to understand required steps and concepts.",
        "Who will use this guide?"
      ],
      [
        "Task-based instructions",
        "Organize steps around a result and include commands, expected output and recovery.",
        "After npm install, explain how to start a local server and recognize success.",
        "What should follow a tutorial command?",
        "Expected result and troubleshooting guidance",
        "Nothing even if it fails",
        "Only emojis",
        "Visible outcomes help the learner know if a step worked.",
        "How will they check success?"
      ],
      [
        "Review and maintenance",
        "Verify docs against the current product, accessibility needs and changed APIs.",
        "Test each installation command against a supported environment.",
        "What keeps documentation trustworthy?",
        "Regularly checking steps against live behavior",
        "Assuming commands never change",
        "Hiding revision dates",
        "Working instructions require ongoing validation.",
        "Do the steps still run?"
      ]
    ]
  ],
  [
    "digital-marketing",
    "Digital Marketing",
    "Design & Product",
    "📣",
    "Plan measured, accessible and ethical marketing campaigns.",
    "Draft a small campaign plan with a real measurement definition.",
    "",
    [
      [
        "Audience and positioning",
        "Good messaging explains a real benefit to a defined audience. Segments are hypotheses until validated.",
        "Write one statement for students searching for beginner projects.",
        "What should a positioning statement address?",
        "Audience, problem and credible benefit",
        "Only buzzwords",
        "Only the founder's biography",
        "Clear audience context makes claims relevant.",
        "Who is the message for?"
      ],
      [
        "Experiments",
        "Set a specific hypothesis and meaningful metric before running a campaign.",
        "Compare two signup messages with fixed traffic eligibility.",
        "What makes an experiment interpretable?",
        "A prespecified metric and controlled comparison",
        "Changing all variables at once",
        "No baseline",
        "A controlled test supports better causal reasoning.",
        "What would prove improvement?"
      ],
      [
        "Responsible measurement",
        "Respect consent, avoid overclaiming attribution and use aggregate outcome metrics.",
        "Report tracked signups from permitted analytics without storing unnecessary identifiers.",
        "What is responsible campaign tracking?",
        "Minimal data and transparent consent",
        "Collect every browsing secret",
        "Invent conversion rates",
        "Data collection should match purpose and privacy commitments.",
        "Only collect what's needed."
      ]
    ]
  ],
  [
    "seo",
    "Search Engine Optimization",
    "Design & Product",
    "🔍",
    "Improve accessible, discoverable content with measurement.",
    "Audit a small website's structure, metadata and indexability.",
    "seo",
    [
      [
        "Search intent",
        "A useful page answers a real searcher's question with clear, accurate original content.",
        "A tutorial page defines the concept before presenting code examples.",
        "What tends to improve search usefulness?",
        "Accurate helpful content matching intent",
        "Repeating keywords randomly",
        "Hiding answers in images",
        "Search engines and humans need useful relevant content.",
        "Does the page answer the question?"
      ],
      [
        "Technical SEO",
        "Semantic headings, crawlable links, canonical tags and sensible robots rules support discovery.",
        "Provide one descriptive title and avoid blocking the intended public page.",
        "Which helps crawler understanding?",
        "Descriptive titles and crawlable structure",
        "Only animations",
        "Broken links",
        "Structural metadata helps discovery and navigation.",
        "Can a crawler follow the page?"
      ],
      [
        "Performance and trust",
        "Measure Core Web Vitals, verify claims and keep relevant content fresh.",
        "Compare LCP before and after optimizing a heavy hero image.",
        "What is a meaningful SEO performance improvement?",
        "Measured user experience gains",
        "Only changing accent color",
        "Claiming instant rank one",
        "Performance targets need real metrics.",
        "What did you measure?"
      ]
    ]
  ],
  [
    "blockchain",
    "Blockchain Fundamentals",
    "Emerging Tech",
    "⛓️",
    "Understand distributed ledgers, signatures and application limits.",
    "Model a simple ledger with hashing and explicit threat assumptions.",
    "blockchain",
    [
      [
        "Hash-linked records",
        "A hash-linked ledger references earlier blocks, helping detect unauthorized history changes under stated consensus assumptions.",
        "Each block stores the previous block's hash.",
        "What links records in a typical blockchain?",
        "References to earlier hashes",
        "A CSS property",
        "A random font name",
        "Hash references connect ledger history.",
        "What changes when old data changes?"
      ],
      [
        "Wallets and keys",
        "Digital signatures authenticate transactions; private keys must remain secret and protected.",
        "Sign a disposable example message with a test key, never a real wallet secret.",
        "What should be kept secret?",
        "Private signing keys",
        "Public address",
        "A block explorer URL",
        "Private keys authorize signing and must be protected.",
        "Which key gives spending authority?"
      ],
      [
        "Consensus and limits",
        "Different consensus methods trade energy, speed, decentralization and failure models.",
        "Explain why adding a blockchain is unnecessary for one organization's private todo list.",
        "When is a blockchain not inherently useful?",
        "When a trusted database already meets the need",
        "Every financial transaction always",
        "All datasets require consensus",
        "Choose architecture according to trust and governance needs.",
        "Which parties need shared trust?"
      ]
    ]
  ],
  [
    "embedded-iot",
    "Embedded Systems & IoT",
    "Emerging Tech",
    "🔧",
    "Program devices while reasoning about power, interfaces and safety.",
    "Simulate a sensor reader with timeouts and validated telemetry.",
    "",
    [
      [
        "Microcontrollers",
        "Microcontrollers run constrained programs interfacing with sensors and actuators; memory and timing matter.",
        "Read a temperature sensor periodically into a bounded buffer.",
        "What is a microcontroller commonly used for?",
        "Control and sensing on a constrained device",
        "Rendering huge cloud databases",
        "SEO indexing",
        "Embedded devices interact with physical hardware.",
        "Think sensors and actuators."
      ],
      [
        "Communication protocols",
        "I2C, SPI and UART connect components with different wiring and timing assumptions.",
        "Use I2C to connect a supported digital sensor on a test board.",
        "Which protocol often links multiple addressed low-speed sensors?",
        "I2C",
        "HTTP cookies",
        "SQL ORDER BY",
        "I2C supports addressed peripherals on a shared bus.",
        "Think hardware buses."
      ],
      [
        "Reliability and safety",
        "Watchdog timers, timeouts and input validation matter when devices interact with real environments.",
        "Recover from a sensor read timeout without leaving a motor running uncontrolled.",
        "What belongs in a safety-critical control loop?",
        "A defined fail-safe behavior",
        "Infinite unbounded blocking",
        "Ignoring hardware faults",
        "Physical outputs require safe failure states.",
        "What happens if a sensor stops responding?"
      ]
    ]
  ],
  [
    "accessibility",
    "Digital Accessibility",
    "Design & Product",
    "♿",
    "Create interfaces usable with keyboards, assistive technology and adaptable text.",
    "Audit and repair a form using screen-reader and keyboard workflows.",
    "",
    [
      [
        "Semantics and names",
        "Native controls convey role and state; every input needs an accessible name.",
        "Associate <label for='email'> with <input id='email'>.",
        "How can an input get a reliable accessible name?",
        "An associated label",
        "Placeholder text alone",
        "A border radius",
        "Labels remain meaningful after entry.",
        "Can assistive tech identify the field?"
      ],
      [
        "Keyboard focus",
        "Users need logical focus order, visible focus indication and no keyboard traps.",
        "Tab through a modal, close with Escape and restore focus.",
        "What should happen after closing a modal?",
        "Focus returns predictably to the invoking control",
        "Keyboard focus disappears",
        "Tab navigation stops forever",
        "Focus restoration supports orientation and continuity.",
        "Where was the user before opening it?"
      ],
      [
        "Testing and WCAG",
        "Automated audits catch some issues; manual keyboard and assistive-technology testing remains necessary.",
        "Test 200% zoom and large text on a narrow viewport.",
        "Can an automated scanner prove full accessibility?",
        "No, manual user-centered tests are also needed",
        "Yes, it catches every issue",
        "Only if page is fast",
        "Automation does not cover every interaction and context.",
        "Test actual use, not only static markup."
      ]
    ]
  ]
];
export const mobileDesignTracks=composeAcademyTracks(items);
