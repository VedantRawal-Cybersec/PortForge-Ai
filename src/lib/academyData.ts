import {composeAcademyTracks,type TrackSpec} from "./academyFactory";
const items:TrackSpec[]=[
  [
    "sql",
    "SQL & Relational Databases",
    "Data & Artificial Intelligence",
    "🗃️",
    "Query, join and protect structured data.",
    "Create a validated report from a disposable relational dataset.",
    "sql",
    [
      [
        "Selecting and filtering",
        "SELECT retrieves columns while WHERE limits rows. Queries must make assumptions about NULL values explicit.",
        "SELECT name FROM students WHERE active = true;",
        "What clause narrows SELECT results?",
        "WHERE",
        "DROP",
        "CREATE",
        "WHERE evaluates predicates to filter rows.",
        "Which clause applies a condition?"
      ],
      [
        "Joins and grouping",
        "JOIN combines related tables. Group aggregates carefully and inspect one-to-many cardinality before summing.",
        "SELECT customer_id,COUNT(*) FROM orders GROUP BY customer_id;",
        "What produces a count for each customer?",
        "GROUP BY customer_id",
        "ORDER BY customer_id only",
        "LIMIT 1",
        "Grouping aggregates all rows sharing a key.",
        "You need separate counts per key."
      ],
      [
        "Transactions and safety",
        "Concurrent writes can race. Protect critical updates with transactions, authorization and constrained parameters.",
        "Use a conditional UPDATE that affects a seat only when available.",
        "What guards inventory from concurrent overselling?",
        "Atomic conditional updates",
        "Read then write with no checks",
        "CSS validation",
        "Atomic operations prevent conflicting updates.",
        "Think simultaneous users."
      ]
    ]
  ],
  [
    "data-analyst",
    "Data Analyst",
    "Data & Artificial Intelligence",
    "📊",
    "Clean, investigate and communicate useful evidence.",
    "Analyze a synthetic sales dataset with reproducible checks.",
    "data-analyst",
    [
      [
        "Data quality",
        "Accurate analysis begins with types, missing values, duplicates and relevant sampling.",
        "Check blank customer IDs before calculating sales per customer.",
        "What should you inspect before trusting a dataset?",
        "Completeness and consistency",
        "Only chart appearance",
        "Only number of columns",
        "Bad inputs produce misleading outputs.",
        "Think missing and duplicate records."
      ],
      [
        "Question-driven analysis",
        "Start with a clear decision question, then define necessary measures and comparison periods.",
        "Ask which product categories changed month-to-month using the same metric definition.",
        "What makes an analysis actionable?",
        "A clear question and defined measure",
        "The most colorful chart",
        "Largest possible raw table",
        "Metric definitions determine whether comparisons mean anything.",
        "Define the decision first."
      ],
      [
        "Communicating uncertainty",
        "Explain baseline, sample size, limitations and data freshness instead of overclaiming conclusions.",
        "A 5% increase in 20 observations may not prove a lasting trend.",
        "What strengthens an insight?",
        "Context, limitations and reproducible evidence",
        "A confident headline alone",
        "Hiding data sources",
        "Evidence quality matters more than presentation certainty.",
        "Who, when, and how many?"
      ]
    ]
  ],
  [
    "bi-analyst",
    "Business Intelligence",
    "Data & Artificial Intelligence",
    "📈",
    "Design metrics and reliable business dashboards.",
    "Produce an executive dashboard with definitions and verified aggregates.",
    "bi-analyst",
    [
      [
        "KPIs",
        "A KPI represents a defined outcome. Every measure needs a numerator, denominator and relevant timeframe if applicable.",
        "Define weekly conversion as purchases divided by eligible visits in the same week.",
        "What should precede a KPI chart?",
        "A documented metric definition",
        "Random colors",
        "A made-up target",
        "Undefined metrics cannot be trusted across teams.",
        "How is the number computed?"
      ],
      [
        "Model relationships",
        "A star schema commonly separates measurable facts from descriptive dimensions.",
        "Orders are facts; product and calendar tables provide dimensions.",
        "What belongs in a fact table?",
        "Measurable business events",
        "Only logo files",
        "Only code comments",
        "Facts capture measurable events at a defined grain.",
        "Think transactions, not labels."
      ],
      [
        "Dashboard validation",
        "Reconcile displayed measures with independent source calculations and test filter effects.",
        "Compare total revenue with a checked SQL query before releasing a dashboard.",
        "What catches a double-counted dashboard metric?",
        "Reconcile with trusted source aggregates",
        "Change the theme",
        "Remove drilldowns",
        "Independent totals expose broken joins and filters.",
        "Check against a known answer."
      ]
    ]
  ],
  [
    "data-engineering",
    "Data Engineer",
    "Data & Artificial Intelligence",
    "🔄",
    "Build repeatable data pipelines and quality checks.",
    "Create a small idempotent ETL workflow from sample files.",
    "data-engineer",
    [
      [
        "Pipelines",
        "ETL extracts, transforms and loads data. Reliable pipelines record source, schema and transformation steps.",
        "Import CSV rows, parse dates, validate IDs and store clean records.",
        "What is a transform step?",
        "Cleaning or changing source data",
        "Drawing an unrelated logo",
        "Deleting monitoring",
        "Transforms prepare raw data for downstream use.",
        "Think between extract and load."
      ],
      [
        "Idempotency",
        "A rerunnable pipeline should not duplicate records after retries.",
        "Use a unique source ID and upsert rather than append on each retry.",
        "What makes replay safer?",
        "Idempotent writes and stable identifiers",
        "Blind inserts every retry",
        "No error logs",
        "Idempotency avoids double counting when jobs repeat.",
        "Think repeated execution."
      ],
      [
        "Observability",
        "Track freshness, row counts, failed records and lineage to detect silent data quality regressions.",
        "Alert if daily rows drop unexpectedly or an expected partition is missing.",
        "What signals a pipeline health issue?",
        "Unexpected missing partitions or row counts",
        "A different button color",
        "More chart animations",
        "Quality metrics reveal broken ingestion and transforms.",
        "Compare expected versus observed data."
      ]
    ]
  ],
  [
    "statistics",
    "Statistics Fundamentals",
    "Data & Artificial Intelligence",
    "📐",
    "Interpret samples, variation and experimental evidence.",
    "Analyze synthetic A/B outcomes with proper denominators.",
    "statistics",
    [
      [
        "Sampling",
        "A sample represents a population only under defensible selection assumptions. Convenience samples can be biased.",
        "A survey of only fans may not represent all customers.",
        "What can make a survey estimate biased?",
        "Nonrepresentative selection",
        "Readable labels",
        "A smaller chart",
        "Sampling method affects generalizability.",
        "Who was eligible to respond?"
      ],
      [
        "Spread and uncertainty",
        "A mean hides variation; inspect distributions, sample counts and uncertainty.",
        "Two groups with equal means may have different variances.",
        "Why inspect spread as well as average?",
        "Different data patterns can share a mean",
        "Variance is always zero",
        "Mean proves causation",
        "Distribution matters when interpreting measurements.",
        "Look beyond one summary number."
      ],
      [
        "Experiments",
        "Randomization and defined outcomes reduce some confounding but do not remove every validity concern.",
        "Randomly assign qualified visitors to two page variants; compare a prespecified conversion metric.",
        "What increases causal credibility?",
        "Well-designed randomized comparison",
        "Comparing unrelated weeks without controls",
        "Changing metrics after seeing results",
        "Valid comparisons need planned assignments and measurement.",
        "Think assignment and controls."
      ]
    ]
  ],
  [
    "python-data",
    "Python for Data Analysis",
    "Data & Artificial Intelligence",
    "🐼",
    "Manipulate tabular data and automate repeatable analysis.",
    "Clean CSV inputs and create a checked report in Python.",
    "python-data-analysis",
    [
      [
        "DataFrames",
        "A DataFrame stores labeled tabular data. Inspect types and missing values before transformations.",
        "Read a CSV and call df.info() and df.isna().sum().",
        "What helps identify unexpected column types?",
        "Inspect DataFrame dtypes",
        "Change plot colors",
        "Shuffle rows only",
        "Data types affect joins, aggregations and comparisons.",
        "Check types before calculations."
      ],
      [
        "Cleaning safely",
        "Coerce malformed values explicitly and record discarded or corrected rows.",
        "Parse dates with errors='coerce' then count missing parsed dates.",
        "What should accompany type conversion?",
        "Quality checks for failed conversions",
        "Silent deletion of rows",
        "Guessing arbitrary replacements",
        "A transparent cleaning step preserves data quality insight.",
        "What happened to invalid values?"
      ],
      [
        "Reproducible analysis",
        "Record sources, transformations, environment and assertions so results can be rebuilt.",
        "Check that total after grouping matches source total under known rules.",
        "What increases trust in an analysis?",
        "Deterministic transformations and reconciliation",
        "Only notebook screenshots",
        "Manual unlogged edits",
        "Reproducibility makes outputs auditable.",
        "Can someone rerun it?"
      ]
    ]
  ],
  [
    "data-science",
    "Data Science",
    "Data & Artificial Intelligence",
    "🔬",
    "Turn questions into measurable modeling and inference work.",
    "Design an end-to-end dataset investigation with holdout tests.",
    "ai-data-scientist",
    [
      [
        "Problem framing",
        "Specify target variable, available signals, leakage risks and useful baselines before modeling.",
        "Predict churn using only information known before the prediction date.",
        "What is data leakage?",
        "Using information unavailable at prediction time",
        "Increasing training data honestly",
        "Validating input types",
        "Leakage gives unrealistically optimistic validation.",
        "Was the information known then?"
      ],
      [
        "Train and validation",
        "Split data appropriately and avoid fitting preprocessing on holdout data.",
        "Fit a scaler on training rows, then transform test rows.",
        "Where should preprocessing parameters be learned?",
        "Training data only",
        "Combined train plus hidden test",
        "Future observations",
        "Holdout data must stay independent during fitting.",
        "Avoid learning from the exam."
      ],
      [
        "Error analysis",
        "Segment failures and compare against simple baselines before deploying a model.",
        "Compare false negatives by user group and monitor calibration.",
        "What should follow a model score?",
        "Failure and fairness analysis",
        "Declare universal accuracy",
        "Delete difficult samples",
        "Average metrics can hide harmful subgroups.",
        "Which mistakes matter most?"
      ]
    ]
  ],
  [
    "machine-learning",
    "Machine Learning",
    "Data & Artificial Intelligence",
    "🧠",
    "Train, evaluate and monitor predictive models.",
    "Create a baseline classifier and document error cases.",
    "machine-learning",
    [
      [
        "Supervised learning",
        "Supervised models learn relationships from labeled examples; the target and feature availability must be defined.",
        "Predict a known category from training observations with ground-truth labels.",
        "What does supervised learning require?",
        "Labeled training examples",
        "Only unlabeled data",
        "No evaluation",
        "Labels provide the target for fitting.",
        "Where does the correct answer come from?"
      ],
      [
        "Overfitting",
        "Models can memorize training patterns and fail to generalize. Use validation, regularization and simpler baselines.",
        "A complex model has 99% train accuracy but 60% held-out accuracy.",
        "What suggests overfitting?",
        "Large train-versus-test performance gap",
        "Same score on both by itself",
        "More documentation",
        "Overfitting harms generalization beyond training examples.",
        "Compare unseen data."
      ],
      [
        "Deployment drift",
        "Real input patterns may change. Monitor data quality and predictive performance with rollback criteria.",
        "Alert when category distributions shift beyond reviewed thresholds.",
        "What does data drift mean?",
        "Production data distribution changes",
        "A UI alignment issue",
        "Randomizing labels",
        "Input shifts can degrade model behavior.",
        "Consider changes after launch."
      ]
    ]
  ],
  [
    "ai-engineer",
    "AI Engineer",
    "Data & Artificial Intelligence",
    "🤖",
    "Build useful AI-backed services with measured correctness.",
    "Build a small answer assistant with citations and failure handling.",
    "ai-engineer",
    [
      [
        "Task specification",
        "Define what the model must do, acceptable output schema and when to refuse or request clarification.",
        "An extraction tool returns {company, date} or a validated error.",
        "What improves reliable AI integration?",
        "A narrow task and checkable output schema",
        "A very vague prompt",
        "Disabling validation",
        "Specific contracts enable consistent testing.",
        "Can the output be checked?"
      ],
      [
        "Evaluation sets",
        "Measure model behavior using labeled examples, including difficult, negative and adversarial inputs.",
        "Compare output accuracy on 100 representative examples before changing models.",
        "What is an evaluation dataset for?",
        "Detecting quality and regression on known cases",
        "Publishing private user content",
        "Replacing human review",
        "Gold cases make model changes measurable.",
        "Think reproducible tests."
      ],
      [
        "Security and costs",
        "Use trusted server quotas, input minimization and output checks before costly model calls.",
        "Reject unauthenticated high-cost requests and redact secrets from logs.",
        "Where should paid inference quotas be enforced?",
        "On the trusted server",
        "In CSS",
        "Only in a browser button",
        "Clients can bypass local limits.",
        "Who controls billable calls?"
      ]
    ]
  ],
  [
    "generative-ai",
    "Generative AI Applications",
    "Data & Artificial Intelligence",
    "✨",
    "Design safe, useful generative text and media workflows.",
    "Implement an AI content workflow with human review and provenance.",
    "ai-product-builder",
    [
      [
        "Model limitations",
        "Generative outputs can be plausible but false. High-stakes facts require independent verification.",
        "Check a generated legal date against the current primary source.",
        "How should critical facts from a model be handled?",
        "Verify with authoritative evidence",
        "Accept confident wording",
        "Repeat the same prompt only",
        "Fluency does not establish truth.",
        "Distinguish answer style from correctness."
      ],
      [
        "Human-in-the-loop",
        "Use review, edit and explicit approval when AI proposes consequential content.",
        "Show a before/after diff of a résumé bullet and require user acceptance.",
        "What prevents silent AI rewriting of user claims?",
        "Preview and explicit approval",
        "Automatic publication",
        "Removing edit controls",
        "Users should control consequential changes.",
        "Who approves the final content?"
      ],
      [
        "Privacy design",
        "Collect minimal context, restrict logs and avoid transferring sensitive data without permission.",
        "Send redacted example data when testing a public LLM API.",
        "What is good data minimization?",
        "Only send information needed for the task",
        "Upload every user file",
        "Keep transcripts forever",
        "Smaller data exposure reduces avoidable risk.",
        "Which fields are truly necessary?"
      ]
    ]
  ],
  [
    "llm-apps",
    "LLM & RAG Engineering",
    "Data & Artificial Intelligence",
    "📚",
    "Ground language-model answers in inspectable sources.",
    "Build a source-grounded Q&A prototype with citations and abstention.",
    "ai-engineer",
    [
      [
        "Retrieval-augmented generation",
        "RAG retrieves relevant source excerpts for the model; retrieval quality and source versions affect answer quality.",
        "Search a handbook and pass matching paragraphs with source IDs.",
        "What must a RAG response ideally show?",
        "Relevant grounded sources",
        "Only a confidence emoji",
        "Unlinked claims",
        "Citations let users inspect evidence.",
        "Can a user locate the source?"
      ],
      [
        "Chunking and ranking",
        "Passage size, metadata and reranking affect retrieval precision and coverage.",
        "Retrieve sections with exact document IDs and preserve their headings.",
        "What improves retrieval relevance?",
        "Good passage boundaries and ranking",
        "Random chunk selection",
        "Ignoring metadata",
        "Retrieved context quality limits answer quality.",
        "Which excerpts match the question?"
      ],
      [
        "Evaluation and injection",
        "Retrieved documents are untrusted data. Test for fabricated citations and injected instructions.",
        "Insert malicious text in a test document; verify the agent ignores commands inside it.",
        "How should a retrieved instruction be treated?",
        "Untrusted source content",
        "A higher priority system command",
        "A billing authorization",
        "Retrieved text is evidence, not a controlling instruction.",
        "Think trust boundaries."
      ]
    ]
  ],
  [
    "mlops",
    "MLOps",
    "Data & Artificial Intelligence",
    "🧪",
    "Version and operate models with reproducible releases.",
    "Ship a versioned toy model with baseline monitoring and rollback tests.",
    "mlops",
    [
      [
        "Model artifacts",
        "Record dataset versions, code revision, training config and model checksum for reproducibility.",
        "Associate a training run with Git SHA and model hash.",
        "What identifies a reproducible model?",
        "Versioned data, code and parameters",
        "An arbitrary display name",
        "Only a prediction screenshot",
        "Artifact lineage supports re-running and investigating results.",
        "What exactly was trained?"
      ],
      [
        "Promotion gates",
        "A model should pass quality, latency, privacy and safety checks before serving production.",
        "Reject promotion if performance on a reviewed test set regresses.",
        "When should an inferior new model ship?",
        "Only after an explicit justified exception and review",
        "Automatically because it is newest",
        "When marketing requests it without tests",
        "Gated releases avoid silent regressions.",
        "Evaluate before promotion."
      ],
      [
        "Monitoring",
        "Monitor data drift, output anomalies, latency and actual outcomes when labels arrive.",
        "Track inference p95 and flagged low-confidence outcomes.",
        "Which is a post-launch ML responsibility?",
        "Performance and drift monitoring",
        "Only UI theming",
        "Deleting evaluation data",
        "Model quality is not static after deployment.",
        "Think production changes."
      ]
    ]
  ],
  [
    "prompt-engineering",
    "Prompt Engineering",
    "Data & Artificial Intelligence",
    "✍️",
    "Write testable instructions and inspect model outputs critically.",
    "Create a versioned prompt with cases and accuracy notes.",
    "prompt-engineering",
    [
      [
        "Clear instructions",
        "Prompts work better with an explicit task, audience, constraints and output format.",
        "Extract five fields as JSON and return a validation error for missing values.",
        "What defines a checkable prompt?",
        "Specific task and output criteria",
        "Only more adjectives",
        "Unlimited unrelated instructions",
        "Constrained outputs can be validated.",
        "Could someone test this request?"
      ],
      [
        "Examples and edge cases",
        "Few-shot examples clarify formatting, but should not leak answer keys or private examples.",
        "Give representative input-output samples and one refusal case.",
        "What should a prompt test suite include?",
        "Typical, malformed and adversarial inputs",
        "Only a successful example",
        "Only long answers",
        "Diverse cases reveal brittle instructions.",
        "Think failure conditions."
      ],
      [
        "Evaluation not intuition",
        "Compare prompts using versioned datasets and repeatable scoring rather than subjective impressions.",
        "Run the same gold examples across two prompt versions.",
        "What best demonstrates an improvement?",
        "Better evaluated results under the same criteria",
        "A longer prompt by itself",
        "A changed font",
        "Measurement is more reliable than prompt length.",
        "Use a fixed test set."
      ]
    ]
  ],
  [
    "ai-agents",
    "AI Agents",
    "Data & Artificial Intelligence",
    "🧭",
    "Build bounded assistants with tools and reviewable actions.",
    "Design a limited file-summary agent with permission gates.",
    "ai-agents",
    [
      [
        "Tool boundaries",
        "Agents can call tools to act in external systems. Tool scopes must be least-privilege and restricted.",
        "A report assistant reads one selected document rather than all drive files.",
        "What reduces unintended agent actions?",
        "Narrow tool permissions",
        "Give universal admin rights",
        "Disable logs",
        "Least privilege limits action scope.",
        "What can the tool actually change?"
      ],
      [
        "Planning and state",
        "A useful agent tracks task state, validates assumptions and asks before irreversible operations.",
        "Review a proposed file deletion before calling the delete tool.",
        "Which operation usually needs explicit approval?",
        "Deleting a user's files",
        "Displaying a non-sensitive explanation",
        "Formatting a local paragraph",
        "Irreversible changes need human oversight.",
        "Consider reversibility."
      ],
      [
        "Security and evaluation",
        "Test prompt injection, tool errors, retries and cost bounds. Text from websites never overrides user/system permissions.",
        "A malicious README asks an agent to reveal secrets; the agent treats it as untrusted data.",
        "How should commands inside retrieved pages be handled?",
        "As untrusted content, not controlling instructions",
        "As trusted system directives",
        "As consent for billing",
        "Sources are data; the controlling instructions come from the proper authority.",
        "Who wrote the source?"
      ]
    ]
  ]
];
export const dataAndAiTracks=composeAcademyTracks(items);
