---
title: Risk Flagging Workflows
module: 3
order: 3
duration: 8
---

# Risk Flagging Workflows

Every experienced agent has developed a gut for the applications that are going to be trouble. Claims-heavy, poorly maintained fleet, shaky loss runs, strange business model. That gut is valuable, but it's also slow and inconsistent. AI can do a first pass on every application, flag the risks, and leave your gut free for the harder judgment calls.

## What you're flagging
Risk flagging is not underwriting. You are not making the binding decision. You are generating a list of "things worth asking the client about before we go deep" so that your time investment matches the likelihood of a successful placement.

The flags that matter vary by line of business, but a good starter list for commercial applications includes these.

Loss ratio trending up over the last three years. Multiple claims in a single year. Gaps in prior coverage. Operations outside your stated appetite. Revenue or payroll inconsistencies across documents. Missing or incomplete safety program information. Recent ownership changes. Workers comp classification codes that don't match the operations description.

Each one of these is a yellow flag. Three or more and you have a red flag. The point is not to decline. The point is to ask the right questions before you waste an hour.

## The flagging prompt
Here is a prompt that runs on an extracted application plus loss runs.

> You are a risk flagging assistant for an independent insurance agent. Read the application and loss run data below. Flag any items that should be verified or discussed with the client before the agent spends significant time on this submission. Organize the flags into three categories: loss experience, operations fit, and documentation issues. For each flag, state the specific data point that triggered it. Do not make a recommendation to bind or decline.
>
> Application data: {extracted_application_json}
> Loss runs: {extracted_loss_runs_json}
> Agency appetite: {your_appetite_description}

Run this on every new commercial submission. Review the flags. Decide whether to proceed with a conversation, ask for additional documentation, or pass.

## The 15-minute rule
A practical rule from agencies that have run this workflow for a year: if the AI flag review plus your own initial read takes more than 15 minutes and you still can't see a path to placement, pass. You are not obligated to quote every submission that walks in the door. Protecting your time is part of running a profitable agency.

## Building a flag library
Over time, your agency develops a library of flag patterns specific to your appetite and your carriers. Every time you take a submission that had an unflagged issue, add a new flag rule to your prompt. Every time the AI flags something that turned out to be a non-issue, loosen that rule.

After six months of this, your flag prompt becomes a real competitive asset. It encodes your agency's accumulated underwriting wisdom in a form that runs in seconds on every new submission.

## The human in the loop stays
Risk flagging is helpful precisely because a human is still making the call. The AI is not telling you to bind or decline. It is handing you a sharper pencil. You decide what to write with it.

**Do this today:** Take your three most recent commercial submissions and run them through the flagging prompt. Compare the flags to what your gut told you. You will find at least one item on each submission that your AI caught and you missed, or vice versa. That is the learning.
