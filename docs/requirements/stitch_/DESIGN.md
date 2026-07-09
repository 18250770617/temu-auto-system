---
name: Slate Precision
colors:
  surface: '#0e141a'
  surface-dim: '#0e141a'
  surface-bright: '#333a40'
  surface-container-lowest: '#080f14'
  surface-container-low: '#161c22'
  surface-container: '#1a2026'
  surface-container-high: '#242b31'
  surface-container-highest: '#2f353c'
  on-surface: '#dde3eb'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dde3eb'
  inverse-on-surface: '#2b3137'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#83d7ff'
  on-tertiary: '#003547'
  tertiary-container: '#64bbe3'
  on-tertiary-container: '#004961'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#c0e8ff'
  tertiary-fixed-dim: '#7bd1fa'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d66'
  background: '#0e141a'
  on-background: '#dde3eb'
  surface-variant: '#2f353c'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system embodies a sophisticated, enterprise-grade aesthetic optimized for high-performance data environments and technical workflows. By shifting to a refined dark palette, the UI reduces eye strain and emphasizes information hierarchy through subtle luminance shifts rather than aggressive color.

The design style is a hybrid of **Modern Minimalism** and **Glassmorphism**. It relies on deep slate foundations, crisp typography, and semi-transparent overlays to create a sense of organized depth. The emotional response is one of reliability, technical mastery, and calm focus. Visual noise is strictly minimized, allowing the primary sky-blue accents to guide user intent with surgical precision.

## Colors

This design system utilizes a high-end "Slate-Dark" palette. The core experience is anchored by a subtle vertical gradient from `#0f172a` to `#111827`, providing a sense of grounding and immense digital space.

- **Primary:** `#38bdf8` (Sky Blue) is used exclusively for actionable elements, progress indicators, and "eyebrow" metadata.
- **Surface:** Component backgrounds use variations of `#1e293b` with high transparency to allow the background gradient to permeate the UI.
- **Text:** The primary content uses `#e2e8f0` for high legibility, while secondary text scales down to `#94a3b8`.
- **Borders:** A consistent `#334155` is used for structural definition, maintaining a crisp but low-friction visual boundary.

## Typography

The typography system is built entirely on **Inter**, chosen for its exceptional legibility in dark-mode interfaces and its systematic, neutral character. 

- **Headlines:** Use tighter letter-spacing and heavier weights to create a strong visual anchor.
- **Body:** Standardized at 14px and 16px for enterprise density without sacrificing readability.
- **Labels:** Small labels (eyebrows) should use the `label-sm` token, which incorporates uppercase styling and increased letter spacing to differentiate metadata from body content.
- **Rendering:** Ensure `antialiased` font smoothing is active to maintain the crispness of the white-on-dark text.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict adherence to a 4px baseline rhythm. This ensures that even complex data tables and multi-column dashboards remain mathematically balanced.

- **Desktop:** 12-column grid with 24px gutters. Content is typically capped at a max-width of 1440px to prevent excessive line lengths.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** Internal component padding should prioritize the `md` (16px) token for standard containers and `sm` (8px) for condensed data views.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Glassmorphism**, rather than traditional heavy shadows.

- **Level 0 (Base):** The slate background gradient.
- **Level 1 (Cards/Panels):** Surfaces use a solid `#1e293b` or a semi-transparent equivalent with a 1px border of `#334155`.
- **Level 2 (Modals/Popovers):** These use a backdrop blur (20px) and a slightly brighter border (`#475569`) to simulate physical proximity to the user.
- **Shadows:** When necessary for floating elements, use a very large, soft shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`.

## Shapes

The shape language is **Soft (Level 1)**. This provides a professional, geometric look that feels precise but avoids the harshness of pure 90-degree angles.

- **Standard Buttons/Inputs:** 4px (`0.25rem`) corner radius.
- **Cards/Containers:** 8px (`0.5rem`) corner radius.
- **Large Modals:** 12px (`0.75rem`) corner radius.
- **Status Pills:** Fully rounded (capsule) to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons use a solid `#38bdf8` fill with `#0f172a` text. Secondary buttons are transparent with a `#334155` border and `#e2e8f0` text.
- **Inputs:** Backgrounds are slightly darker than the card surface. The focus state uses a 1px border of `#38bdf8` with a subtle outer glow.
- **Chips/Badges:** Small, low-contrast capsules. Use a background of `rgba(56, 189, 248, 0.1)` with `#38bdf8` text for primary tags.
- **Cards:** Background `#1e293b` with a `#334155` border. No shadow in the default state; add a subtle glow on hover.
- **Data Tables:** Row separators use 1px `#334155`. Header cells use `label-sm` typography for a professional, dashboard-like feel.
- **Scrollbars:** Custom styled to be thin, using `#334155` for the track and `#475569` for the thumb to remain unobtrusive.