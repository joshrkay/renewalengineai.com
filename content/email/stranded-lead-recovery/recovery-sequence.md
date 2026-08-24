# Stranded-lead recovery sequence

For rows found in `MastermindInvite` during runbook Step 0 — people who
requested the guide (or an invite) between late April and now and never
heard back, because the notification email was silently disabled.

Rules of engagement: send personally, from Josh's own address, one lead
at a time — not through a campaign tool. These people asked us for
something and we went quiet; the fix is a human note, not a blast.
Merge fields: {first_name}, {requested} (e.g. "the 5 AI Automations
guide"), {agency} if known from the name/email domain, and {link} — pick
it from the row's `source` column:

| source starts with       | {requested}                        | {link} |
|--------------------------|------------------------------------|--------|
| free_guide / lead_magnet | the 5 AI Automations guide         | https://renewalengineai.com/free-guide/thank-you |
| future_of_insurance      | the Future of Insurance field manual | https://renewalengineai.com/future-of-insurance/read |
| mastermind (or anything else) | a Mastermind / community invite | no link — reply personally with invite details instead of a guide |

---

## Touch 1 — the honest apology (send day 0)

**Subject:** You asked for {requested} — we dropped the ball

Hi {first_name},

You requested {requested} from renewalengineai.com back in {month}, and
it never arrived. That's on us — a misconfigured notification meant your
request sat in our database without anyone seeing it. I'm the founder;
I found it this week while auditing the system, and I'd rather own that
plainly than pretend this is a "just checking in" email.

Here's what you asked for, no strings: {link}

And if the problem that made you look for it — renewals slipping, leads
going cold, follow-up eating your week — is still on your desk, I'll
trade you 30 minutes for the delay: a free strategy call where we look
at your book together and I tell you honestly whether automation is
worth it for your agency. Reply to this email or grab a time here:
https://renewalengineai.com/#pricing

Either way — sorry for the silence, and the guide's yours.

Josh
RenewalEngineAI

---

## Touch 2 — the useful nudge (day 4, only if no reply)

**Subject:** The one automation to start with

Hi {first_name},

No response needed to my last note — but since you originally asked
about AI automation, one concrete thing worth stealing regardless of
what tools you use:

Set up renewal reminders at 60/30/14/7 days before every X-date, pulled
straight from your AMS. It's the highest-impact automation we cover
because it attacks the biggest silent leak in most books — policies that
lapse from neglect, not price. The walkthrough is in what I sent you
({link}), and the math on what lapse actually costs is here:
https://renewalengineai.com/resources/renewal-retention-math-for-p-and-c-agencies

If you'd rather someone build it for you, that's literally what we do —
but the guide works whether or not we ever talk.

Josh

---

## Touch 3 — the clean close (day 10, only if no reply)

**Subject:** Closing the loop

Hi {first_name},

Last note from me. If the automation question went off the boil, no
harm — you know where the guide lives, and this address reaches me
directly if it comes back.

If it's still simmering: the fastest way to a real answer is the free
30-minute strategy call. We look at your AMS setup and your book, and
you leave with a straight read on whether automation moves your numbers
— from us or anyone else.

https://renewalengineai.com/#pricing

Thanks for your patience with us, {first_name}.

Josh

---

## Log

Track sends here (date, email, touch, outcome) the same way
outbound-sent-log.md does — or just BCC yourself and keep it in a
folder. The point is knowing who got touch 1 before touch 2 goes out.
