# Writing style directives

Use this file when turning a raw idea into a blog post for `app/t`.

## Target Feel

The target voice is senior engineer plus senior writer:

- Clear position, not balanced mush.
- First-hand contact with the problem.
- Concrete examples before broad claims.
- Short paragraphs that move one idea at a time.
- Technical accuracy without hiding behind jargon.
- A real ending, not a summary paragraph.

The model is not "sound like Thorsten, Armin, or Sean." The model is: write with the authority of someone who touched the system, can name the tradeoff, and can explain why it matters.

## Core Shape

Most strong posts in this style follow this spine:

1. Concrete spark.
   Start with something that happened: a bug, tool, review, codebase, conversation, failed workflow, confusing tradeoff, or repeated annoyance.
2. Thesis.
   State the claim plainly by paragraph 2-4. Do not make the reader infer the point for too long.
3. Mechanism.
   Explain why the thing behaves that way. Name the system, incentives, constraints, or failure mode.
4. Example.
   Use a specific case: command, repo, architecture, metric, production failure, old project, or realistic scenario.
5. Counterpressure.
   Give the strongest objection. Say where your own claim stops working.
6. Practical judgment.
   Tell the reader what you would actually do.
7. Landing.
   End with the clarified stance, cost, decision, or unresolved tension.

## What To Copy From The Writers

Thorsten Ball:

- Treat programming as a craft with texture, not just productivity.
- Use simple sentences for big claims.
- Let enthusiasm show through exact detail.
- Prefer earned conviction over caveats.
- End by returning to the human reason the topic matters.

Armin Ronacher:

- Open from direct experience.
- Name your bias early when you have one.
- Move from tool behavior to system behavior.
- Use analogies only when they explain the mechanism.
- Keep unresolved tradeoffs visible.

Sean Goedecke:

- Make the claim sharp.
- Use boring but realistic examples.
- Explain what strong engineers do in practice.
- Break large arguments into titled sections.
- Anticipate objections and answer them directly.

## Victor-Specific Fixes

Current strengths:

- Good instincts for live tooling, agents, and developer workflow.
- Strong taste for concrete command-line work.
- Natural willingness to take a position.
- Best posts already improve when they include a vivid example, such as sandboxed shell access or quantum bugs.

Recurring issues to fix:

- Some openings start too abstractly. Start with a real scene or artifact.
- Some paragraphs stack several claims without proving the first one.
- Some posts end when the idea is finished, not when the reader has landed.
- Some claims would feel more senior with one more concrete case, number, command, or failure mode.
- Casual filler weakens authority: "really", "pretty", "a lot", "honestly", "kind of", "way more", "bigger deal than I can explain".

## Sentence Rules

- Prefer active voice.
- Make positive claims. Say what is true, not only what is not true.
- Replace vague nouns with concrete ones: tool, repo, PR, trace, sandbox, token, queue, deploy, permission, rollback.
- Put the important word at the end of the sentence.
- Cut throat-clearing.
- Use "I" when the authority comes from your experience.
- Use "we" only when you truly mean a shared engineering habit.

## Paragraph Rules

- One paragraph, one job.
- First sentence should usually tell the reader what the paragraph is doing.
- Use 2-5 sentence paragraphs for argument.
- Use one-line paragraphs only for pivots or emphasis.
- Every section should advance the claim, not merely decorate it.

## Evidence Rules

Before publishing, add at least two of these:

- A named tool, API, protocol, repo, library, or system.
- A specific failure mode.
- A realistic example with constraints.
- A before/after comparison.
- A number, date, version, count, or timing measurement.
- A tradeoff you personally faced.
- A case where your claim is false.

## Anti-Patterns

Avoid:

- "This is important because..." without showing the mechanism.
- "The future of..." unless the post proves it.
- Generic AI-writing words: leverage, robust, seamless, pivotal, crucial, unlock, landscape, foster, delve.
- Explaining every side so evenly that no judgment remains.
- Ending with "time will tell" or "it depends" unless the whole post earns that uncertainty.

## Pre-Publish Bar

A post is ready when:

- The thesis can be copied into one sentence.
- The first three paragraphs make a reader want the rest.
- Every section has a job.
- The strongest objection is present.
- The ending changes the reader's posture.
- A skeptical senior engineer would know what you actually believe.
