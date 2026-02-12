# Habits App – Design Reference

This folder contains the UI design reference for the Habits app. **All common components and pages should follow these specs** so the app matches the intended look and feel.

---

## Color Palette

Each color includes a **swatch** (actual color) and usage.

<table>
<tr>
<th>Swatch</th>
<th>Role</th>
<th>Hex</th>
<th>Where it’s used</th>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#4F46E5;border-radius:6px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle"></span></td>
<td><strong>Primary</strong></td>
<td><code>#4F46E5</code></td>
<td>Log In, Create Account, Get Started, primary buttons, links, selected filter pill, FAB, active nav</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#4338ca;border-radius:6px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle"></span></td>
<td><strong>Primary hover</strong></td>
<td><code>#4338ca</code></td>
<td>Button hover state</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#059669;border-radius:6px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle"></span></td>
<td><strong>Success</strong></td>
<td><code>#059669</code></td>
<td>"Mark Done", completed checkmarks, positive indicators</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#e5e7eb;border-radius:6px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle"></span></td>
<td><strong>Secondary</strong></td>
<td><code>#e5e7eb</code> / <code>#f3f4f6</code></td>
<td>Unselected filter pills ("Morning", "Evening"), "Skip Today", secondary buttons</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#374151;border-radius:6px;vertical-align:middle"></span></td>
<td><strong>Secondary text</strong></td>
<td><code>#374151</code> / <code>#6b7280</code></td>
<td>Body text, labels, unselected pill text</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#dc2626;border-radius:6px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle"></span></td>
<td><strong>Danger</strong></td>
<td><code>#dc2626</code></td>
<td>Delete, Log Out, Delete Account</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#f2f2f2;border-radius:6px;border:1px solid #e5e5e5;vertical-align:middle"></span></td>
<td><strong>Background</strong></td>
<td><code>#f2f2f2</code> / <code>#e5e5e5</code></td>
<td>Page background (auth, onboarding)</td>
</tr>
<tr>
<td><span style="display:inline-block;width:24px;height:24px;background:#ffffff;border-radius:6px;border:1px solid #e5e5e5;vertical-align:middle"></span></td>
<td><strong>Card</strong></td>
<td><code>#ffffff</code></td>
<td>Form cards, content cards, list items</td>
</tr>
</table>

---

## Typography

Examples use a **light background** so dark text is visible in dark themes.

| Level | Style | Example |
|-------|--------|--------|
| **App title** | Large, bold, dark | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;font-size:1.5em;font-weight:700;color:#111827">Habits</span> |
| **Tagline** | Smaller, gray | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;font-size:0.95em;color:#6b7280">Welcome back</span> |
| **Section title** | Bold, dark | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;font-weight:700;color:#111827">Today's Habits</span> |
| **Label** | Regular, dark gray | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;color:#374151">Email address</span> |
| **Placeholder** | Light gray | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;color:#9ca3af">jane@example.com</span> |
| **Link** | Primary color, medium weight | <span style="display:inline-block;background:#ffffff;padding:8px 14px;border-radius:6px;color:#4F46E5;font-weight:500">Sign up</span> |

- **Font stack:** `system-ui, Avenir, Helvetica, Arial, sans-serif`

---

## Buttons (visual preview)

How each variant should look:

| Variant | Preview |
|--------|--------|
| **Primary** | <span style="display:inline-block;background:#4F46E5;color:white;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px">Log In</span> |
| **Secondary** | <span style="display:inline-block;background:#e5e7eb;color:#374151;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px">Morning</span> <span style="display:inline-block;background:#e5e7eb;color:#374151;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px">Evening</span> |
| **Success** | <span style="display:inline-block;background:#059669;color:white;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px">✓ Mark Done</span> |
| **Danger** | <span style="display:inline-block;background:#dc2626;color:white;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px">Delete</span> |
| **FAB** | <span style="display:inline-block;width:56px;height:56px;background:#4F46E5;color:white;font-size:24px;border-radius:50%;text-align:center;line-height:56px">+</span> |

- **Primary:** Full width in forms; slightly taller than inputs.
- **Rounded:** Same as inputs/cards (~8px, e.g. `rounded-lg`).

---

## Inputs

Rough shape (concept only):

```
┌─────────────────────────────────────────┐
│  Email address                          │
│  ┌───────────────────────────────────┐  │
│  │ jane@example.com                  │  │  ← white bg, light gray border, rounded
│  └───────────────────────────────────┘  │
│                                         │
│  Password                               │
│  ┌───────────────────────────────────┐  │
│  │ ••••••••                       👁  │  │  ← eye icon for visibility toggle
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- White background, light gray border, rounded corners (match buttons/cards).
- Placeholder: light gray. Optional: label above, helper text below (e.g. password strength).

---

## Cards & Containers

```
  ┌──────────────────────────────────────────────────┐
  │  ▎  Drink Water                          [ ✓ ]   │  ← left color bar (yellow/blue/green)
  │     MORNING  5 days                              │
  └──────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────┐
  │  ▎  Read 10 Pages                        [ ○ ]   │
  │     EVENING  12 days                             │
  └──────────────────────────────────────────────────┘
```

- **All cards:** White, rounded corners, subtle shadow.
- **Form cards:** Centered on light gray background.
- **Habit cards:** Optional **left edge color bar** (yellow / blue / green / gray by category).

---

## Reusable Patterns

| Pattern | Visual |
|--------|--------|
| **Filter pills** | <span style="background:#4F46E5;color:white;padding:6px 14px;border-radius:999px;font-size:13px">All</span> <span style="background:#e5e7eb;color:#374151;padding:6px 14px;border-radius:999px;font-size:13px">Morning</span> <span style="background:#e5e7eb;color:#374151;padding:6px 14px;border-radius:999px;font-size:13px">Evening</span> |
| **Tags / badges** | <span style="background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:999px;font-size:12px">MORNING</span> <span style="background:#d1fae5;color:#065f46;padding:4px 10px;border-radius:999px;font-size:12px">Done</span> <span style="background:#e5e7eb;color:#4b5563;padding:4px 10px;border-radius:999px;font-size:12px">Skipped</span> |
| **Checkbox** | Checked: <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#4F46E5;color:white;border-radius:50%;font-size:14px">✓</span> &nbsp; Unchecked: <span style="display:inline-flex;width:24px;height:24px;border:2px solid #d1d5db;border-radius:50%"></span> |
| **Toggle** | On: <span style="display:inline-block;width:44px;height:24px;background:#4F46E5;border-radius:999px;position:relative"></span> &nbsp; Off: <span style="display:inline-block;width:44px;height:24px;background:#e5e7eb;border-radius:999px"></span> |
| **Progress dots** | <span style="display:inline-block;width:8px;height:8px;background:#4F46E5;border-radius:50%"></span> <span style="display:inline-block;width:8px;height:8px;background:#d1d5db;border-radius:50%"></span> <span style="display:inline-block;width:8px;height:8px;background:#d1d5db;border-radius:50%"></span> <span style="display:inline-block;width:8px;height:8px;background:#d1d5db;border-radius:50%"></span> |

- **Bottom nav:** White bar; active = primary color; inactive = gray.
- **Progress indicator:** One dot primary (current step), rest gray.

---

## Reference Screens (images in this folder)

| Screen | File | What to check |
|--------|------|----------------|
| Login | `login-page.png` | Auth form, primary button, link style |
| Sign up | `signup_page.png` | Inputs with labels, primary button |
| Dashboard | `dashboard.png` | Stats cards, filter pills, habit list, FAB, bottom nav |
| Habit detail | `detail-page.png` | "Mark Done" (green), "Skip Today" (gray), stats, calendar, tags |
| Settings | `settings_page.png` | Sections, toggles, secondary/danger text |
| Onboarding | `onboarding.png` | Cards, primary CTA, progress dots, secondary link |

When adding or changing **common components** (Button, Input, Modal, etc.), use this file and the reference images so styling stays consistent.
