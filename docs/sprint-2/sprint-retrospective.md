# Sprint 2 Retrospective

## Date
30/08/2026

## Participants
- S.K.Hamsiga (Product Owner / QA & Testing)
- S Pirathap (Scrum Master / Database & Integration)
- Avishka M G D (Backend & API Development)
- Varshan (Frontend & UI Development)

## What Went Well?
- Successfully completed all 7 planned Sprint 2 user stories, delivering a high velocity of 23 story points.
- Defined API request/response specifications and payload formats prior to coding, significantly reducing frontend-backend integration friction compared to Sprint 1.
- Implemented robust database schemas with proper foreign key constraints, indexing, and cascading rules for support groups, memberships, discussions, and comments.
- QA test cases were designed and executed concurrently with feature completion, leading to faster bug detection and immediate fixes.
- Collaboration via Git feature branches and pull requests was disciplined, with fewer merge bottlenecks and clearer commit conventions.
- Jira board was updated with greater regularity during daily standups, providing strong sprint visibility for all team members.
- Delivered a cohesive user experience across group discovery, joining, and community discussion interactions.

## What Didn't Go Well?
- Committing to 23 story points placed significant workload pressure on the team toward the end of the sprint, particularly during final testing and edge case verification.
- Complex SQL queries involving multi-table joins (fetching discussions along with author metadata and live comment counts) caused initial latency and required query optimization.
- Client-side state synchronization for instant comment rendering without a full-screen reload required additional debugging time.
- Writing test reports for 7 user stories in parallel resulted in some documentation delays close to the sprint deadline.

## What Will We Improve in Sprint 3?
- Right-size the sprint commitment: Sprint 3 will be scoped to 15 story points (3 high-value stories at 5 story points each) to ensure sustainable pace and deeper focus on quality.
- Architect data privacy, anonymity flags, and security rules thoroughly during technical design before coding begins.
- Construct reusable mock data and test fixtures to accelerate test execution for 1-on-1 private messaging and privacy configurations.
- Optimize backend query payloads and database response shapes to keep mobile network requests lightweight and responsive.
- Maintain continuous documentation updates alongside pull request approvals rather than deferring reporting to the end of the sprint.

## Retrospective Conclusion
Sprint 2 was a major milestone for Peer Circles. The team demonstrated significant improvement in technical coordination, API contract definition, and cross-functional collaboration, successfully delivering the entire community and discussion foundation (23 story points). 

Addressing the lessons from this sprint—specifically balancing sprint workload, optimizing complex queries, and establishing security-first design patterns—positions the team well for Sprint 3, where privacy, safety, and private messaging will be the central focus.
