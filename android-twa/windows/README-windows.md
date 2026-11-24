# 在 Windows 產出 Jangogo 的 .aab

> 為什麼不是我直接給你 .aab？打包 `.aab` 要下載 Android SDK / Gradle（Google 伺服器），
> 我的執行環境只開放 npm/pypi 等套件源、連不到 Google，因此無法代打包。
> 在你 Windows（網路正常）上跑約 5–10 分鐘即可產出，簽署金鑰我已幫你做好。

有兩條路，**擇一**即可。推薦【方法 A】，因為用的是我已產生、且 `assetlinks.json` 已對應的那把金鑰。

---

## 方法 A：Bubblewrap 一鍵腳本（用我給的金鑰，最省事）

**事前安裝（各一次）**
1. Node.js LTS：<https://nodejs.org>（直接下一步安裝完成）
2. JDK 17（擇一）：Microsoft OpenJDK 17 <https://learn.microsoft.com/java/openjdk/download>
   —— 若懶得裝，第一次執行 Bubblewrap 時它會問要不要自動下載 JDK/Android SDK，選 **Yes** 即可。

**步驟**
1. 新建一個空資料夾，例如 `C:\Users\tt\Desktop\jangogo-build`。
2. 把這兩個檔案放進去：
   - `build-jangogo.bat`（本資料夾內）
   - `jangogo-upload.keystore`（我在對話中傳給你的簽署金鑰）
3. 雙擊 `build-jangogo.bat`，照畫面提示回答：
   | 問題 | 答案 |
   |---|---|
   | Application ID / package name | `com.jangogo.app` |
   | Application name / launcher name | `Jangogo` |
   | Signing key | 選 **Use existing（既有）** |
   | Key store location | `.\jangogo-upload.keystore` |
   | Key alias | `jangogo` |
   | Key store / key password | 我在對話中給你的密碼 |
   | 其他（主題色、方向、splash…） | 直接 **Enter** 用預設 |
4. 完成後，資料夾內會出現：
   - **`app-release-bundle.aab`** → 上傳 Google Play 封閉測試
   - `app-release-signed.apk` → 可直接裝手機自測

> 用這把金鑰打包，網站上的 `/.well-known/assetlinks.json` 指紋已對應，App 安裝後會全螢幕開啟（無網址列）。
> 之後上傳 Play 後，記得再把「Play App Signing」的 SHA-256 補進 assetlinks（見 ../README.md）——這步可叫我幫你改好重新部署。

---

## 方法 B：PWABuilder（免安裝、網頁操作）

1. 開 <https://www.pwabuilder.com>，輸入網址：`https://japan-3d-nav.vercel.app`
2. 按 **Package For Stores → Android (Google Play)**。
3. Package ID 填 `com.jangogo.app`、App name 填 `Jangogo`。
4. Signing key：
   - 想沿用我給的金鑰 → 選「Use mine」並上傳 `jangogo-upload.keystore`，填 alias `jangogo` 與密碼。
   - 或讓它產生新的 → 下載它給的 `signing.keystore` **和** 新的 `assetlinks.json`（指紋會不同，要把新的 assetlinks 換到網站再部署，可叫我幫你）。
5. 下載 zip，裡面就有 **`app-release-bundle.aab`**（和一份 assetlinks 指示）。

---

## 下一步（拿到 .aab 之後）
1. Google Play Console → 建立應用程式「Jangogo」→ **封閉測試**軌道 → 上傳 `.aab`。
2. 商店資訊貼 `../store-listing.md` 的文案；上傳我做的圖（Feature Graphic＋截圖）。
3. 隱私權政策網址填：`https://japan-3d-nav.vercel.app/privacy.html`
4. 補 Play App Signing 的 SHA-256 到 assetlinks（叫我幫你）。
5. 取得封閉測試連結 → 登錄到 ontoprank 找測試者。
