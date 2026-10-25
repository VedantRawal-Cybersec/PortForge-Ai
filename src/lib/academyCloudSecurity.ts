import {composeAcademyTracks,type TrackSpec} from "./academyFactory";
const items:TrackSpec[]=[
  [
    "cloud",
    "Cloud Fundamentals",
    "Cloud & DevOps",
    "☁️",
    "Understand cloud services, shared responsibility and reliable deployment.",
    "Diagram an entry-level web service and its monitoring.",
    "aws",
    [
      [
        "Cloud service models",
        "IaaS rents compute primitives, PaaS manages more runtime infrastructure and SaaS delivers finished applications.",
        "A hosted database is a managed platform service with customer data responsibilities.",
        "Which model gives most control over virtual servers?",
        "IaaS",
        "SaaS",
        "A spreadsheet",
        "IaaS exposes infrastructure building blocks.",
        "Who operates the server?"
      ],
      [
        "Shared responsibility",
        "Providers secure underlying systems while customers still configure identities, data access and workloads.",
        "Restrict public storage and assign least-privilege roles.",
        "Who typically manages your application's access permissions?",
        "The customer deploying it",
        "Every unrelated visitor",
        "Nobody",
        "Cloud adoption does not eliminate access-control duties.",
        "Consider who configures users."
      ],
      [
        "Resilience and cost",
        "Monitor spend, set budgets, test backups and design recovery for likely failures.",
        "Verify a backup restore and alert when daily costs exceed a threshold.",
        "What is a meaningful recovery check?",
        "Successfully restoring from a backup",
        "Having an icon labeled backup",
        "Ignoring storage failures",
        "Backups are useful only when recovery succeeds.",
        "Test the restore path."
      ]
    ]
  ],
  [
    "aws",
    "Amazon Web Services (AWS)",
    "Cloud & DevOps",
    "🟠",
    "Learn core AWS networking, compute, security and observability.",
    "Design a simple secure AWS service using public reference architecture.",
    "aws",
    [
      [
        "Compute choices",
        "EC2 offers virtual servers; Lambda runs event-driven functions with managed infrastructure.",
        "Use Lambda for a short triggered image-processing task with bounded runtime.",
        "Which service represents virtual machine compute?",
        "Amazon EC2",
        "Amazon Route 53 only",
        "Amazon S3 only",
        "EC2 provides configurable virtual server instances.",
        "Think machines versus object storage."
      ],
      [
        "IAM policies",
        "IAM permissions define actions on resources; broad wildcards increase exposure.",
        "Grant a function only read access to its needed object prefix.",
        "What aligns with least privilege?",
        "Narrow actions and resource ARNs",
        "Admin access for every role",
        "Public access keys",
        "Narrow resource policies reduce blast radius.",
        "Grant only what the workload needs."
      ],
      [
        "Monitoring",
        "CloudWatch and service logs help detect failure and measure latency; data sensitivity affects logging decisions.",
        "Alert on failed requests while omitting tokens and private content.",
        "What should production monitoring avoid?",
        "Sensitive tokens in unrestricted logs",
        "Error counts",
        "Response latency trends",
        "Monitoring should not leak secrets.",
        "Which fields are private?"
      ]
    ]
  ],
  [
    "azure",
    "Microsoft Azure",
    "Cloud & DevOps",
    "🔹",
    "Explore Azure identities, resource groups and reliable applications.",
    "Design a small service topology with roles and backup decisions.",
    "",
    [
      [
        "Resource organization",
        "Subscriptions and resource groups organize Azure resources for management and access controls.",
        "Group an app, its database and diagnostics resources logically.",
        "What groups related Azure resources?",
        "Resource group",
        "Browser localStorage",
        "HTML section",
        "Resource groups help manage lifecycle and policies.",
        "Think deployment organization."
      ],
      [
        "Identity and RBAC",
        "Microsoft Entra ID handles identities; Azure RBAC grants specific resource actions.",
        "Give a reader role access to diagnostics rather than subscription owner.",
        "What limits what a user can change?",
        "Role-based access control",
        "A dark-mode toggle",
        "A resource name alone",
        "RBAC controls allowed actions at chosen scopes.",
        "Which permissions are granted?"
      ],
      [
        "Cost and reliability",
        "Budgets, alerts and backup testing help protect workloads from surprise bills and outages.",
        "Test restoring a database backup to an isolated resource.",
        "What proves a backup plan works?",
        "A successful test restore",
        "A storage account name",
        "A billing screenshot",
        "Recovery needs operational verification.",
        "Try the restore process."
      ]
    ]
  ],
  [
    "devops",
    "DevOps Foundations",
    "Cloud & DevOps",
    "🔁",
    "Automate building, testing, releasing and observing software.",
    "Build a tested CI pipeline with release rollback documentation.",
    "devops",
    [
      [
        "CI pipelines",
        "Continuous integration validates changes through repeatable builds and tests before sharing them.",
        "Run typecheck, unit tests and production build for each pull request.",
        "What is an appropriate CI gate?",
        "Automated tests and reproducible build",
        "Merge on every failing test",
        "Manual screenshots only",
        "CI reduces risk by checking each proposed change.",
        "What can run on every commit?"
      ],
      [
        "Deployment stages",
        "Separate development, staging and production. Promote artifacts only after acceptance tests.",
        "Exercise the same build in staging before production.",
        "Why use staging?",
        "Test integrated behavior without endangering customers",
        "Replace backups",
        "Avoid all monitoring",
        "Preproduction validation catches integration failures.",
        "Which environment has real users?"
      ],
      [
        "Rollback and incidents",
        "Plan release rollback, monitor key error rates and record incident response owners.",
        "Revert deployment when crash-free sessions drop sharply.",
        "What should accompany a risky rollout?",
        "Monitoring and a tested rollback plan",
        "Only animations",
        "Deleting logs",
        "Controlled recovery limits customer impact.",
        "Think if the change fails."
      ]
    ]
  ],
  [
    "docker",
    "Docker & Containers",
    "Cloud & DevOps",
    "📦",
    "Package applications with images and isolated processes.",
    "Containerize a sample web app without privileged host mounts.",
    "docker",
    [
      [
        "Images and containers",
        "An image is an immutable package template; a container is a running instance.",
        "Build an image with a Dockerfile then start a container from it.",
        "What is an image?",
        "A packaged template used to start containers",
        "A running operating system kernel by itself",
        "A CSS file",
        "Images define container filesystem and configuration.",
        "Distinguish blueprint from running process."
      ],
      [
        "Layering and builds",
        "Order Dockerfile steps to leverage build caching and keep runtime images small.",
        "Copy package manifest before application source when installing dependencies.",
        "What can improve repeat build efficiency?",
        "Reusing unchanged image layers",
        "Always rebuilding everything",
        "Shipping secrets in image layers",
        "Layer caching reduces repeated work.",
        "What changes most frequently?"
      ],
      [
        "Container boundaries",
        "Containers are not automatically safe sandboxes for hostile code; restrict capabilities, resources and networking.",
        "Run an app as a non-root user with memory limits and no mounted host secrets.",
        "Which is a secure container practice?",
        "Least privilege and resource limits",
        "Privileged execution always",
        "Mounting all host directories",
        "Container configurations determine isolation strength.",
        "Think resources and access."
      ]
    ]
  ],
  [
    "kubernetes",
    "Kubernetes",
    "Cloud & DevOps",
    "☸️",
    "Understand container orchestration and safe workloads.",
    "Describe a Deployment and Service with probes and resource limits.",
    "kubernetes",
    [
      [
        "Pods and deployments",
        "Pods are scheduling units; Deployments manage replicated application Pods and rollout state.",
        "A Deployment manages three replicas of a web application.",
        "What manages desired replicated Pods?",
        "Deployment",
        "ConfigMap alone",
        "A CSS file",
        "Deployments reconcile desired replica state.",
        "Who maintains replicas?"
      ],
      [
        "Services and networking",
        "Services provide stable discovery and routing to selected Pods; ingress exposes controlled entry points.",
        "A ClusterIP Service routes in-cluster traffic to a Deployment.",
        "What gives an app a stable in-cluster endpoint?",
        "Service",
        "An image layer",
        "An environment comment",
        "Service abstraction hides changing Pod IPs.",
        "Pods are ephemeral."
      ],
      [
        "Health and isolation",
        "Configure readiness, liveness, resource requests and RBAC deliberately.",
        "A Pod becomes ready only when its dependencies work.",
        "Why define readiness probes?",
        "Avoid sending traffic to unready Pods",
        "Change image size",
        "Replace authentication",
        "Readiness gates prevent routing to unavailable instances.",
        "Is the app ready for requests?"
      ]
    ]
  ],
  [
    "linux",
    "Linux Administration",
    "Cloud & DevOps",
    "🐧",
    "Learn files, processes, permissions and system investigation.",
    "Write a safe incident checklist using logs, file permissions and process metrics.",
    "linux",
    [
      [
        "Filesystem and shell",
        "Paths, permissions and commands form daily Linux workflows. Confirm effects before running destructive commands.",
        "pwd, ls -la and cat inspect directory contents.",
        "Which command shows the current working directory?",
        "pwd",
        "rm -rf",
        "chmod 777",
        "pwd prints the current directory path.",
        "Think position in filesystem."
      ],
      [
        "Processes and services",
        "Processes have IDs and resource usage. systemd manages many long-running services on common Linux distributions.",
        "Use ps or systemctl status to inspect a service failure.",
        "What helps inspect service state?",
        "systemctl status on supported systems",
        "Editing CSS",
        "Changing a username only",
        "Service status helps identify failures.",
        "Look for diagnostics, not guessing."
      ],
      [
        "Permissions and logs",
        "Unix permission modes control file access; system logs support troubleshooting.",
        "Use least-privilege permissions and inspect journalctl for service errors.",
        "What is safer for sensitive app configuration?",
        "Restrict file reading to appropriate identities",
        "chmod 777 on all files",
        "Copy secrets into public folders",
        "Broad permissions expose sensitive data.",
        "Who needs access?"
      ]
    ]
  ],
  [
    "terraform",
    "Terraform & Infrastructure as Code",
    "Cloud & DevOps",
    "🏗️",
    "Define auditable infrastructure with declarative configuration.",
    "Create a small reviewed IaC plan with no exposed secrets.",
    "terraform",
    [
      [
        "Declarative configuration",
        "Infrastructure as code defines desired resource state in version-controlled files.",
        "Describe a network and instance in configuration and review changes.",
        "What is an IaC advantage?",
        "Reviewable reproducible infrastructure changes",
        "Automatic zero-cost cloud",
        "No need for permissions",
        "Versioned configuration supports review and reconstruction.",
        "Can the environment be recreated?"
      ],
      [
        "Plans and state",
        "Plan previews intended changes; state tracks known infrastructure resources and requires protection.",
        "Review terraform plan before apply, protecting remote state access.",
        "Why secure Terraform state?",
        "It can include sensitive attributes and resource identifiers",
        "It is always public documentation",
        "It contains only CSS",
        "State access may reveal infrastructure secrets.",
        "Who can read the state?"
      ],
      [
        "Safe change process",
        "Pin providers, review drift and separate environments. Avoid unreviewed destructive applies.",
        "Reject a plan that deletes a production database unexpectedly.",
        "What should precede production apply?",
        "Review planned changes and backups",
        "Only change icon colors",
        "Disable all approvals",
        "Infra changes can have high impact.",
        "Inspect the diff."
      ]
    ]
  ],
  [
    "sre",
    "Site Reliability Engineering",
    "Cloud & DevOps",
    "📟",
    "Manage reliability with measurement, alerts and incident learning.",
    "Define two service-level indicators and a safe incident runbook.",
    "software-architect",
    [
      [
        "SLIs and SLOs",
        "A service-level indicator measures behavior; an objective sets a desired target over a time window.",
        "Availability SLI is successful requests divided by eligible requests.",
        "What is an SLI?",
        "A measurement of service behavior",
        "A team logo",
        "A raw deployment name",
        "SLIs quantify observed service quality.",
        "What can you measure?"
      ],
      [
        "Alert design",
        "Alerts should reflect actionable user harm rather than every normal fluctuation.",
        "Page on sustained elevated error-budget burn, not one isolated 404.",
        "What makes an alert actionable?",
        "Clear user impact and response guidance",
        "Maximum alert volume",
        "No response owner",
        "Alert fatigue hides important incidents.",
        "Would someone know what to do?"
      ],
      [
        "Incident review",
        "Blameless investigation records timeline, contributing factors and prevention actions.",
        "Document why a new release caused errors and add a targeted regression test.",
        "What is the main post-incident goal?",
        "Learn and prevent recurrence",
        "Hide all failures",
        "Assign blame without evidence",
        "Reviews improve the system and process.",
        "What should change afterward?"
      ]
    ]
  ],
  [
    "postgresql",
    "PostgreSQL",
    "Cloud & DevOps",
    "🐘",
    "Learn relational modeling, SQL and practical administration.",
    "Create a small schema with constraints, index analysis and isolation tests.",
    "postgresql-dba",
    [
      [
        "Tables and constraints",
        "PostgreSQL constraints enforce data invariants. Foreign keys reference related rows; check constraints limit values.",
        "Require quantity >= 0 and a valid product_id in an order.",
        "What helps reject negative quantities at the database boundary?",
        "CHECK constraint",
        "A page title",
        "A color theme",
        "Database constraints protect integrity across clients.",
        "Enforce it even if the UI fails."
      ],
      [
        "Indexes and plans",
        "Indexes accelerate certain queries with write and storage trade-offs; inspect EXPLAIN rather than guessing.",
        "Compare plans before and after adding an index on a common filter.",
        "What should guide index creation?",
        "Real query plans and workload",
        "Indexing every column",
        "UI font changes",
        "Measured workloads reveal which indexes help.",
        "Check scans and selectivity."
      ],
      [
        "Row-level security",
        "RLS restricts rows according to identities and policies; test select, update and delete boundaries.",
        "Use synthetic accounts A and B to confirm isolation.",
        "What validates RLS for a multi-user table?",
        "Cross-account negative read and write tests",
        "Login alone",
        "Hidden frontend buttons",
        "RLS must enforce user ownership even when requests bypass the UI.",
        "Try another account's record."
      ]
    ]
  ],
  [
    "mongodb",
    "MongoDB",
    "Cloud & DevOps",
    "🍃",
    "Model and query document-oriented application data.",
    "Model a small catalog with indexes and schema checks.",
    "mongodb",
    [
      [
        "Documents",
        "MongoDB groups fields into BSON documents; embedding choices depend on query patterns and update needs.",
        "Store a product document with title, price and nested tags.",
        "What is a MongoDB document?",
        "A structured set of fields and values",
        "A SQL JOIN automatically",
        "A CSS sheet",
        "BSON documents represent application records.",
        "Think key-value fields."
      ],
      [
        "Index trade-offs",
        "Indexes improve selective retrieval but add write/storage cost and need measurement.",
        "Index product category for frequent filtered listing queries.",
        "Why not index every possible field?",
        "Indexes have storage and write overhead",
        "Indexes disable all queries",
        "Indexes only affect color",
        "Choose indexes from workload patterns.",
        "Measure cost and benefit."
      ],
      [
        "Validation and access",
        "Schema validation and least-privilege database roles reduce invalid writes and exposure.",
        "Reject documents missing required product price and restrict role access.",
        "What belongs in production database security?",
        "Role permissions and input/schema validation",
        "Public admin credentials",
        "Only frontend checks",
        "The database enforces important boundaries.",
        "Who can write which collections?"
      ]
    ]
  ],
  [
    "network",
    "Network Engineering",
    "Cloud & DevOps",
    "🌐",
    "Understand packets, routing, DNS, firewalls and diagnostics.",
    "Trace a simulated connection and document each layer and failure point.",
    "network-engineer",
    [
      [
        "IP and routing",
        "IP addresses identify endpoints on networks; routers forward packets according to routes.",
        "Trace a packet from a client subnet through a gateway.",
        "What forwards traffic between IP networks?",
        "Router",
        "A text editor",
        "A CSS selector",
        "Routers choose paths using routing tables.",
        "Think layer 3 forwarding."
      ],
      [
        "DNS",
        "DNS maps domain names to records such as IP addresses. DNS answers do not establish website trust.",
        "Look up the A record for a public test hostname.",
        "What is a DNS A record used for?",
        "Mapping a host to an IPv4 address",
        "Encrypting HTTP traffic",
        "Generating HTML",
        "An A record associates a name with an IPv4 address.",
        "Think domain-to-address lookup."
      ],
      [
        "Troubleshooting",
        "Test DNS, reachability, TCP handshake and application behavior separately. A timeout doesn't prove one specific cause.",
        "Record whether name resolution, TCP 443 or HTTP response failed.",
        "What helps diagnose a failed connection?",
        "Layered reproducible checks",
        "Guessing that the firewall is always at fault",
        "Changing page fonts",
        "Separate layers narrow down the failure cause.",
        "Check each step."
      ]
    ]
  ],
  [
    "cybersecurity",
    "Cybersecurity Foundations",
    "Security",
    "🛡️",
    "Learn defensive security principles and practical safe labs.",
    "Write a scoped security checklist and analyze permitted synthetic logs.",
    "cyber-security",
    [
      [
        "CIA principles",
        "Confidentiality prevents unauthorized disclosure; integrity protects accuracy; availability means services remain usable.",
        "A backup helps availability while authorization protects confidentiality.",
        "What is confidentiality about?",
        "Preventing unauthorized disclosure",
        "Ensuring the UI uses blue",
        "Maximizing request time",
        "CIA covers distinct security goals.",
        "Who should see the information?"
      ],
      [
        "Authentication versus authorization",
        "Authentication establishes identity; authorization establishes permissions for each action and object.",
        "Logged-in user A still cannot access user B's private incident report.",
        "What stops cross-user record reading?",
        "Per-object authorization",
        "A long random filename alone",
        "A visible login form alone",
        "Identity does not imply access to every resource.",
        "Does this identity own the record?"
      ],
      [
        "Evidence-based reporting",
        "Security findings require reproducible evidence, scoped testing and impact analysis without overstating risks.",
        "Write an incident observation with timestamps, supporting data and uncertainty.",
        "What strengthens a security report?",
        "Reproducible facts and clear scope",
        "Unsupported dramatic severity labels",
        "Publicly sharing secrets",
        "Defensible reporting distinguishes observations and hypotheses.",
        "What can be independently confirmed?"
      ]
    ]
  ],
  [
    "soc",
    "SOC / Security Analyst",
    "Security",
    "🔎",
    "Investigate defensive alerts in controlled realistic scenarios.",
    "Triage synthetic alerts and produce an incident report.",
    "cyber-security",
    [
      [
        "Telemetry sources",
        "Logs, flows and authentication events provide different evidence; each may be incomplete.",
        "Correlate VPN login, endpoint event and firewall flow for the same time.",
        "What helps contextualize a suspicious sign-in?",
        "Correlating independent logs and timestamps",
        "One IP address alone",
        "A colorful chart",
        "Cross-source evidence reduces false conclusions.",
        "What else happened around that time?"
      ],
      [
        "Triage sequence",
        "Validate asset, severity, baseline and confidence before making containment recommendations.",
        "Check whether a spike in failed logins matches a scheduled authentication test.",
        "What is the first useful triage activity?",
        "Validate alert context and evidence",
        "Delete logs immediately",
        "Declare every alert a breach",
        "Triage separates suspicious events from proven compromise.",
        "Investigate before concluding."
      ],
      [
        "Incident documentation",
        "Record evidence, scope, actions, limitations and next checks. Preserve sensitive data appropriately.",
        "Write an incident timeline from synthetic alerts with clear confidence notes.",
        "What belongs in an incident timeline?",
        "Dated observations and documented decisions",
        "Unverifiable guesses only",
        "Credentials in public notes",
        "Chronological records support response and review.",
        "Use timestamps and sources."
      ]
    ]
  ],
  [
    "appsec",
    "Application Security",
    "Security",
    "🔐",
    "Prevent application flaws through design, review and defensive tests.",
    "Review a deliberately vulnerable local app and verify secure fixes.",
    "api-security",
    [
      [
        "Input boundaries",
        "Untrusted requests must be validated and encoded appropriately; output encoding depends on context.",
        "Render user comments as escaped text rather than injected HTML.",
        "What helps prevent stored XSS when displaying user input?",
        "Context-appropriate output encoding",
        "Only changing fonts",
        "Disabling server logs",
        "Escaping and safe rendering defend output contexts.",
        "Where does untrusted text appear?"
      ],
      [
        "Authorization tests",
        "Missing ownership checks cause IDOR and cross-tenant leaks even with correct login.",
        "Test account A cannot edit account B's entry through a direct API request.",
        "Which safeguard prevents insecure direct object references?",
        "Server-side resource authorization",
        "Obscure URL paths only",
        "Disabled right click",
        "Object permission must be verified on each request.",
        "Try a cross-account request."
      ],
      [
        "Dependency hygiene",
        "Third-party packages need update policies, license review and threat modeling. Package popularity isn't proof of safety.",
        "Review alerts, pinned versions and runtime permissions before an update.",
        "What is a supply-chain defense?",
        "Review dependencies and restrict their privileges",
        "Trust any new package blindly",
        "Copy secrets into build logs",
        "Dependency risk continues after install.",
        "Who can run code in your build?"
      ]
    ]
  ],
  [
    "devsecops",
    "DevSecOps",
    "Security",
    "🧯",
    "Integrate threat modeling, policy and safe checks into delivery.",
    "Create a CI security gate with scoped dependency and permission checks.",
    "devsecops",
    [
      [
        "Security in CI",
        "Automate useful static checks, dependency audits and secret detection with triage, rather than blocking blindly.",
        "Reject a commit with a committed credential and document secure replacement.",
        "Which belongs in a delivery security gate?",
        "Secret scanning with verified remediation",
        "Ignoring leaked keys",
        "Purely decorative badges",
        "Early detection prevents publishing avoidable security issues.",
        "Check before merge."
      ],
      [
        "Policy as code",
        "Represent security expectations in testable configurations and reviewed deployment rules.",
        "Reject an infrastructure plan that exposes a private database publicly.",
        "What can policy as code enforce?",
        "Machine-checkable infrastructure constraints",
        "Product taglines",
        "Interview scores",
        "Codified rules reduce inconsistent reviews.",
        "Is a required property verifiable?"
      ],
      [
        "Threat-based gates",
        "Not every scan warning is exploitable; weigh asset exposure, real impact and confidence.",
        "Investigate a reachable authorization flaw ahead of a harmless test dependency flag.",
        "How should findings be prioritized?",
        "Evidence-based risk and exposure",
        "Only count of alerts",
        "Alphabetical order",
        "Severity needs environment-specific context.",
        "Consider impact and reachability."
      ]
    ]
  ],
  [
    "cloud-security",
    "Cloud Security",
    "Security",
    "☁️",
    "Protect cloud identities, storage and service boundaries.",
    "Model a cloud storage exposure and validate least-privilege rules.",
    "aws",
    [
      [
        "Identity boundaries",
        "Cloud roles and temporary credentials reduce reliance on broadly scoped static keys.",
        "Give a workload read access only to one required resource prefix.",
        "What helps limit cloud permission abuse?",
        "Least-privilege roles and short-lived credentials",
        "Public administrator keys",
        "Global wildcard policies",
        "Narrow privileges reduce blast radius.",
        "Which actions and resources are needed?"
      ],
      [
        "Storage exposures",
        "Cloud objects may be public by configuration; sensitive data requires deliberate access decisions.",
        "Check a private bucket remains inaccessible to anonymous principals.",
        "What is a useful cloud privacy test?",
        "Unauthorized requests are denied",
        "The bucket has a random name",
        "The UI has a lock icon",
        "Access policy must be tested, not assumed.",
        "Try unauthenticated access."
      ],
      [
        "Monitoring and recovery",
        "Audit changes, rotate compromised credentials and rehearse safe restoration.",
        "Alert on unexpected public ACL changes or privileged role grants.",
        "What signals privilege-risk changes?",
        "Unexpected policy and role modifications",
        "A new card color",
        "More storage icons",
        "Audit events reveal high-impact configuration changes.",
        "Who changed what and when?"
      ]
    ]
  ],
  [
    "incident-response",
    "Incident Response",
    "Security",
    "🚨",
    "Prepare investigation, containment, recovery and postmortem practice.",
    "Write a synthetic incident timeline with safe containment options.",
    "cyber-security",
    [
      [
        "Preparation",
        "Define scope, escalation contacts, logging, backups and decision ownership before an incident.",
        "Document where responders find logs and who can isolate a test machine.",
        "Why prepare runbooks before an incident?",
        "Reduce confusion during time-sensitive response",
        "Avoid keeping evidence",
        "Remove all approvals",
        "Preparation accelerates coordinated decisions.",
        "Who does what when a page arrives?"
      ],
      [
        "Evidence handling",
        "Preserve original evidence, timestamps and chain-of-custody where applicable.",
        "Store a copy of relevant synthetic logs and record time zones.",
        "What matters when preserving logs?",
        "Integrity, timestamps and access trace",
        "Changing timestamps to look tidy",
        "Publishing user secrets",
        "Evidence must remain interpretable and reliable.",
        "What would a later reviewer need?"
      ],
      [
        "Recovery and learning",
        "Validate services after containment, monitor recurrence and derive specific prevention actions.",
        "Restore a disposable affected service and verify user-facing behavior.",
        "What defines a successful recovery check?",
        "Verified behavior and monitored stability",
        "A green badge alone",
        "Deleting the incident record",
        "Recovery requires tested functionality.",
        "Does the service actually work?"
      ]
    ]
  ]
];
export const cloudSecurityTracks=composeAcademyTracks(items);
