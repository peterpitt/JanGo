# Jangogo — Android (TWA) 打包說明

把 `japan-3d-nav.vercel.app` 這個 PWA 包成 Android App（Trusted Web Activity，全螢幕無網址列），產出 `.aab` 上傳 Google Play 封閉測試。

## 你已經有的東西（我已產生）
- `jangogo-upload.keystore`：**上傳簽署金鑰**（我另外單獨傳檔給你，不在版控內）
- 金鑰密碼（store/key 相同）：見我在對話中給你的密碼；alias = `jangogo`
- `twa-manifest.json`：Bubblewrap 設定（package = `com.jangogo.app`）
- 網站端 `/.well-known/assetlinks.json` 已含此金鑰的 SHA-256 指紋並已部署

## 在你本機（Mac mini 可）執行
需求：Node.js 18+、JDK 17。Bubblewrap 首次會自動下載 Android SDK / build-tools。

```bash
# 1) 安裝 Bubblewrap
npm i -g @bubblewrap/cli

# 2) 建一個空資料夾，放入我給的 jangogo-upload.keystore 與 twa-manifest.json
mkdir jangogo-twa && cd jangogo-twa
#   （把 jangogo-upload.keystore 和 twa-manifest.json 複製進來）

# 3) 用現成 manifest 初始化
bubblewrap init --manifest=https://japan-3d-nav.vercel.app/manifest.webmanifest
#   過程會問簽署金鑰 → 選「使用既有」→ 路徑 ./jangogo-upload.keystore、alias jangogo、輸入密碼

# 4) 建置（產出 app-release-bundle.aab 與 app-release-signed.apk）
bubblewrap build
```

產物：
- `app-release-bundle.aab` → 上傳 Google Play Console（封閉測試軌道）
- `app-release-signed.apk` → 可直接裝到你手機先自測

## 重要：Play App Signing 指紋要補進 assetlinks
上傳到 Play 後，Google 會用「Play 應用程式簽署金鑰」重新簽署。到
Play Console → 測試與發布 → App signing，複製那把 **App signing key 的 SHA-256**，
加進 `/.well-known/assetlinks.json` 的 `sha256_cert_fingerprints`（和現有這把並存），
再重新部署網站，App 才能在正式/測試下載版全螢幕開啟（不顯示網址列）。

## 金鑰務必保管好
- `jangogo-upload.keystore` + 密碼 = 之後每次更新 App 都要用；**遺失=無法更新**（Play 可申請重置上傳金鑰，但很麻煩）。
- 不要把 keystore 放進 Git 或公開位置（本專案 `.gitignore` 已排除）。
