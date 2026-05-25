import { Note, Folder, Tag, Task, Analytics, User } from '@/types'

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  plan: 'pro',
  createdAt: new Date('2024-01-01'),
}

export const mockTags: Tag[] = [
  { id: '1', name: 'work', color: '#6366f1', noteCount: 12 },
  { id: '2', name: 'personal', color: '#ec4899', noteCount: 8 },
  { id: '3', name: 'ideas', color: '#f97316', noteCount: 15 },
  { id: '4', name: 'research', color: '#3b82f6', noteCount: 6 },
  { id: '5', name: 'learning', color: '#22c55e', noteCount: 9 },
  { id: '6', name: 'design', color: '#8b5cf6', noteCount: 4 },
]

export const mockFolders: Folder[] = [
  { id: '1', name: 'Work Projects', color: '#6366f1', icon: '💼', noteCount: 8, createdAt: new Date('2024-01-05') },
  { id: '2', name: 'Personal', color: '#ec4899', icon: '🌸', noteCount: 12, createdAt: new Date('2024-01-10') },
  { id: '3', name: 'Research', color: '#3b82f6', icon: '🔬', noteCount: 5, createdAt: new Date('2024-02-01') },
  { id: '4', name: 'Ideas & Inspiration', color: '#f97316', icon: '💡', noteCount: 20, createdAt: new Date('2024-02-15') },
  { id: '5', name: 'Books & Reading', color: '#22c55e', icon: '📚', noteCount: 7, createdAt: new Date('2024-03-01') },
]

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Building a Modern SaaS Product',
    content: `# Building a Modern SaaS Product

## Overview
A comprehensive guide to building scalable SaaS products in 2024.

## Key Principles

### 1. User-Centric Design
Always start with the user's pain points. The best products solve real problems elegantly.

\`\`\`javascript
const userNeeds = {
  simplicity: true,
  speed: 'critical',
  reliability: '99.9%'
}
\`\`\`

### 2. Technical Architecture
- **Microservices** for scalability
- **Event-driven** architecture for real-time features
- **CQRS** pattern for complex domains

### 3. Growth Strategy
Focus on product-led growth. Let the product speak for itself.

> "The best marketing is a product people love." — Every successful SaaS founder

## Implementation Checklist
- [ ] Define core value proposition
- [ ] Build MVP with 3 key features
- [ ] Instrument analytics from day 1
- [ ] Set up customer feedback loop
- [x] Technical stack selection
- [x] Architecture design`,
    excerpt: 'A comprehensive guide to building scalable SaaS products in 2024.',
    folderId: '1',
    tags: [mockTags[0], mockTags[2]],
    isPinned: true,
    isStarred: true,
    isTrashed: false,
    isArchived: false,
    color: '',
    collaborators: [],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-05-20'),
    wordCount: 245,
    readTime: 2,
    versions: [],
  },
  {
    id: '2',
    title: 'Design System Notes',
    content: `# Design System Notes

## Color Palette
A well-crafted color system is the foundation of any great UI.

### Primary Colors
Use indigo/violet as primary — conveys trust, creativity, and sophistication.

### Semantic Colors
- **Success**: #22c55e — Green for positive actions
- **Warning**: #f59e0b — Amber for caution states  
- **Error**: #ef4444 — Red for destructive actions
- **Info**: #3b82f6 — Blue for informational states

## Typography Scale
\`\`\`css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
\`\`\`

## Spacing System
Use a base-8 spacing system for consistency across all components.

## Component Principles
1. **Composable** — Build small, reusable atoms
2. **Accessible** — WCAG 2.1 AA compliance minimum
3. **Themeable** — CSS custom properties for easy theming`,
    excerpt: 'A well-crafted color system is the foundation of any great UI.',
    folderId: '4',
    tags: [mockTags[5], mockTags[2]],
    isPinned: true,
    isStarred: false,
    isTrashed: false,
    isArchived: false,
    color: '#8b5cf6',
    collaborators: [],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-05-18'),
    wordCount: 178,
    readTime: 1,
    versions: [],
  },
  {
    id: '3',
    title: 'Weekly Review — May 2024',
    content: `# Weekly Review — May 2024

## What Went Well 🎉
- Shipped the new dashboard feature
- Had productive 1:1 with the team
- Completed 3 out of 4 goals

## What Could Be Better 🤔
- Need to improve async communication
- Documentation needs more love
- Should block focus time in calendar

## Learnings 💡
The key insight this week: **shipping beats perfecting**. 

Done is better than perfect, but good enough isn't good enough when quality matters to users.

## Next Week Goals
- [ ] Finish authentication module
- [ ] Review Q2 roadmap
- [ ] Write 2 blog posts
- [ ] Exercise 4 times

## Gratitude
Grateful for the team's support and for having meaningful work to do.`,
    excerpt: 'Shipped the new dashboard feature. Had productive 1:1 with the team.',
    folderId: '2',
    tags: [mockTags[1]],
    isPinned: false,
    isStarred: true,
    isTrashed: false,
    isArchived: false,
    color: '',
    collaborators: [],
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-19'),
    wordCount: 156,
    readTime: 1,
    versions: [],
  },
  {
    id: '4',
    title: 'AI & Machine Learning Research',
    content: `# AI & Machine Learning Research

## LLM Architecture Insights

### Transformer Architecture
The attention mechanism remains the core innovation driving modern AI.

**Key components:**
- Multi-head self-attention
- Position encodings
- Feed-forward networks
- Layer normalization

### Emerging Techniques
1. **RAG (Retrieval Augmented Generation)** — Ground LLMs in factual data
2. **Fine-tuning** — Adapt models to specific domains
3. **RLHF** — Align models with human preferences

## Practical Applications

\`\`\`python
# Simple RAG implementation sketch
def rag_query(question: str, docs: list[str]) -> str:
    embeddings = embed(docs)
    relevant = retrieve(question, embeddings)
    context = format_context(relevant)
    return llm.generate(f"{context}\\n{question}")
\`\`\`

## Resources
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)

## Open Questions
- How do we measure genuine reasoning vs. pattern matching?
- What are the energy implications of scaling?`,
    excerpt: 'The attention mechanism remains the core innovation driving modern AI.',
    folderId: '3',
    tags: [mockTags[3], mockTags[4]],
    isPinned: false,
    isStarred: false,
    isTrashed: false,
    isArchived: false,
    color: '#3b82f6',
    collaborators: [],
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-05-15'),
    wordCount: 210,
    readTime: 2,
    versions: [],
  },
  {
    id: '5',
    title: 'Product Roadmap Q3 2024',
    content: `# Product Roadmap Q3 2024

## Vision
Make the product 10x more valuable for power users while keeping it simple for beginners.

## Themes

### Theme 1: Speed & Performance
Every user action should feel instantaneous.

**Initiatives:**
- Optimistic UI updates everywhere
- Edge caching for static content
- Database query optimization
- Lazy loading for heavy components

### Theme 2: Collaboration
Work is better together.

**Initiatives:**
- Real-time multiplayer editing
- Comments & reactions on notes
- Shared workspaces
- Team analytics

### Theme 3: Intelligence
Let AI do the boring work.

**Initiatives:**
- Smart tagging with AI
- Auto-summarization
- Writing suggestions
- Semantic search

## Timeline
| Month | Focus | Key Deliverable |
|-------|-------|-----------------|
| July  | Performance | P95 < 100ms |
| August | Collaboration | Real-time editing |
| September | Intelligence | AI features beta |`,
    excerpt: 'Make the product 10x more valuable for power users while keeping it simple for beginners.',
    folderId: '1',
    tags: [mockTags[0], mockTags[2]],
    isPinned: false,
    isStarred: false,
    isTrashed: false,
    isArchived: false,
    color: '',
    collaborators: [],
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-22'),
    wordCount: 198,
    readTime: 1,
    versions: [],
  },
  {
    id: '6',
    title: 'Reading Notes: Atomic Habits',
    content: `# Reading Notes: Atomic Habits
*by James Clear*

## Core Concept
Tiny changes compound into remarkable results. 1% improvement daily = 37x better in a year.

## The Four Laws of Behavior Change

### 1. Make it Obvious (Cue)
- Design your environment for success
- Implementation intentions: "I will [BEHAVIOR] at [TIME] in [LOCATION]"
- Habit stacking: "After [CURRENT HABIT], I will [NEW HABIT]"

### 2. Make it Attractive (Craving)
- Temptation bundling: pair habits you need to do with habits you want to do
- Join cultures where desired behavior is normal

### 3. Make it Easy (Response)
- Two-minute rule: scale habits down to 2 minutes
- Reduce friction for good habits
- Increase friction for bad habits

### 4. Make it Satisfying (Reward)
- What is immediately rewarded is repeated
- Use a habit tracker — don't break the chain

## Key Quotes
> "You do not rise to the level of your goals. You fall to the level of your systems."

> "Every action is a vote for the type of person you wish to become."

## Personal Applications
- Morning routine: meditate → journal → exercise
- Evening: read 20 pages before sleep
- Work: Pomodoro blocks with no phone`,
    excerpt: 'Tiny changes compound into remarkable results. 1% improvement daily = 37x better in a year.',
    folderId: '5',
    tags: [mockTags[4], mockTags[1]],
    isPinned: false,
    isStarred: true,
    isTrashed: false,
    isArchived: false,
    color: '#22c55e',
    collaborators: [],
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-04-05'),
    wordCount: 223,
    readTime: 2,
    versions: [],
  },
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and high-fidelity mockups for the new product landing page',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-06-01'),
    tags: ['design', 'marketing'],
    subtasks: [
      { id: 's1', title: 'Research competitors', completed: true },
      { id: 's2', title: 'Create wireframes', completed: true },
      { id: 's3', title: 'Design mockups', completed: false },
      { id: 's4', title: 'Developer handoff', completed: false },
    ],
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-22'),
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Build email and OAuth authentication with JWT tokens',
    status: 'todo',
    priority: 'urgent',
    dueDate: new Date('2024-05-30'),
    tags: ['engineering', 'security'],
    subtasks: [
      { id: 's5', title: 'Email/password auth', completed: false },
      { id: 's6', title: 'Google OAuth', completed: false },
      { id: 's7', title: 'GitHub OAuth', completed: false },
    ],
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-05-18'),
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples and schemas',
    status: 'review',
    priority: 'medium',
    dueDate: new Date('2024-06-10'),
    tags: ['documentation'],
    subtasks: [
      { id: 's8', title: 'Notes API docs', completed: true },
      { id: 's9', title: 'Auth API docs', completed: true },
      { id: 's10', title: 'Webhook docs', completed: false },
    ],
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-05-21'),
  },
  {
    id: '4',
    title: 'Set up monitoring & alerts',
    description: 'Configure Datadog/Sentry for production monitoring',
    status: 'done',
    priority: 'high',
    tags: ['devops', 'engineering'],
    subtasks: [
      { id: 's11', title: 'Error tracking', completed: true },
      { id: 's12', title: 'Performance monitoring', completed: true },
    ],
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-20'),
  },
  {
    id: '5',
    title: 'User interviews for Q3 planning',
    description: 'Conduct 10 user interviews to inform product roadmap',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date('2024-06-15'),
    tags: ['research', 'product'],
    subtasks: [],
    createdAt: new Date('2024-05-22'),
    updatedAt: new Date('2024-05-22'),
  },
  {
    id: '6',
    title: 'Performance optimization sprint',
    description: 'Reduce P95 response times below 200ms',
    status: 'todo',
    priority: 'low',
    tags: ['engineering', 'performance'],
    subtasks: [
      { id: 's13', title: 'Profile slow queries', completed: false },
      { id: 's14', title: 'Add caching layer', completed: false },
    ],
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
  },
]

export const mockAnalytics: Analytics = {
  totalNotes: 47,
  totalWords: 12480,
  notesThisWeek: 6,
  streakDays: 12,
  mostActiveDay: 'Tuesday',
  topTags: [
    { name: 'ideas', count: 15 },
    { name: 'work', count: 12 },
    { name: 'learning', count: 9 },
    { name: 'personal', count: 8 },
    { name: 'research', count: 6 },
    { name: 'design', count: 4 },
  ],
  activityData: [
    { date: 'Mon', count: 3 },
    { date: 'Tue', count: 7 },
    { date: 'Wed', count: 2 },
    { date: 'Thu', count: 5 },
    { date: 'Fri', count: 4 },
    { date: 'Sat', count: 1 },
    { date: 'Sun', count: 3 },
  ],
  writingGoal: { current: 8240, target: 10000 },
}
