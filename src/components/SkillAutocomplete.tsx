import { useEffect, useId, useRef, useState } from "react";

const SUGGESTIONS = Array.from(new Set([
  // ===== Programming Languages =====
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Dart", "Lua", "Perl", "Haskell",
  "Elixir", "Erlang", "Clojure", "F#", "OCaml", "Julia", "Crystal", "Nim", "Zig",
  "Groovy", "Racket", "Scheme", "Common Lisp", "Prolog", "Fortran", "COBOL", "Ada",
  "Assembly", "VHDL", "Verilog", "Solidity", "Vyper", "Move", "Cairo", "Objective-C",
  "Visual Basic", "VB.NET", "Delphi", "Pascal", "ABAP", "Apex", "PL/SQL", "T-SQL",
  "SQL", "NoSQL", "Bash", "Shell Scripting", "Zsh", "Fish", "PowerShell", "Batch",
  "MATLAB", "Octave", "SAS", "Stata", "LabVIEW", "Mathematica", "WebAssembly",
  "GDScript", "HLSL", "GLSL", "CUDA", "OpenCL",

  // ===== Frontend =====
  "HTML", "HTML5", "CSS", "CSS3", "SCSS", "Sass", "Less", "Stylus", "Tailwind CSS",
  "Bootstrap", "Bulma", "Chakra UI", "Material UI", "Mantine", "Radix UI", "shadcn/ui",
  "Ant Design", "Headless UI", "Framer Motion", "GSAP", "Lottie",
  "React", "React Hooks", "React Router", "Next.js", "Remix", "Gatsby", "Astro",
  "Vue", "Vue 2", "Vue 3", "Nuxt", "Nuxt 3", "Svelte", "SvelteKit", "Angular",
  "AngularJS", "Solid.js", "SolidStart", "Qwik", "Lit", "Alpine.js", "HTMX",
  "Ember.js", "Backbone.js", "jQuery", "Stimulus", "Preact", "Inferno",
  "Redux", "Redux Toolkit", "MobX", "Zustand", "Jotai", "Recoil", "XState",
  "TanStack Query", "SWR", "Apollo Client", "Relay", "RxJS",
  "Webpack", "Vite", "Rollup", "Parcel", "esbuild", "Turbopack", "Snowpack",
  "Three.js", "Babylon.js", "PixiJS", "D3.js", "Chart.js", "Recharts", "ECharts",
  "Storybook", "Cypress", "Playwright", "Puppeteer", "Selenium", "Testing Library",
  "Jest", "Vitest", "Mocha", "Chai", "Jasmine",

  // ===== Backend =====
  "Node.js", "Deno", "Bun", "Express", "Koa", "Hapi", "NestJS", "Fastify", "AdonisJS",
  "Django", "Django REST Framework", "Flask", "FastAPI", "Tornado", "Pyramid", "Sanic",
  "Spring", "Spring Boot", "Quarkus", "Micronaut", "Vert.x", "Play Framework",
  "Ruby on Rails", "Sinatra", "Hanami",
  "Laravel", "Symfony", "CodeIgniter", "Yii", "Phalcon", "Slim",
  "ASP.NET", "ASP.NET Core", ".NET", ".NET MAUI", "Blazor",
  "Gin", "Echo", "Fiber", "Beego", "Chi",
  "Actix", "Rocket", "Axum", "Warp", "Tide",
  "Phoenix", "Plug",
  "GraphQL", "Apollo Server", "Hasura", "REST APIs", "gRPC", "tRPC", "SOAP",
  "WebSockets", "Socket.IO", "Server-Sent Events", "MQTT", "Kafka", "RabbitMQ",
  "NATS", "ZeroMQ", "ActiveMQ", "Pulsar", "Celery", "Sidekiq", "BullMQ",

  // ===== Databases =====
  "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Microsoft SQL Server", "Oracle DB",
  "IBM Db2", "CockroachDB", "YugabyteDB", "TiDB", "PlanetScale", "Neon",
  "MongoDB", "Couchbase", "CouchDB", "DynamoDB", "Cassandra", "ScyllaDB", "HBase",
  "Redis", "Memcached", "KeyDB", "Valkey",
  "Elasticsearch", "OpenSearch", "Solr", "Algolia", "Meilisearch", "Typesense",
  "Neo4j", "ArangoDB", "JanusGraph", "Dgraph", "TigerGraph",
  "InfluxDB", "TimescaleDB", "QuestDB", "ClickHouse", "Druid", "Pinot",
  "Snowflake", "BigQuery", "Redshift", "Databricks", "Vertica",
  "Firebase Firestore", "Firebase Realtime DB", "Supabase", "Appwrite", "PocketBase",
  "Pinecone", "Weaviate", "Milvus", "Qdrant", "Chroma", "pgvector",
  "Prisma", "Drizzle ORM", "TypeORM", "Sequelize", "Mongoose", "SQLAlchemy",
  "Hibernate", "JPA", "Entity Framework", "ActiveRecord", "Knex.js",
  "Database Design", "Data Modeling", "SQL Joins", "Indexing", "Query Optimization",

  // ===== Cloud / DevOps / Infra =====
  "AWS", "Amazon EC2", "Amazon S3", "AWS Lambda", "AWS RDS", "AWS DynamoDB",
  "AWS ECS", "AWS EKS", "AWS Fargate", "AWS CloudFormation", "AWS CDK", "AWS SAM",
  "Azure", "Azure Functions", "Azure DevOps", "Azure AKS", "Azure Cosmos DB",
  "GCP", "Google Cloud Run", "Google Cloud Functions", "GKE", "Firebase",
  "Cloudflare", "Cloudflare Workers", "Cloudflare R2", "Cloudflare Pages",
  "Vercel", "Netlify", "Render", "Railway", "Fly.io", "Heroku", "DigitalOcean",
  "Linode", "Vultr", "Hetzner", "OVH",
  "Docker", "Docker Compose", "Podman", "Buildah", "Kubernetes", "K3s", "OpenShift",
  "Helm", "Kustomize", "Istio", "Linkerd", "Envoy", "Consul",
  "Terraform", "OpenTofu", "Pulumi", "Ansible", "Chef", "Puppet", "SaltStack",
  "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", "Bitbucket Pipelines",
  "ArgoCD", "Flux", "Spinnaker", "TeamCity", "Drone CI", "Bamboo",
  "Prometheus", "Grafana", "Loki", "Tempo", "Datadog", "New Relic", "Splunk",
  "ELK Stack", "Fluentd", "Jaeger", "Zipkin", "OpenTelemetry", "Sentry", "PagerDuty",
  "Linux", "Unix", "Ubuntu", "Debian", "CentOS", "RHEL", "Alpine Linux", "Arch Linux",
  "Nginx", "Apache", "Caddy", "HAProxy", "Traefik",
  "CI/CD", "GitOps", "Site Reliability Engineering", "Infrastructure as Code",
  "Observability", "Chaos Engineering", "Load Balancing", "Service Mesh",

  // ===== AI / ML / Data Science =====
  "Machine Learning", "Deep Learning", "Neural Networks", "Reinforcement Learning",
  "Supervised Learning", "Unsupervised Learning", "Self-Supervised Learning",
  "TensorFlow", "Keras", "PyTorch", "PyTorch Lightning", "JAX", "Flax",
  "Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "H2O.ai",
  "Pandas", "NumPy", "SciPy", "Polars", "Dask", "Ray", "Modin",
  "Matplotlib", "Seaborn", "Plotly", "Bokeh", "Altair",
  "Hugging Face Transformers", "LangChain", "LlamaIndex", "Haystack", "DSPy",
  "LLMs", "Large Language Models", "Prompt Engineering", "RAG", "Fine-tuning",
  "OpenAI API", "Anthropic Claude", "Gemini API", "Mistral", "Llama", "Cohere",
  "Stable Diffusion", "Midjourney API", "ComfyUI", "Diffusers",
  "Computer Vision", "OpenCV", "YOLO", "Detectron2", "MMCV", "MediaPipe",
  "NLP", "Natural Language Processing", "spaCy", "NLTK", "Gensim", "Tokenization",
  "Speech Recognition", "Whisper", "Speech Synthesis", "ElevenLabs", "TTS", "STT",
  "Recommender Systems", "Time Series Forecasting", "Anomaly Detection",
  "Feature Engineering", "MLOps", "MLflow", "Kubeflow", "Weights & Biases", "DVC",
  "Data Engineering", "ETL", "ELT", "Apache Spark", "PySpark", "Apache Flink",
  "Apache Beam", "Apache Airflow", "Prefect", "Dagster", "dbt", "Fivetran",
  "Hadoop", "HDFS", "Hive", "Presto", "Trino", "Iceberg", "Delta Lake", "Hudi",
  "Data Warehousing", "Data Lake", "Data Lakehouse", "Star Schema",
  "Statistics", "Probability", "A/B Testing", "Bayesian Inference", "Causal Inference",
  "Tableau", "Power BI", "Looker", "Metabase", "Superset",

  // ===== Mobile =====
  "React Native", "Expo", "Flutter", "Ionic", "Capacitor", "Cordova", "Xamarin",
  "NativeScript", "Kotlin Multiplatform", ".NET MAUI",
  "iOS Development", "SwiftUI", "UIKit", "Core Data", "Combine",
  "Android Development", "Jetpack Compose", "Android SDK", "Room", "Retrofit",
  "App Store Optimization", "Mobile UI/UX",

  // ===== Game Dev / Graphics / XR =====
  "Unity", "Unreal Engine", "Godot", "GameMaker", "CryEngine", "Cocos2d",
  "DirectX", "OpenGL", "Vulkan", "Metal", "WebGL", "WebGPU",
  "Blender", "Maya", "3ds Max", "Houdini", "ZBrush", "Substance Painter",
  "AR", "VR", "XR", "ARKit", "ARCore", "Oculus SDK", "OpenXR",
  "Game Design", "Level Design", "Shader Programming",

  // ===== Cybersecurity =====
  "Cybersecurity", "Penetration Testing", "Ethical Hacking", "Bug Bounty",
  "OWASP Top 10", "Web Security", "Network Security", "Cloud Security",
  "Burp Suite", "Metasploit", "Nmap", "Wireshark", "Kali Linux", "Parrot OS",
  "Cryptography", "PKI", "OAuth", "OIDC", "SAML", "JWT", "Zero Trust",
  "SIEM", "SOC", "Incident Response", "Threat Hunting", "Malware Analysis",
  "Reverse Engineering", "Forensics", "Red Team", "Blue Team", "Purple Team",
  "Compliance", "ISO 27001", "SOC 2", "GDPR", "HIPAA", "PCI DSS",
  "Identity Management", "Active Directory", "Okta", "Auth0", "Keycloak",

  // ===== Blockchain / Web3 =====
  "Blockchain", "Ethereum", "Bitcoin", "Solana", "Polygon", "Avalanche", "Cosmos",
  "Polkadot", "Hyperledger", "Smart Contracts", "DeFi", "NFTs", "DAOs",
  "Web3.js", "Ethers.js", "Hardhat", "Foundry", "Truffle", "Anchor",
  "IPFS", "Filecoin", "The Graph", "Chainlink",

  // ===== Embedded / IoT / Hardware =====
  "Embedded Systems", "Firmware", "RTOS", "FreeRTOS", "Zephyr", "Embedded C",
  "Arduino", "Raspberry Pi", "ESP32", "STM32", "ARM Cortex", "PIC",
  "IoT", "MQTT", "LoRaWAN", "Zigbee", "BLE", "Bluetooth", "CAN Bus",
  "PCB Design", "KiCad", "Altium", "Eagle", "FPGA", "ASIC",
  "Robotics", "ROS", "ROS2", "SLAM", "Motion Planning",

  // ===== Design / UX =====
  "UI Design", "UX Design", "UI/UX Designer", "Product Design", "Interaction Design",
  "Visual Design", "Motion Design", "Service Design", "Design Systems",
  "Figma", "Sketch", "Adobe XD", "Framer", "InVision", "Zeplin", "Penpot",
  "Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Lightroom",
  "Wireframing", "Prototyping", "User Research", "Usability Testing",
  "Information Architecture", "Accessibility", "WCAG", "ARIA",

  // ===== Product / Business / PM =====
  "Product Management", "Technical Product Management", "Product Strategy",
  "Roadmapping", "OKRs", "KPIs", "Agile", "Scrum", "Kanban", "SAFe", "Lean",
  "Jira", "Confluence", "Linear", "Asana", "Trello", "Notion", "ClickUp",
  "Stakeholder Management", "Go-to-Market", "Market Research", "Competitive Analysis",
  "Customer Interviews", "Discovery", "Growth", "Analytics", "Mixpanel", "Amplitude",
  "Google Analytics", "Hotjar", "Segment",
  "Project Management", "Program Management", "PMP", "Risk Management",

  // ===== QA / Testing =====
  "QA", "Manual Testing", "Automation Testing", "Test Automation", "TDD", "BDD",
  "Unit Testing", "Integration Testing", "End-to-End Testing", "Regression Testing",
  "Performance Testing", "Load Testing", "JMeter", "k6", "Locust", "Gatling",
  "Postman", "Insomnia", "SoapUI", "Appium",

  // ===== Marketing / Content =====
  "SEO", "SEM", "Content Marketing", "Copywriting", "Technical Writing",
  "Email Marketing", "Social Media Marketing", "Performance Marketing",
  "Google Ads", "Meta Ads", "TikTok Ads", "HubSpot", "Mailchimp", "Salesforce",

  // ===== Finance / Other =====
  "Quantitative Finance", "Algorithmic Trading", "Risk Modeling", "Excel", "VBA",
  "Financial Modeling", "Accounting",

  // ===== Soft Skills =====
  "Communication", "Leadership", "Mentoring", "Collaboration", "Problem Solving",
  "Critical Thinking", "Time Management", "Public Speaking", "Negotiation",

  // ===== Roles =====
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Web Developer",
  "Mobile Developer", "iOS Developer", "Android Developer", "React Developer",
  "Vue Developer", "Angular Developer", "Node.js Developer", "Python Developer",
  "Java Developer", "Go Developer", "Rust Developer", "PHP Developer", "Ruby Developer",
  ".NET Developer", "WordPress Developer", "Shopify Developer", "Salesforce Developer",
  "DevOps Engineer", "Platform Engineer", "Cloud Engineer", "Cloud Architect",
  "Solutions Architect", "Software Architect", "Enterprise Architect",
  "Site Reliability Engineer", "SRE", "Infrastructure Engineer", "Network Engineer",
  "Systems Engineer", "Systems Administrator", "Database Administrator", "DBA",
  "Data Engineer", "Analytics Engineer", "Data Analyst", "Business Analyst",
  "Data Scientist", "Research Scientist", "Applied Scientist",
  "Machine Learning Engineer", "ML Engineer", "AI Engineer", "MLOps Engineer",
  "Computer Vision Engineer", "NLP Engineer", "LLM Engineer", "Prompt Engineer",
  "Security Engineer", "Application Security Engineer", "Cloud Security Engineer",
  "Penetration Tester", "Red Team Engineer", "SOC Analyst", "Security Architect",
  "Game Developer", "Game Designer", "Graphics Engineer", "Engine Programmer",
  "Blockchain Developer", "Smart Contract Engineer", "Web3 Engineer",
  "Embedded Engineer", "Firmware Engineer", "Hardware Engineer", "Robotics Engineer",
  "FPGA Engineer", "IoT Engineer",
  "QA Engineer", "QA Automation Engineer", "SDET", "Test Engineer",
  "Product Manager", "Technical Product Manager", "Project Manager", "Program Manager",
  "Engineering Manager", "Tech Lead", "Staff Engineer", "Principal Engineer",
  "CTO", "VP of Engineering", "Director of Engineering",
  "UI Designer", "UX Designer", "UI/UX Designer", "Product Designer",
  "Motion Designer", "Graphic Designer", "Brand Designer", "Design Engineer",
  "Technical Writer", "Developer Advocate", "Developer Relations", "Solutions Engineer",
  "Sales Engineer", "Customer Success Engineer", "Support Engineer",
  "Scrum Master", "Agile Coach",
]));

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
  label?: string;
}

export function SkillAutocomplete({ value, onChange, disabled, placeholder, className = "", onSubmit, label = "Choose a skill" }: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const q = value.trim().toLowerCase();
  const matches = q
    ? (() => {
        const starts: string[] = [];
        const includes: string[] = [];
        for (const s of SUGGESTIONS) {
          const sl = s.toLowerCase();
          if (sl === q) continue;
          if (sl.startsWith(q)) starts.push(s);
          else if (sl.includes(q)) includes.push(s);
        }
        return [...starts, ...includes].slice(0, 10);
      })()
    : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setActiveIdx(0); }, [value]);

  function pick(s: string) {
    onChange(s);
    setOpen(false);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (open && matches.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i + 1) % matches.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => (i - 1 + matches.length) % matches.length); return; }
      if (e.key === "Enter" && matches[activeIdx]) {
        e.preventDefault();
        pick(matches[activeIdx]);
        return;
      }
      if (e.key === "Escape") { setOpen(false); return; }
    }
    if (e.key === "Tab") setOpen(false);
    if (e.key === "Enter" && onSubmit) { onSubmit(); }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={value}
        aria-label={label}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0 && !disabled}
        aria-controls={listId}
        aria-activedescendant={open && matches.length ? listId + "-item-" + activeIdx : undefined}
        maxLength={120}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && matches.length > 0 && !disabled && (
        <div id={listId} role="listbox" aria-label="Suggested topics" className="absolute z-50 left-0 right-0 mt-1 panel max-h-64 overflow-auto animate-fade-in">
          {matches.map((s, i) => (
            <button
              key={s}
              id={listId + "-item-" + i}
              role="option"
              aria-selected={i === activeIdx}
              type="button"
              onClick={() => pick(s)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIdx(i)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                i === activeIdx ? "bg-led-cyan/10 text-led-cyan" : "hover:bg-surface-2"
              }`}
            >
              <span className="font-medium">{highlight(s, value)}</span>
              {i === activeIdx && <span className="font-mono text-[9px] text-muted-foreground tracking-widest">↵ TAB</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-led-cyan font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
