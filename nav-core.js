/* nav-core.js — 導航領域層純函式（瀏覽器 window.NavCore 與 Node 共用）
   single source of truth：index.html 與 tests/nav.test.cjs 都用這份。
   座標格式一律 [lng, lat]。距離單位公尺，角度弧度（從正北順時針）。*/
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.NavCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const R = 6371000, rad = Math.PI / 180;

  function hav(a, b) {
    const dLa = (b[1] - a[1]) * rad, dLo = (b[0] - a[0]) * rad;
    const s = Math.sin(dLa / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function brng(a, b) {
    const y = Math.sin((b[0] - a[0]) * rad) * Math.cos(b[1] * rad);
    const x = Math.cos(a[1] * rad) * Math.sin(b[1] * rad) - Math.sin(a[1] * rad) * Math.cos(b[1] * rad) * Math.cos((b[0] - a[0]) * rad);
    return Math.atan2(y, x);
  }
  function cumulative(route) {
    const cum = [0];
    for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + hav(route[i - 1], route[i]));
    return cum;
  }
  // 以 ref 為原點，把經緯度換成本地平面公尺（equirectangular，短距足夠準）
  function toXY(p, ref) {
    return [(p[0] - ref[0]) * rad * Math.cos(ref[1] * rad) * R, (p[1] - ref[1]) * rad * R];
  }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

  // 把點投影到路線最近的一段，回傳沿線前進距離 dist、偏移 offset、吸附點 snapped
  function snapToRoute(point, route, cum) {
    cum = cum || cumulative(route);
    let best = { dist: 0, offset: Infinity, snapped: route[0], seg: 0 };
    for (let i = 0; i < route.length - 1; i++) {
      const a = route[i], b = route[i + 1];
      const P = toXY(point, a), B = toXY(b, a);
      const len2 = B[0] * B[0] + B[1] * B[1] || 1e-9;
      let t = (P[0] * B[0] + P[1] * B[1]) / len2;
      t = Math.max(0, Math.min(1, t));
      const proj = [B[0] * t, B[1] * t];
      const offset = Math.hypot(P[0] - proj[0], P[1] - proj[1]);
      if (offset < best.offset) {
        const segLen = hav(a, b);
        best = { dist: cum[i] + t * segLen, offset, snapped: lerp(a, b, t), seg: i };
      }
    }
    return best;
  }
  // 沿線前進 dist 公尺處的座標
  function posAtDistance(route, cum, dist) {
    cum = cum || cumulative(route);
    const total = cum[cum.length - 1];
    dist = Math.max(0, Math.min(total, dist));
    let i = 1;
    while (i < cum.length && cum[i] < dist) i++;
    i = Math.min(i, route.length - 1);
    const segLen = cum[i] - cum[i - 1] || 1e-9;
    const t = (dist - cum[i - 1]) / segLen;
    return { ll: lerp(route[i - 1], route[i], t), seg: i - 1 };
  }
  function headingAtDistance(route, cum, dist) {
    const { seg } = posAtDistance(route, cum, dist);
    return brng(route[seg], route[seg + 1] || route[seg]);
  }
  function remainingToSpot(progress, spotDist) {
    return Math.max(0, spotDist - progress);
  }
  // 回傳「這一步新越過」的景點索引：prev→cur 之間跨過景點實際位置 spotDist 時觸發一次。
  // threshold：容差，若剛開始導航就已在景點 threshold 公尺內也算抵達。
  function arrivalsPassed(prev, cur, spotDists, threshold) {
    threshold = threshold == null ? 15 : threshold;
    const out = [];
    for (let i = 0; i < spotDists.length; i++) {
      const line = spotDists[i];
      const crossed = prev < line && cur >= line;
      const startedInside = prev <= 0 && Math.abs(cur - line) <= threshold && line > 0;
      if (crossed || startedInside) out.push(i);
    }
    return out;
  }

  return { hav, brng, cumulative, snapToRoute, posAtDistance, headingAtDistance, remainingToSpot, arrivalsPassed, lerp };
});
