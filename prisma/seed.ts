import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to build node/connection lists cleanly
function pkg(id: string, name: string, x: number, y: number) {
  return { id, type: 'package', name, x, y }
}
function blk(id: string, name: string, x: number, y: number) {
  return { id, type: 'block', name, x, y }
}
function port(id: string, name: string, x: number, y: number) {
  return { id, type: 'port', name, x, y }
}
function action(id: string, name: string, x: number, y: number) {
  return { id, type: 'action', name, x, y }
}
function conn(id: string, sourceId: string, targetId: string, type: string) {
  return { id, sourceId, targetId, type }
}

const approvedDiagrams = [

  // ── Exercise 1: Homelab Infrastructure ──────────────────────────────────

  {
    exerciseSlug: 'homelab-infrastructure',
    stageIndex: 0,
    title: 'Homelab Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('h1-p1', 'Homelab Cluster', 100, 80),
        pkg('h1-p2', 'Requirements',    300, 80),
        pkg('h1-p3', 'Structure',        500, 80),
        pkg('h1-p4', 'Behavior',         100, 220),
        pkg('h1-p5', 'Component Library',300, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'homelab-infrastructure',
    stageIndex: 1,
    title: 'Homelab Block Definition — Reference',
    diagramJson: {
      nodes: [
        blk('h2-b1', 'Homelab Server',  300, 60),
        blk('h2-b2', 'AOOSTAR Gem 12',  100, 220),
        blk('h2-b3', 'RTX 4090',        300, 220),
        blk('h2-b4', 'TP-Link Switch',  500, 220),
      ],
      connections: [
        conn('h2-c1', 'h2-b1', 'h2-b2', 'composition'),
        conn('h2-c2', 'h2-b1', 'h2-b3', 'composition'),
        conn('h2-c3', 'h2-b1', 'h2-b4', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'homelab-infrastructure',
    stageIndex: 2,
    title: 'Homelab Internal Block Diagram — Reference',
    diagramJson: {
      nodes: [
        blk('h3-b1',  'AOOSTAR Gem 12', 100, 100),
        blk('h3-b2',  'RTX 4090',       100, 240),
        port('h3-p1', 'Socket 1',        380, 100),
        port('h3-p2', 'Socket 2',        380, 240),
      ],
      connections: [
        conn('h3-c1', 'h3-b1', 'h3-p1', 'allocation'),
        conn('h3-c2', 'h3-b2', 'h3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'homelab-infrastructure',
    stageIndex: 3,
    title: 'Homelab Traffic Routing Activity — Reference',
    diagramJson: {
      nodes: [
        action('h4-a1', 'Internet',      100, 160),
        action('h4-a2', 'TP-Link Switch',320, 160),
        action('h4-a3', 'AOOSTAR',       540, 160),
      ],
      connections: [
        conn('h4-c1', 'h4-a1', 'h4-a2', 'association'),
        conn('h4-c2', 'h4-a2', 'h4-a3', 'association'),
      ],
    },
  },

  // ── Exercise 2: Deep Space Network ──────────────────────────────────────

  {
    exerciseSlug: 'deep-space-network',
    stageIndex: 0,
    title: 'DSN Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('d1-p1', 'Ground Segment', 100, 80),
        pkg('d1-p2', 'Space Segment',  340, 80),
        pkg('d1-p3', 'Requirements',   100, 220),
        pkg('d1-p4', 'Behavior',       340, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'deep-space-network',
    stageIndex: 1,
    title: 'DSN Space Segment Blocks — Reference',
    diagramJson: {
      nodes: [
        blk('d2-b1', 'Orbiter',          300, 60),
        blk('d2-b2', 'Telemetry System', 100, 220),
        blk('d2-b3', 'Transceiver',      300, 220),
        blk('d2-b4', 'Antenna Array',    500, 220),
      ],
      connections: [
        conn('d2-c1', 'd2-b1', 'd2-b2', 'composition'),
        conn('d2-c2', 'd2-b1', 'd2-b3', 'composition'),
        conn('d2-c3', 'd2-b1', 'd2-b4', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'deep-space-network',
    stageIndex: 2,
    title: 'DSN Transceiver Wiring — Reference',
    diagramJson: {
      nodes: [
        blk('d3-b1',  'Amplifier', 100, 100),
        blk('d3-b2',  'Modem',     100, 240),
        port('d3-p1', 'RF In',     380, 100),
        port('d3-p2', 'RF Out',    380, 240),
      ],
      connections: [
        conn('d3-c1', 'd3-b1', 'd3-p1', 'allocation'),
        conn('d3-c2', 'd3-b2', 'd3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'deep-space-network',
    stageIndex: 3,
    title: 'DSN Downlink Activity — Reference',
    diagramJson: {
      nodes: [
        action('d4-a1', 'Collect Data',       100, 160),
        action('d4-a2', 'Modulate Signal',    320, 160),
        action('d4-a3', 'Transmit to Ground', 540, 160),
      ],
      connections: [
        conn('d4-c1', 'd4-a1', 'd4-a2', 'association'),
        conn('d4-c2', 'd4-a2', 'd4-a3', 'association'),
      ],
    },
  },

  // ── Exercise 3: Autonomous Vehicle Perception ────────────────────────────

  {
    exerciseSlug: 'av-perception',
    stageIndex: 0,
    title: 'AV Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('a1-p1', 'Sensing',       100, 80),
        pkg('a1-p2', 'Processing',    340, 80),
        pkg('a1-p3', 'Actuation',     580, 80),
        pkg('a1-p4', 'Safety',        100, 220),
        pkg('a1-p5', 'Requirements',  340, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'av-perception',
    stageIndex: 1,
    title: 'AV Sensor Block Hierarchy — Reference',
    diagramJson: {
      nodes: [
        blk('a2-b1', 'AV Platform',   340, 60),
        blk('a2-b2', 'LiDAR Unit',    100, 220),
        blk('a2-b3', 'Camera Array',  280, 220),
        blk('a2-b4', 'Radar Module',  460, 220),
        blk('a2-b5', 'ECU',           640, 220),
      ],
      connections: [
        conn('a2-c1', 'a2-b1', 'a2-b2', 'composition'),
        conn('a2-c2', 'a2-b1', 'a2-b3', 'composition'),
        conn('a2-c3', 'a2-b1', 'a2-b4', 'composition'),
        conn('a2-c4', 'a2-b1', 'a2-b5', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'av-perception',
    stageIndex: 2,
    title: 'AV Sensor Bus Allocation — Reference',
    diagramJson: {
      nodes: [
        blk('a3-b1',  'LiDAR Unit',   100, 100),
        blk('a3-b2',  'Radar Module', 100, 240),
        port('a3-p1', 'Ethernet',     380, 100),
        port('a3-p2', 'CAN Bus',      380, 240),
      ],
      connections: [
        conn('a3-c1', 'a3-b1', 'a3-p1', 'allocation'),
        conn('a3-c2', 'a3-b2', 'a3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'av-perception',
    stageIndex: 3,
    title: 'AV Perception Pipeline — Reference',
    diagramJson: {
      nodes: [
        action('a4-a1', 'Capture Sensor Data', 80,  160),
        action('a4-a2', 'Fuse Point Clouds',   280, 160),
        action('a4-a3', 'Classify Objects',    480, 160),
        action('a4-a4', 'Send to Planner',     680, 160),
      ],
      connections: [
        conn('a4-c1', 'a4-a1', 'a4-a2', 'association'),
        conn('a4-c2', 'a4-a2', 'a4-a3', 'association'),
        conn('a4-c3', 'a4-a3', 'a4-a4', 'association'),
      ],
    },
  },

  // ── Exercise 4: Medical Infusion Pump ────────────────────────────────────

  {
    exerciseSlug: 'infusion-pump',
    stageIndex: 0,
    title: 'Infusion Pump Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('i1-p1', 'Safety',         100, 80),
        pkg('i1-p2', 'Fluid Delivery', 340, 80),
        pkg('i1-p3', 'Alarming',       580, 80),
        pkg('i1-p4', 'Software',       100, 220),
        pkg('i1-p5', 'Requirements',   340, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'infusion-pump',
    stageIndex: 1,
    title: 'Infusion Pump Hardware Blocks — Reference',
    diagramJson: {
      nodes: [
        blk('i2-b1', 'Infusion Pump', 340, 60),
        blk('i2-b2', 'Pump Motor',    100, 220),
        blk('i2-b3', 'Flow Sensor',   280, 220),
        blk('i2-b4', 'Alarm Module',  460, 220),
        blk('i2-b5', 'Display Unit',  640, 220),
      ],
      connections: [
        conn('i2-c1', 'i2-b1', 'i2-b2', 'composition'),
        conn('i2-c2', 'i2-b1', 'i2-b3', 'composition'),
        conn('i2-c3', 'i2-b1', 'i2-b4', 'composition'),
        conn('i2-c4', 'i2-b1', 'i2-b5', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'infusion-pump',
    stageIndex: 2,
    title: 'Infusion Pump Control Interface — Reference',
    diagramJson: {
      nodes: [
        blk('i3-b1',  'Pump Motor',    100, 100),
        blk('i3-b2',  'Flow Sensor',   100, 240),
        port('i3-p1', 'Control Signal',380, 100),
        port('i3-p2', 'Feedback Out',  380, 240),
      ],
      connections: [
        conn('i3-c1', 'i3-b1', 'i3-p1', 'allocation'),
        conn('i3-c2', 'i3-b2', 'i3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'infusion-pump',
    stageIndex: 3,
    title: 'Infusion Pump Delivery Cycle — Reference',
    diagramJson: {
      nodes: [
        action('i4-a1', 'Check Flow Rate',        80,  160),
        action('i4-a2', 'Compare to Prescription',300, 160),
        action('i4-a3', 'Adjust Motor Speed',     520, 160),
        action('i4-a4', 'Log Event',              740, 160),
      ],
      connections: [
        conn('i4-c1', 'i4-a1', 'i4-a2', 'association'),
        conn('i4-c2', 'i4-a2', 'i4-a3', 'association'),
        conn('i4-c3', 'i4-a3', 'i4-a4', 'association'),
      ],
    },
  },

  // ── Exercise 5: Satellite Power Subsystem ────────────────────────────────

  {
    exerciseSlug: 'satellite-power',
    stageIndex: 0,
    title: 'Satellite Power Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('s1-p1', 'Power Generation', 100, 80),
        pkg('s1-p2', 'Storage',          340, 80),
        pkg('s1-p3', 'Distribution',     580, 80),
        pkg('s1-p4', 'Thermal',          100, 220),
        pkg('s1-p5', 'Requirements',     340, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'satellite-power',
    stageIndex: 1,
    title: 'Satellite Power Block Hierarchy — Reference',
    diagramJson: {
      nodes: [
        blk('s2-b1', 'Power Control Unit', 300, 60),
        blk('s2-b2', 'Solar Array',        100, 220),
        blk('s2-b3', 'Battery Bank',       300, 220),
        blk('s2-b4', 'Bus Regulator',      500, 220),
      ],
      connections: [
        conn('s2-c1', 's2-b1', 's2-b2', 'composition'),
        conn('s2-c2', 's2-b1', 's2-b3', 'composition'),
        conn('s2-c3', 's2-b1', 's2-b4', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'satellite-power',
    stageIndex: 2,
    title: 'Satellite DC Bus Allocation — Reference',
    diagramJson: {
      nodes: [
        blk('s3-b1',  'Solar Array',   100, 100),
        blk('s3-b2',  'Bus Regulator', 100, 240),
        port('s3-p1', 'Charge Port',   380, 100),
        port('s3-p2', '28V Bus',       380, 240),
      ],
      connections: [
        conn('s3-c1', 's3-b1', 's3-p1', 'allocation'),
        conn('s3-c2', 's3-b2', 's3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'satellite-power',
    stageIndex: 3,
    title: 'Satellite Power Management Activity — Reference',
    diagramJson: {
      nodes: [
        action('s4-a1', 'Collect Solar Energy',     80,  160),
        action('s4-a2', 'Regulate Voltage',         300, 160),
        action('s4-a3', 'Distribute to Loads',      520, 160),
        action('s4-a4', 'Monitor State of Charge',  740, 160),
      ],
      connections: [
        conn('s4-c1', 's4-a1', 's4-a2', 'association'),
        conn('s4-c2', 's4-a2', 's4-a3', 'association'),
        conn('s4-c3', 's4-a3', 's4-a4', 'association'),
      ],
    },
  },

  // ── Exercise 6: Railway Signaling System ─────────────────────────────────

  {
    exerciseSlug: 'railway-signaling',
    stageIndex: 0,
    title: 'Railway Package Architecture — Reference',
    diagramJson: {
      nodes: [
        pkg('r1-p1', 'Interlocking',  100, 80),
        pkg('r1-p2', 'Track Circuit', 340, 80),
        pkg('r1-p3', 'Signaling',     580, 80),
        pkg('r1-p4', 'Communication', 100, 220),
        pkg('r1-p5', 'Requirements',  340, 220),
      ],
      connections: [],
    },
  },

  {
    exerciseSlug: 'railway-signaling',
    stageIndex: 1,
    title: 'Railway Interlocking Blocks — Reference',
    diagramJson: {
      nodes: [
        blk('r2-b1', 'Interlocking System', 340, 60),
        blk('r2-b2', 'Route Controller',    100, 220),
        blk('r2-b3', 'Signal Head',         280, 220),
        blk('r2-b4', 'Point Machine',       460, 220),
        blk('r2-b5', 'Track Detector',      640, 220),
      ],
      connections: [
        conn('r2-c1', 'r2-b1', 'r2-b2', 'composition'),
        conn('r2-c2', 'r2-b1', 'r2-b3', 'composition'),
        conn('r2-c3', 'r2-b1', 'r2-b4', 'composition'),
        conn('r2-c4', 'r2-b1', 'r2-b5', 'composition'),
      ],
    },
  },

  {
    exerciseSlug: 'railway-signaling',
    stageIndex: 2,
    title: 'Railway Signal Interface — Reference',
    diagramJson: {
      nodes: [
        blk('r3-b1',  'Signal Head',    100, 100),
        blk('r3-b2',  'Track Detector', 100, 240),
        port('r3-p1', 'Command Port',   380, 100),
        port('r3-p2', 'Status Port',    380, 240),
      ],
      connections: [
        conn('r3-c1', 'r3-b1', 'r3-p1', 'allocation'),
        conn('r3-c2', 'r3-b2', 'r3-p2', 'allocation'),
      ],
    },
  },

  {
    exerciseSlug: 'railway-signaling',
    stageIndex: 3,
    title: 'Railway Route Setting Activity — Reference',
    diagramJson: {
      nodes: [
        action('r4-a1', 'Request Route',     80,  160),
        action('r4-a2', 'Check Track Clear', 270, 160),
        action('r4-a3', 'Set Points',        460, 160),
        action('r4-a4', 'Clear Signal',      650, 160),
        action('r4-a5', 'Confirm Route',     840, 160),
      ],
      connections: [
        conn('r4-c1', 'r4-a1', 'r4-a2', 'association'),
        conn('r4-c2', 'r4-a2', 'r4-a3', 'association'),
        conn('r4-c3', 'r4-a3', 'r4-a4', 'association'),
        conn('r4-c4', 'r4-a4', 'r4-a5', 'association'),
      ],
    },
  },
]

async function main() {
  console.log('Seeding approved diagrams...')

  // Upsert by exerciseSlug + stageIndex so re-running is safe
  for (const diagram of approvedDiagrams) {
    await prisma.approvedDiagram.upsert({
      where: {
        exerciseSlug_stageIndex: {
          exerciseSlug: diagram.exerciseSlug,
          stageIndex: diagram.stageIndex,
        },
      },
      update: { title: diagram.title, diagramJson: diagram.diagramJson },
      create: diagram,
    })
    console.log(`  ✓ ${diagram.exerciseSlug} stage ${diagram.stageIndex}`)
  }

  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
