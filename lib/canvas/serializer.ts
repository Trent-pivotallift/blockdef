import type { DiagramNode, Connection } from '@/types/diagram'

// ── Helpers ───────────────────────────────────────────────────────────────

/** Wrap name in single quotes if it contains non-identifier characters. */
function q(name: string): string {
  return /^[a-zA-Z_]\w*$/.test(name) ? name : `'${name}'`
}

/** Derive a KerML part-name identifier from a display name.
 *  "AOOSTAR Gem 12" → "aoostar_gem_12"   "RTX 4090" → "rtx_4090" */
function toId(name: string): string {
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return id || 'element'
}

// ── Serializer ────────────────────────────────────────────────────────────

/**
 * Converts the current canvas state to a KerML-subset string.
 * Read-only — no side effects.
 */
export function serializeToKerML(
  nodes: DiagramNode[],
  connections: Connection[]
): string {
  if (nodes.length === 0) return ''

  const sections: string[] = []
  const byId = new Map(nodes.map(n => [n.id, n]))

  const packages  = nodes.filter(n => n.type === 'package')
  const blocks    = nodes.filter(n => n.type === 'block')
  const actions   = nodes.filter(n => n.type === 'action')
  const ports     = nodes.filter(n => n.type === 'port')

  // ── Packages ──────────────────────────────────────────────────────────
  if (packages.length > 0) {
    sections.push(packages.map(p => `package ${q(p.name)};`).join('\n'))
  }

  // ── Blocks (with nested parts + flow ports) ───────────────────────────
  for (const block of blocks) {
    const bodyLines: string[] = []

    // Composed parts: composition connections where this block is the source
    const composedParts = connections
      .filter(c => c.type === 'composition' && c.sourceId === block.id)
      .map(c => byId.get(c.targetId))
      .filter((n): n is DiagramNode => n != null)

    for (const part of composedParts) {
      bodyLines.push(`    part ${toId(part.name)} : ${q(part.name)};`)
    }

    // Flow ports owned by this block (parentId set on placement)
    const ownedPorts = ports.filter(p => p.parentId === block.id)
    for (const port of ownedPorts) {
      const dir = port.portDirection ?? 'inout'
      bodyLines.push(`    ${dir} flow port ${q(port.name)};`)
    }

    if (bodyLines.length === 0) {
      sections.push(`block def ${q(block.name)};`)
    } else {
      sections.push(`block def ${q(block.name)} {\n${bodyLines.join('\n')}\n}`)
    }
  }

  // ── Standalone flow ports (not attached to a block) ───────────────────
  const standalonePorts = ports.filter(p => !p.parentId)
  if (standalonePorts.length > 0) {
    sections.push(
      standalonePorts
        .map(p => `${p.portDirection ?? 'inout'} flow port ${q(p.name)};`)
        .join('\n')
    )
  }

  // ── Actions ───────────────────────────────────────────────────────────
  if (actions.length > 0) {
    sections.push(actions.map(a => `action def ${q(a.name)};`).join('\n'))
  }

  // ── Connections (non-composition) ─────────────────────────────────────
  const connLines: string[] = []

  for (const conn of connections) {
    if (conn.type === 'composition') continue // already expressed as parts above

    const src = byId.get(conn.sourceId)
    const tgt = byId.get(conn.targetId)
    if (!src || !tgt) continue

    if (conn.type === 'allocation') {
      connLines.push(`allocate ${q(src.name)} to ${q(tgt.name)};`)
    } else {
      // association: action→action = succession, otherwise connect
      if (src.type === 'action' && tgt.type === 'action') {
        connLines.push(`succession ${q(src.name)} then ${q(tgt.name)};`)
      } else {
        connLines.push(`connect ${q(src.name)} to ${q(tgt.name)};`)
      }
    }
  }

  if (connLines.length > 0) {
    sections.push(connLines.join('\n'))
  }

  return sections.join('\n\n')
}
