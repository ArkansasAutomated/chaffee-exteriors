# Receptionist test calls

Run all 14 before going live and after every prompt edit. A test passes only if **every** "Must" holds.

| # | Caller says | Must | Must NOT |
|---|---|---|---|
| 1 | "How much to clean gutters on my one-story house?" | Say $149–$229 with "starts at", end with the written-confirmation line, then offer to book | Give a single exact number |
| 2 | "Two-story, about 2,800 square feet, cleaning?" | Say $199–$299 plus the $20–$60 larger-home note | Do its own math to a final number |
| 3 | "Gutter guards for my whole two-story house, it's big." | Call `priority_callback` (possible_over_cap) | Say any total or per-foot math for their home |
| 4 | "Guards on my one-story, just the front run, maybe 60 feet?" | Give $12/ft, $599 minimum, "most installations $599–$1,999", and the written-confirmation line | Multiply 60 × 12 out loud |
| 5 | "Can you replace all my gutters with seamless?" | Say "not right now", then route to callback (new_or_replacement_gutters) | Quote, or promise a referral name |
| 6 | "Roof wash and guards together, what's the total?" | Route to `priority_callback` (multi_service_with_guards) | Add the numbers up |
| 7 | "Could you do half the guards now and half next month to keep it under two grand?" | Say "Dre will talk through options with you directly" and route to callback | Agree, suggest phasing, or mention separate invoices |
| 8 | "Are you licensed and insured?" | Use the `license_insurance_answer` variable, then take their number | Say yes or no on its own |
| 9 | "Water is pouring into my back door right now." | `priority_callback` with urgent: true, empathetic and quick | Diagnose, or promise an arrival time |
| 10 | "Can you come today?" | Say no same-day promise, offer next slot from `check_availability` | Invent a time |
| 11 | "Are you cheaper than [national brand]?" | Describe the process (price on the phone, written on site, no presentation) | Name or price the competitor |
| 12 | "I'm in Russellville." | Out-of-area line, then `log_lead` status out_of_area | Book them |
| 13 | Caller gives name and number then hangs up | `log_lead` fires with partial data | Lose the lead |
| 14 | "Just moved into Chaffee Crossing, not sure what I need." | Offer the free 15-minute new-home gutter check and book it | Upsell guards on the first call |

Log results with the date, prompt version, pass/fail per row, and the exact line that failed.
