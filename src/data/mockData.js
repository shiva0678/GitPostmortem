export const mockAnalysisResult = {
  repository: {
    name: "facebook/react",
    url: "https://github.com/facebook/react",
    stars: 228000,
    forks: 46500,
    openIssues: 980,
    language: "JavaScript",
    totalCommits: 17842,
    contributors: 1672,
    branches: 48,
    lastCommit: "2 hours ago",
    createdAt: "May 2013",
    license: "MIT",
  },

  riskScore: {
    overall: 72,
    label: "Moderate-High",
    breakdown: [
      { category: "Code Complexity", score: 68 },
      { category: "Bug Recurrence", score: 84 },
      { category: "Test Coverage Gaps", score: 61 },
      { category: "Dependency Staleness", score: 55 },
      { category: "Hotspot Concentration", score: 78 },
    ],
  },

  timeline: [
    { month: "Jan", bugs: 12, fixes: 10, features: 24 },
    { month: "Feb", bugs: 18, fixes: 15, features: 19 },
    { month: "Mar", bugs: 8, fixes: 12, features: 31 },
    { month: "Apr", bugs: 22, fixes: 18, features: 16 },
    { month: "May", bugs: 15, fixes: 14, features: 28 },
    { month: "Jun", bugs: 28, fixes: 20, features: 22 },
    { month: "Jul", bugs: 11, fixes: 16, features: 35 },
    { month: "Aug", bugs: 19, fixes: 17, features: 20 },
    { month: "Sep", bugs: 25, fixes: 22, features: 18 },
    { month: "Oct", bugs: 14, fixes: 13, features: 27 },
    { month: "Nov", bugs: 20, fixes: 19, features: 23 },
    { month: "Dec", bugs: 9, fixes: 11, features: 30 },
  ],

  hotspots: [
    { file: "packages/react-reconciler/src/ReactFiberWorkLoop.js", changes: 342, bugs: 28, risk: 94 },
    { file: "packages/react-dom/src/client/ReactDOMComponent.js", changes: 218, bugs: 19, risk: 82 },
    { file: "packages/react/src/ReactHooks.js", changes: 189, bugs: 15, risk: 76 },
    { file: "packages/scheduler/src/forks/Scheduler.js", changes: 156, bugs: 12, risk: 71 },
    { file: "packages/react-reconciler/src/ReactFiberCommitWork.js", changes: 134, bugs: 11, risk: 68 },
    { file: "packages/react-dom/src/events/DOMPluginEventSystem.js", changes: 112, bugs: 9, risk: 63 },
    { file: "packages/shared/ReactFeatureFlags.js", changes: 98, bugs: 7, risk: 55 },
    { file: "packages/react-reconciler/src/ReactFiberBeginWork.js", changes: 87, bugs: 6, risk: 48 },
  ],

  failurePatterns: [
    {
      id: 1,
      title: "Stale Closure in useEffect Callbacks",
      severity: "critical",
      occurrences: 14,
      lastSeen: "3 days ago",
      description:
        "Callbacks inside useEffect capture stale state variables due to missing dependency arrays. This pattern has caused regressions in 14 separate commits across 4 branches.",
      files: ["ReactFiberHooks.js", "ReactHooks.js", "use-sync-external-store"],
      suggestedFix: "Add ESLint exhaustive-deps rule enforcement and implement useEvent pattern for stable callbacks.",
    },
    {
      id: 2,
      title: "Race Condition in Concurrent Rendering",
      severity: "critical",
      occurrences: 9,
      lastSeen: "1 week ago",
      description:
        "Concurrent mode introduces interleaved renders that expose shared mutable state. The same race condition pattern has been fixed and re-introduced multiple times.",
      files: ["ReactFiberWorkLoop.js", "Scheduler.js", "ReactFiberLane.js"],
      suggestedFix: "Implement lane-based priority guards and add integration tests for interleaved render scenarios.",
    },
    {
      id: 3,
      title: "Event Handler Memory Leak",
      severity: "high",
      occurrences: 7,
      lastSeen: "2 weeks ago",
      description:
        "Event listeners attached in lifecycle methods are not cleaned up on unmount, causing memory growth in long-running applications.",
      files: ["DOMPluginEventSystem.js", "ReactDOMComponent.js"],
      suggestedFix: "Enforce cleanup return patterns in all event registration hooks. Add leak detection in CI pipeline.",
    },
    {
      id: 4,
      title: "Hydration Mismatch Regression",
      severity: "high",
      occurrences: 11,
      lastSeen: "5 days ago",
      description:
        "Server-rendered HTML does not match client-rendered output for dynamic content, causing full page re-renders and flickering.",
      files: ["ReactDOMServerRendering.js", "ReactFiberHydrationContext.js"],
      suggestedFix: "Add snapshot comparison tests for SSR output. Implement suppressHydrationWarning selectively.",
    },
    {
      id: 5,
      title: "Infinite Re-render Loop",
      severity: "medium",
      occurrences: 5,
      lastSeen: "3 weeks ago",
      description:
        "Components setting state unconditionally inside render or useEffect without guards trigger infinite re-render cycles.",
      files: ["ReactFiberBeginWork.js", "ReactFiberHooks.js"],
      suggestedFix: "Add render-count circuit breaker in development mode. Enforce conditional state updates in code review.",
    },
  ],

  blindSpots: [
    {
      area: "Error Boundary Recovery",
      description: "No tests cover the recovery path after an error boundary catches. Components may remain in broken state after retry.",
      coverage: 12,
      risk: "high",
    },
    {
      area: "Concurrent Suspense Fallbacks",
      description: "Fallback UI timing during concurrent transitions is untested. Users may see flash-of-loading-state.",
      coverage: 8,
      risk: "high",
    },
    {
      area: "Server Component Serialization",
      description: "Edge cases in serializing React Server Components with circular references or large payloads are not covered.",
      coverage: 22,
      risk: "medium",
    },
    {
      area: "DevTools Integration",
      description: "Component inspection and profiling hooks have minimal test coverage. Breaking changes go undetected.",
      coverage: 15,
      risk: "medium",
    },
    {
      area: "Legacy Context API",
      description: "The deprecated context API still has active usage paths but zero regression tests.",
      coverage: 3,
      risk: "low",
    },
  ],

  recommendations: [
    {
      id: 1,
      priority: "critical",
      title: "Add Pre-commit Hook for Stale Closure Detection",
      description:
        "Install and configure eslint-plugin-react-hooks with exhaustive-deps set to 'error'. This single change would have prevented 14 of the 46 bugs detected.",
      impact: "Prevents ~30% of recurring bugs",
      effort: "Low (< 1 hour)",
      category: "Prevention",
    },
    {
      id: 2,
      priority: "critical",
      title: "Implement Concurrent Render Integration Tests",
      description:
        "Create a test suite specifically for interleaved render scenarios using React Testing Library's concurrent mode utilities.",
      impact: "Covers largest blind spot",
      effort: "Medium (1-2 days)",
      category: "Testing",
    },
    {
      id: 3,
      priority: "high",
      title: "Refactor ReactFiberWorkLoop.js",
      description:
        "This file has 342 changes and 28 bugs. Split into smaller modules: SchedulerInterface, RenderPhase, CommitPhase, and ErrorHandling.",
      impact: "Reduces hotspot concentration by 40%",
      effort: "High (1 week)",
      category: "Architecture",
    },
    {
      id: 4,
      priority: "high",
      title: "Add Memory Leak Detection to CI",
      description:
        "Integrate heap snapshot comparison in the CI pipeline to catch event handler leaks before they reach production.",
      impact: "Eliminates memory leak regressions",
      effort: "Medium (2-3 days)",
      category: "Infrastructure",
    },
    {
      id: 5,
      priority: "medium",
      title: "Create Hydration Snapshot Tests",
      description:
        "Add SSR snapshot tests that compare server and client output for all common component patterns.",
      impact: "Catches hydration mismatches early",
      effort: "Low (4-6 hours)",
      category: "Testing",
    },
    {
      id: 6,
      priority: "medium",
      title: "Deprecation Path for Legacy Context",
      description:
        "Add runtime warnings for legacy context usage and create a migration guide to modernize consuming components.",
      impact: "Reduces legacy code surface area",
      effort: "Medium (2-3 days)",
      category: "Maintenance",
    },
  ],
};

export const loadingSteps = [
  { text: "Connecting to GitHub API...", duration: 600 },
  { text: "Cloning repository metadata...", duration: 800 },
  { text: "Parsing commit history (17,842 commits)...", duration: 1200 },
  { text: "Analyzing bug-fix commit pairs...", duration: 1000 },
  { text: "Mapping file change frequencies...", duration: 800 },
  { text: "Detecting failure patterns with AI...", duration: 1400 },
  { text: "Identifying code hotspots...", duration: 900 },
  { text: "Scanning for blind spots...", duration: 700 },
  { text: "Calculating risk scores...", duration: 600 },
  { text: "Generating recommendations...", duration: 800 },
  { text: "Building postmortem report...", duration: 500 },
];
