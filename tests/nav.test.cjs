// BDD 自動化：對應 bdd/features/navigation.feature 的領域層測試
// 執行：node --test
const test = require('node:test');
const assert = require('node:assert');
const N = require('../nav-core.js');

// 建一條沿東向、約 400m 的直線路線（東京車站附近）。1 經度 ≈ 90200m*cos(lat)，lat≈35.68 → cos≈0.812
// 取每點間隔約 100m：Δlng ≈ 100 / (111320*cos(35.68°)) ≈ 0.001106
const base = [139.7671, 35.6812];
const dLng = 100 / (111320 * Math.cos(35.68 * Math.PI / 180));
const route = [0, 1, 2, 3, 4].map(i => [base[0] + i * dLng, base[1]]); // 5 點、4 段、約 400m
const cum = N.cumulative(route);

test('cumulative 總長約 400m', () => {
  assert.ok(Math.abs(cum[cum.length - 1] - 400) < 15, `total=${cum[cum.length-1]}`);
});

// Rule: 進度由真實位置決定
test('原地不動 → 進度維持 0、未抵達終點', () => {
  const snap = N.snapToRoute(route[0], route, cum);
  assert.ok(snap.dist < 5, `dist=${snap.dist}`);
  const remain = N.remainingToSpot(snap.dist, cum[cum.length - 1]);
  assert.ok(remain > 390, `remain=${remain}`);
});

test('走到約 120m → 進度≈120m、剩餘≈280m', () => {
  const p = N.posAtDistance(route, cum, 120).ll;         // 線上 120m 的點
  const snap = N.snapToRoute(p, route, cum);
  assert.ok(Math.abs(snap.dist - 120) < 10, `dist=${snap.dist}`);
  const remain = N.remainingToSpot(snap.dist, cum[cum.length - 1]);
  assert.ok(Math.abs(remain - 280) < 12, `remain=${remain}`);
});

// Rule: Snap-to-Road
test('GPS 偏離約 15m → 吸附回線上且進度正確', () => {
  const on = N.posAtDistance(route, cum, 150).ll;
  const mPerDegLat = 111320;
  const drift = [on[0], on[1] + 15 / mPerDegLat];        // 往北漂 15m
  const snap = N.snapToRoute(drift, route, cum);
  assert.ok(snap.offset <= 20, `offset=${snap.offset}`);
  assert.ok(Math.abs(snap.dist - 150) < 10, `dist=${snap.dist}`);
});

// Rule: 抵達只觸發一次
test('進度越過 250m 的景點 → 抵達一次', () => {
  const spotDists = [0, 250, 400];
  const arrived = N.arrivalsPassed(240, 260, spotDists, 15);
  assert.deepStrictEqual(arrived, [1]);
  // 再前進一次不應重複觸發（prev 已過）
  const again = N.arrivalsPassed(260, 300, spotDists, 15);
  assert.deepStrictEqual(again, []);
});

test('heading 沿東向約 90°', () => {
  const h = N.headingAtDistance(route, cum, 100); // 弧度，從正北順時針
  const deg = (h * 180 / Math.PI + 360) % 360;
  assert.ok(Math.abs(deg - 90) < 8, `deg=${deg}`);
});
