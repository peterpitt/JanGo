# BDD STATE — JanGo 櫻旅 3D

current_stage: 3 (Automation + 實作)
feature: 步行/自駕導航跟隨使用者真實速度 (bdd/features/navigation.feature)

## 關卡紀錄
- 關卡A Definition of Ready：✅ 已就緒
- 關卡B 措辭核准：✅（使用者直接指定行為；最終以關卡D驗收）
- 關卡C 先紅後綠：進行中（tests/nav.test.cjs 對 nav-core.js）
- 關卡D 驗收：待使用者

## 架構決策（SDD：single source of truth）
- 導航純邏輯抽到 nav-core.js（瀏覽器與 Node 共用），UI/3D 留在 index.html。
- 自動化邊界放在領域層（nav-core 純函式），非 UI，符合測試金字塔。

## 未解（紅卡）
- OSRM 公開 foot profile 不穩 → 直線 fallback；正式版改 MapKit/商用 API。
