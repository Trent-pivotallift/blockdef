// Conventional SysML/UML SVG symbols for toolbar and node headers.
// All icons use currentColor so they inherit the button's text color.

interface IconProps {
  className?: string
}

export function IconPointer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 2 L4 14 L7.5 10.5 L10 16 L12 15 L9.5 9.5 L14 9.5 Z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// Package: rectangle with tab protruding from top-left (OMG SysML §7.3.3)
export function IconPackage({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="1" y="6" width="18" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="2" width="7" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

// Block: compartmented rectangle (name compartment + property compartment)
export function IconBlock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="1" y="2" width="18" height="16" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="1" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="1" />
      <text x="10" y="6.5" textAnchor="middle" fontSize="4" fill="currentColor" fontFamily="monospace">«block»</text>
    </svg>
  )
}

// Flow Port: small square with ⊠ (X diagonals) — SysML nonatomic flow port
export function IconPort({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      {/* Port square */}
      <rect x="5" y="5" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* X diagonals */}
      <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1" />
      <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

// Action: rounded rectangle (UML activity node)
export function IconAction({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="1" y="5" width="18" height="10" rx="4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

// Association: plain line with open arrowhead
export function IconAssociation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <line x1="1" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 6 L19 10 L11 14" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

// Composition: filled diamond at source + line (OMG SysML *--)
export function IconComposition({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <polygon points="1,10 5,6 9,10 5,14" fill="currentColor" />
      <line x1="9" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

// Allocation: dashed line with open arrowhead (<<allocate>>)
export function IconAllocation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <line x1="1" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2" />
      <path d="M11 6 L19 10 L11 14" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <text x="10" y="8" textAnchor="middle" fontSize="3.5" fill="currentColor" fontFamily="monospace">«allocate»</text>
    </svg>
  )
}

// Eraser: diagonal rectangle (classic eraser shape)
export function IconEraser({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <rect x="4" y="8" width="14" height="7" rx="1"
        transform="rotate(-20 11 11.5)"
        stroke="currentColor" strokeWidth="1.3" />
      <line x1="2" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

// Map from ToolType to SysML SVG component
export const SYSML_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  pointer:     IconPointer,
  package:     IconPackage,
  block:       IconBlock,
  port:        IconPort,
  action:      IconAction,
  association: IconAssociation,
  composition: IconComposition,
  allocation:  IconAllocation,
  eraser:      IconEraser,
}
