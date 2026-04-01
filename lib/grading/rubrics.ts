import type { RubricDefinition } from '@/types/grading'

const rubrics: Record<string, RubricDefinition> = {

  // ── Exercise 1: Homelab Infrastructure ──────────────────────────────────

  'homelab-infrastructure:0': {
    requiredNodes: [
      { name: 'Homelab Cluster', type: 'package' },
      { name: 'Requirements', type: 'package' },
      { name: 'Structure', type: 'package' },
      { name: 'Behavior', type: 'package' },
      { name: 'Component Library', type: 'package' },
    ],
    uiCheck: ['package', 'containment'],
  },

  'homelab-infrastructure:1': {
    requiredNodes: [
      { name: 'Homelab Server', type: 'block' },
      { name: 'AOOSTAR Gem 12', type: 'block' },
      { name: 'RTX 4090', type: 'block' },
      { name: 'TP-Link Switch', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Homelab Server', to: 'AOOSTAR Gem 12', connectionType: 'composition' },
      { from: 'Homelab Server', to: 'RTX 4090', connectionType: 'composition' },
      { from: 'Homelab Server', to: 'TP-Link Switch', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'homelab-infrastructure:2': {
    requiredNodes: [
      { name: 'Socket 1', type: 'port' },
      { name: 'Socket 2', type: 'port' },
    ],
    requiredConnections: [
      { from: 'AOOSTAR Gem 12', to: 'Socket 1', connectionType: 'allocation' },
      { from: 'RTX 4090', to: 'Socket 2', connectionType: 'allocation' },
    ],
    forbiddenNodes: [
      { name: 'Socket 3' },
      { name: 'Socket 4' },
    ],
    uiCheck: ['port', 'ibd'],
  },

  'homelab-infrastructure:3': {
    requiredNodes: [
      { name: 'Internet', type: 'action' },
      { name: 'TP-Link Switch', type: 'action' },
      { name: 'AOOSTAR', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Internet', to: 'TP-Link Switch', connectionType: 'association' },
      { from: 'TP-Link Switch', to: 'AOOSTAR', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },

  // ── Exercise 2: Deep Space Network ─────────────────────────────────────

  'deep-space-network:0': {
    requiredNodes: [
      { name: 'Ground Segment', type: 'package' },
      { name: 'Space Segment', type: 'package' },
      { name: 'Requirements', type: 'package' },
      { name: 'Behavior', type: 'package' },
    ],
    uiCheck: ['package'],
  },

  'deep-space-network:1': {
    requiredNodes: [
      { name: 'Orbiter', type: 'block' },
      { name: 'Telemetry System', type: 'block' },
      { name: 'Transceiver', type: 'block' },
      { name: 'Antenna Array', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Orbiter', to: 'Telemetry System', connectionType: 'composition' },
      { from: 'Orbiter', to: 'Transceiver', connectionType: 'composition' },
      { from: 'Orbiter', to: 'Antenna Array', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'deep-space-network:2': {
    requiredNodes: [
      { name: 'RF In', type: 'port' },
      { name: 'RF Out', type: 'port' },
      { name: 'Amplifier', type: 'block' },
      { name: 'Modem', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Amplifier', to: 'RF In', connectionType: 'allocation' },
      { from: 'Modem', to: 'RF Out', connectionType: 'allocation' },
    ],
    forbiddenNodes: [{ name: 'USB' }],
    uiCheck: ['port', 'ibd'],
  },

  'deep-space-network:3': {
    requiredNodes: [
      { name: 'Collect Data', type: 'action' },
      { name: 'Modulate Signal', type: 'action' },
      { name: 'Transmit to Ground', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Collect Data', to: 'Modulate Signal', connectionType: 'association' },
      { from: 'Modulate Signal', to: 'Transmit to Ground', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },

  // ── Exercise 3: Autonomous Vehicle Perception ──────────────────────────

  'av-perception:0': {
    requiredNodes: [
      { name: 'Sensing', type: 'package' },
      { name: 'Processing', type: 'package' },
      { name: 'Actuation', type: 'package' },
      { name: 'Safety', type: 'package' },
      { name: 'Requirements', type: 'package' },
    ],
    uiCheck: ['package'],
  },

  'av-perception:1': {
    requiredNodes: [
      { name: 'AV Platform', type: 'block' },
      { name: 'LiDAR Unit', type: 'block' },
      { name: 'Camera Array', type: 'block' },
      { name: 'Radar Module', type: 'block' },
      { name: 'ECU', type: 'block' },
    ],
    requiredConnections: [
      { from: 'AV Platform', to: 'LiDAR Unit', connectionType: 'composition' },
      { from: 'AV Platform', to: 'Camera Array', connectionType: 'composition' },
      { from: 'AV Platform', to: 'Radar Module', connectionType: 'composition' },
      { from: 'AV Platform', to: 'ECU', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'av-perception:2': {
    requiredNodes: [
      { name: 'CAN Bus', type: 'port' },
      { name: 'Ethernet', type: 'port' },
    ],
    requiredConnections: [
      { from: 'LiDAR Unit', to: 'Ethernet', connectionType: 'allocation' },
      { from: 'Radar Module', to: 'CAN Bus', connectionType: 'allocation' },
    ],
    forbiddenNodes: [{ name: 'WiFi' }, { name: 'Wireless' }],
    uiCheck: ['port', 'ibd'],
  },

  'av-perception:3': {
    requiredNodes: [
      { name: 'Capture Sensor Data', type: 'action' },
      { name: 'Fuse Point Clouds', type: 'action' },
      { name: 'Classify Objects', type: 'action' },
      { name: 'Send to Planner', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Capture Sensor Data', to: 'Fuse Point Clouds', connectionType: 'association' },
      { from: 'Fuse Point Clouds', to: 'Classify Objects', connectionType: 'association' },
      { from: 'Classify Objects', to: 'Send to Planner', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },

  // ── Exercise 4: Medical Infusion Pump ──────────────────────────────────

  'infusion-pump:0': {
    requiredNodes: [
      { name: 'Safety', type: 'package' },
      { name: 'Fluid Delivery', type: 'package' },
      { name: 'Alarming', type: 'package' },
      { name: 'Software', type: 'package' },
      { name: 'Requirements', type: 'package' },
    ],
    uiCheck: ['package'],
  },

  'infusion-pump:1': {
    requiredNodes: [
      { name: 'Infusion Pump', type: 'block' },
      { name: 'Pump Motor', type: 'block' },
      { name: 'Flow Sensor', type: 'block' },
      { name: 'Alarm Module', type: 'block' },
      { name: 'Display Unit', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Infusion Pump', to: 'Pump Motor', connectionType: 'composition' },
      { from: 'Infusion Pump', to: 'Flow Sensor', connectionType: 'composition' },
      { from: 'Infusion Pump', to: 'Alarm Module', connectionType: 'composition' },
      { from: 'Infusion Pump', to: 'Display Unit', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'infusion-pump:2': {
    requiredNodes: [
      { name: 'Control Signal', type: 'port' },
      { name: 'Feedback Out', type: 'port' },
    ],
    requiredConnections: [
      { from: 'Pump Motor', to: 'Control Signal', connectionType: 'allocation' },
      { from: 'Flow Sensor', to: 'Feedback Out', connectionType: 'allocation' },
    ],
    forbiddenNodes: [{ name: 'Wireless' }, { name: 'Bluetooth' }, { name: 'WiFi' }],
    uiCheck: ['port', 'ibd'],
  },

  'infusion-pump:3': {
    requiredNodes: [
      { name: 'Check Flow Rate', type: 'action' },
      { name: 'Compare to Prescription', type: 'action' },
      { name: 'Adjust Motor Speed', type: 'action' },
      { name: 'Log Event', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Check Flow Rate', to: 'Compare to Prescription', connectionType: 'association' },
      { from: 'Compare to Prescription', to: 'Adjust Motor Speed', connectionType: 'association' },
      { from: 'Adjust Motor Speed', to: 'Log Event', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },

  // ── Exercise 5: Satellite Power Subsystem ──────────────────────────────

  'satellite-power:0': {
    requiredNodes: [
      { name: 'Power Generation', type: 'package' },
      { name: 'Storage', type: 'package' },
      { name: 'Distribution', type: 'package' },
      { name: 'Thermal', type: 'package' },
      { name: 'Requirements', type: 'package' },
    ],
    uiCheck: ['package'],
  },

  'satellite-power:1': {
    requiredNodes: [
      { name: 'Solar Array', type: 'block' },
      { name: 'Battery Bank', type: 'block' },
      { name: 'Power Control Unit', type: 'block' },
      { name: 'Bus Regulator', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Power Control Unit', to: 'Solar Array', connectionType: 'composition' },
      { from: 'Power Control Unit', to: 'Battery Bank', connectionType: 'composition' },
      { from: 'Power Control Unit', to: 'Bus Regulator', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'satellite-power:2': {
    requiredNodes: [
      { name: '28V Bus', type: 'port' },
      { name: 'Charge Port', type: 'port' },
    ],
    requiredConnections: [
      { from: 'Solar Array', to: 'Charge Port', connectionType: 'allocation' },
      { from: 'Bus Regulator', to: '28V Bus', connectionType: 'allocation' },
    ],
    forbiddenNodes: [{ name: 'AC Power' }, { name: '120V' }, { name: '240V' }],
    uiCheck: ['port', 'ibd'],
  },

  'satellite-power:3': {
    requiredNodes: [
      { name: 'Collect Solar Energy', type: 'action' },
      { name: 'Regulate Voltage', type: 'action' },
      { name: 'Distribute to Loads', type: 'action' },
      { name: 'Monitor State of Charge', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Collect Solar Energy', to: 'Regulate Voltage', connectionType: 'association' },
      { from: 'Regulate Voltage', to: 'Distribute to Loads', connectionType: 'association' },
      { from: 'Distribute to Loads', to: 'Monitor State of Charge', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },

  // ── Exercise 6: Railway Signaling System ────────────────────────────────

  'railway-signaling:0': {
    requiredNodes: [
      { name: 'Interlocking', type: 'package' },
      { name: 'Track Circuit', type: 'package' },
      { name: 'Signaling', type: 'package' },
      { name: 'Communication', type: 'package' },
      { name: 'Requirements', type: 'package' },
    ],
    uiCheck: ['package'],
  },

  'railway-signaling:1': {
    requiredNodes: [
      { name: 'Interlocking System', type: 'block' },
      { name: 'Route Controller', type: 'block' },
      { name: 'Signal Head', type: 'block' },
      { name: 'Point Machine', type: 'block' },
      { name: 'Track Detector', type: 'block' },
    ],
    requiredConnections: [
      { from: 'Interlocking System', to: 'Route Controller', connectionType: 'composition' },
      { from: 'Interlocking System', to: 'Signal Head', connectionType: 'composition' },
      { from: 'Interlocking System', to: 'Point Machine', connectionType: 'composition' },
      { from: 'Interlocking System', to: 'Track Detector', connectionType: 'composition' },
    ],
    compositionRequired: true,
    uiCheck: ['block', 'bdd'],
  },

  'railway-signaling:2': {
    requiredNodes: [
      { name: 'Command Port', type: 'port' },
      { name: 'Status Port', type: 'port' },
    ],
    requiredConnections: [
      { from: 'Signal Head', to: 'Command Port', connectionType: 'allocation' },
      { from: 'Track Detector', to: 'Status Port', connectionType: 'allocation' },
    ],
    forbiddenNodes: [{ name: 'Wireless Control' }, { name: 'WiFi Control' }],
    uiCheck: ['port', 'ibd'],
  },

  'railway-signaling:3': {
    requiredNodes: [
      { name: 'Request Route', type: 'action' },
      { name: 'Check Track Clear', type: 'action' },
      { name: 'Set Points', type: 'action' },
      { name: 'Clear Signal', type: 'action' },
      { name: 'Confirm Route', type: 'action' },
    ],
    requiredConnections: [
      { from: 'Request Route', to: 'Check Track Clear', connectionType: 'association' },
      { from: 'Check Track Clear', to: 'Set Points', connectionType: 'association' },
      { from: 'Set Points', to: 'Clear Signal', connectionType: 'association' },
      { from: 'Clear Signal', to: 'Confirm Route', connectionType: 'association' },
    ],
    uiCheck: ['action', 'activity'],
  },
}

export function getRubric(exerciseSlug: string, stageIndex: number): RubricDefinition | null {
  return rubrics[`${exerciseSlug}:${stageIndex}`] ?? null
}
