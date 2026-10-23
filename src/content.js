// All copy comes from ReasonateAI's product messaging.
export const SITE = 'https://reasonateai.com'
export const EMAIL = 'info@reasonateai.com'

export const NAV = [
  { label: 'Architecture', href: '#architecture' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Process', href: '#process' },
  { label: 'Vision', href: '#vision' },
  { label: 'Team', href: '#team' },
]

export const LOOP = [
  { key: 'ANALYZE', text: 'Understands your stack' },
  { key: 'SANDBOX', text: 'Tests in a live twin' },
  { key: 'DEPLOY', text: 'Rolls out safely' },
]

export const STACK = ['Docker', 'Kubernetes', 'Terraform', 'Traefik', 'PostgreSQL', 'Celery', 'LangGraph', 'AWS', 'Google Cloud', 'Azure', 'GitHub', 'Prometheus']

export const STATS = [
  { value: 0, suffix: '', label: 'lines of YAML you hand-write' },
  { value: 2, suffix: '', label: 'synchronized twins: sandbox + live' },
  { value: 100, suffix: '%', label: 'of changes simulated before prod' },
  { value: 24, suffix: '/7', label: 'autonomous monitoring & self-heal' },
]

export const TERMINAL = [
  { who: 'you', text: 'deploy my next.js storefront with postgres, autoscale 2 to 10 pods', type: true },
  { who: 'ai', text: 'analyzing repo github.com/acme/storefront' },
  { who: 'ok', text: 'detected Next.js · Prisma · PostgreSQL · Redis' },
  { who: 'ok', text: 'generated Dockerfile, k8s manifests, terraform plan' },
  { who: 'ai', text: 'spinning up ephemeral twin  sbx-7f3a.preview' },
  { who: 'ok', text: '148 integration tests passed · traffic replay ok' },
  { who: 'warn', text: 'memory leak in worker detected · auto-patched' },
  { who: 'ai', text: 'promotion gate: approved by policy prod-guard' },
  { who: 'ok', text: 'canary 5% → 50% → 100% · zero downtime' },
  { who: 'live', text: 'live  https://storefront.acme.app  self-heal: on' },
]

export const TWINS = [
  {
    tone: 'c1',
    eyebrow: 'Ephemeral Simulation Twin',
    title: 'Docker Sandbox',
    text: 'Spun up per deployment job. Provisions isolated Docker containers with dynamic Traefik preview routing for dry-run verification before production push.',
    tags: ['Docker Sandbox', 'Traefik Routing'],
  },
  {
    tone: 'c4',
    eyebrow: 'Live Production Twin',
    title: 'Production Cluster',
    text: 'Serves real client traffic via Traefik ingress with Postgres state. Receives pre-verified releases and executes autonomous self-healing.',
    tags: ['Zero Downtime', 'Self-Healing'],
  },
]

export const RUNTIME = [
  { name: 'Docker Sandbox + Traefik Network', desc: 'Isolated container dry-run', status: 'Testing', tone: 'c1' },
  { name: 'LangGraph Reviewer + Validation Gate', desc: 'Syntax, paths, and manifest verification', status: 'Governed', tone: 'c3' },
  { name: 'Production Traefik + Celery Health Probes', desc: 'Live routing and closed-loop self-heal', status: 'Monitoring', tone: 'c4' },
]

export const CAPABILITIES = [
  {
    icon: 'chat',
    tag: 'Natural Language Interface',
    title: 'Natural-Language Infrastructure',
    text: 'Describe infrastructure requirements, architectural topologies, and cloud deployment workflows in natural language without manual scripting.',
  },
  {
    icon: 'twins',
    tag: 'Twin Sandboxing',
    title: 'Dual-Twin Simulation',
    text: 'Test changes against a synchronized, production-like ephemeral simulation environment before any change touches live production servers.',
  },
  {
    icon: 'check',
    tag: 'Verification Gates',
    title: 'Automated Integration Testing',
    text: 'Validate infrastructure, microservices, container configurations, and complex dependencies automatically before triggering deployment.',
  },
  {
    icon: 'gavel',
    tag: 'Enterprise Compliance',
    title: 'Governed Deployment',
    text: 'Execute approved changes with controlled workflows, strict validation gates, multi-stage approval policies, and end-to-end auditability.',
  },
  {
    icon: 'heal',
    tag: 'Autonomous Remediation',
    title: 'Self-Healing Operations',
    text: 'Detect system failures, reason autonomously about corrective actions, and automate recovery workflows in real time without human intervention.',
  },
  {
    icon: 'bolt',
    tag: 'Operational Resilience',
    title: 'Zero-Downtime Objective',
    text: 'Design deployments around safe rollouts, continuous canary validation, and uninterrupted operational resilience for mission-critical cloud apps.',
  },
]

export const SUITE = [
  {
    icon: 'shield',
    tone: 'c1',
    title: 'Autonomous SecOps & Compliance',
    text: 'Formally verifies cloud firewall permissions, scans for credential leaks, and patches vulnerability vectors before any final live push.',
    bullets: ['Firewall permission proofs', 'Credential-leak scanning', 'Pre-push vulnerability patching'],
  },
  {
    icon: 'coins',
    tone: 'c3',
    title: 'FinOps Cloud Cost Control',
    text: 'Autonomously tracks infrastructure utilization, cuts down idle server clusters, and optimizes compute spending to match your budget constraints.',
    bullets: ['Utilization tracking', 'Idle-cluster shutdown', 'Budget-aware compute'],
  },
  {
    icon: 'code',
    tone: 'c4',
    title: 'Infrastructure-as-Code Automation',
    text: 'Automatically generates and maintains enterprise-grade Docker, Kubernetes, and Terraform configurations without manual YAML editing.',
    bullets: ['Docker & Compose', 'Kubernetes manifests', 'Terraform modules'],
  },
]

export const STEPS = [
  {
    n: '01',
    title: 'AI-Driven System Design',
    text: 'Describe your product idea or connect your GitHub repo. Our specialized Architect Agents automatically analyze your requirements, choose the optimal database structures, and map cloud microservices.',
    note: 'Architect Agents + GitHub repo analysis',
  },
  {
    n: '02',
    title: 'Sandbox Testing & Self-Healing',
    text: 'Instead of a risky direct push, the platform provisions an ephemeral “Live Twin” sandbox mirroring production. Test agents execute integration suites, simulate traffic, and autonomously patch code flaws.',
    note: 'Ephemeral Live Twin: zero production risk',
  },
  {
    n: '03',
    title: 'Zero-Downtime Rollout & Monitoring',
    text: 'The validated build goes live with absolute zero-downtime. Your Virtual CTO continuously monitors application runtime logs, scales clusters, and self-heals infrastructure issues 24/7.',
    note: 'Auto-scaling, 24/7 self-healing, always-on monitoring',
  },
]

export const AUDIENCE = [
  {
    icon: 'rocket',
    who: 'Startup Founders',
    title: 'Deploy production-grade cloud infra without an expensive DevOps team.',
    text: 'Move from MVP to scale instantly. ReasonateAI acts as your Virtual CTO, managing your infrastructure, cutting cloud costs, and preventing crashes while you focus on business growth.',
  },
  {
    icon: 'cpu',
    who: 'Developers & R&D Teams',
    title: 'Automate continuous deployment pipelines with zero configuration.',
    text: 'No more writing tedious YAML files or wrestling with Kubernetes. Push code and let multi-agent AI handle environment provisioning, testing, and scaling autonomously.',
  },
  {
    icon: 'briefcase',
    who: 'Freelancers',
    title: 'Deliver client projects 10× faster with seamless handovers.',
    text: 'Stop wasting unbillable hours setting up separate cloud environments for every client. Spin up architectures in minutes via plain English prompts and hand over complete, self-healing setups.',
  },
  {
    icon: 'cap',
    who: 'College Students',
    title: 'Launch hackathon MVPs and portfolio projects without cloud complexity.',
    text: 'Don’t get lost in complex AWS or GCP consoles. Deploy your full-stack college projects and deep-tech prototypes instantly on the cloud using simple natural language.',
  },
]

export const VISION = [
  {
    label: 'Our Motive',
    title: 'Eliminating Cloud Fragility & Outages',
    text: 'Replacing brittle manual YAML scripts with an intelligent, closed-loop Autonomous Virtual CTO that validates changes in live twins with zero downtime.',
    foot: 'Zero downtime • Closed-loop reasoning',
  },
  {
    label: 'Our Vision',
    quote: 'To make enterprise-grade cloud infrastructure and software deployment fully autonomous, secure, and accessible to every business globally.',
    foot: 'Global scale • Democratized cloud',
  },
  {
    label: 'Our Mission',
    quote: 'To build the world’s most reliable Autonomous AI CTO powered by Dual-Twin Architecture: delivering zero-downtime, governed, and self-healing operations.',
    foot: 'Dual-Twin • Enterprise reliability',
  },
]

export const ECOSYSTEM = [
  {
    kicker: 'Startup Ecosystem',
    name: 'Google for Startups',
    role: 'Technology & Cloud Support',
    text: 'Connecting with global Google startup programs, cloud credits, and AI technical mentorship.',
    href: 'https://www.linkedin.com/company/google-for-startups/',
  },
  {
    kicker: 'NVIDIA Inception',
    name: 'NVIDIA for Startups',
    role: 'AI Startup Ecosystem',
    text: 'Engaged through the NVIDIA Inception program for GPU computing acceleration and technical support.',
    href: 'https://www.linkedin.com/showcase/nvidia-for-startups/',
  },
  {
    kicker: 'Incubated at TBIF',
    name: 'IIT Ropar TBIF',
    role: 'Incubation & Deep Tech',
    text: 'Supported through the Technology Business Incubator Foundation at Indian Institute of Technology Ropar.',
    href: 'https://www.linkedin.com/company/iit-ropar-technology-business-incubator-foundation/',
  },
  {
    kicker: 'Entrepreneurship Support',
    name: 'PW School of Startups',
    role: 'Startup Ecosystem',
    text: 'Connecting within PhysicsWallah School of Startups founder network and entrepreneurial cohorts.',
    href: 'https://www.linkedin.com/company/pw-school-of-startups/',
  },
  {
    kicker: 'Startup & Incubation Cell',
    name: 'United University',
    role: 'University Incubation Cell',
    text: 'Early-stage incubation, campus ecosystem, and academic innovation support via United University Allahabad.',
    href: 'https://www.linkedin.com/company/united-university-allahabad/',
  },
]

export const TEAM = [
  {
    initials: 'AM',
    name: 'Ashutosh Mishra',
    role: 'Founder, CEO & CTO',
    text: 'Driving ReasonateAI’s product vision, architecture, and execution.',
    profile: `${SITE}/team/ashutosh-mishra`,
    linkedin: 'https://www.linkedin.com/in/ashutosh-mishra-841408324/',
  },
  {
    initials: 'MK',
    name: 'Manvi Keshari',
    role: 'Co-Founder & CMO',
    text: 'Leading marketing, brand development, and growth initiatives.',
    profile: `${SITE}/team/manvi-keshari`,
    linkedin: 'https://www.linkedin.com/in/manvi-keshari-287aa2321/',
  },
  {
    initials: 'AS',
    name: 'Dr. Arun Kumar Sharma',
    role: 'Faculty / AI Mentor: IIT Ropar',
    text: 'Assistant Professor at IIT Ropar, guiding AI research and technical architecture.',
    profile: `${SITE}/team/dr-arun-kumar`,
    linkedin: 'https://www.linkedin.com/in/dr-arun-kumar-sharma-3684b112a/',
  },
]

export const SOCIALS = [
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/reasonateai-official/' },
  { icon: 'x', label: 'X', href: 'https://x.com/ReasonateAI' },
  { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/reasonateai' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/ReasonateAI' },
]

export const FOOTER = [
  {
    title: 'Platform',
    links: [
      { label: 'Architecture', href: '#architecture' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Pricing', href: `${SITE}/pricing` },
      { label: 'Roadmap', href: `${SITE}/roadmap` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: `${SITE}/about` },
      { label: 'Vision & Mission', href: '#vision' },
      { label: 'Team', href: '#team' },
      { label: 'Ecosystem', href: '#ecosystem' },
      { label: 'Careers', href: `${SITE}/careers` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: `${SITE}/privacy-policy` },
      { label: 'Terms of Service', href: `${SITE}/terms-of-service` },
      { label: 'Cookie Policy', href: `${SITE}/cookie-policy` },
      { label: 'Security', href: `${SITE}/security` },
    ],
  },
]
