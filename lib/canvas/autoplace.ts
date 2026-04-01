/**
 * Deterministic grid positions for programmatically placed nodes.
 * Used by KerMLBuilder to position blocks without user drag.
 *
 * Grid origin is inside the diagram frame (FRAME_X=24, FRAME_Y=40 + TAB_H=36).
 * Columns: 3 wide, 170px apart. Rows: 130px tall.
 */

const COLS = 3
const COL_W = 170
const ROW_H = 130
const START_X = 60
const START_Y = 100

export function getAutoPlacePosition(index: number): { x: number; y: number } {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  return {
    x: START_X + col * COL_W,
    y: START_Y + row * ROW_H,
  }
}
