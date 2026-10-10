# 楊梅高中70週年校慶專刊（數位典藏版）

![校徽](images/badge.png)

桃園市立楊梅高級中等學校《梅高七十・迎曦御風 × 楊梅高中七十週年專刊》的網站版。
220 頁專刊每一頁都以原頁圖像完整呈現，並提供目次瀏覽、全文檢索、縮圖總覽、校史測驗與書籤功能。

- 純靜態網站（HTML + CSS + JavaScript），不需要伺服器或資料庫，可直接部署到 **GitHub Pages**
- 不使用任何外部圖片、字型或程式庫，所有素材都在這個資料夾裡
- 直接用瀏覽器開啟 `index.html` 也能使用（離線可用）

---

## 網站功能

| 頁面 | 網址 | 說明 |
|---|---|---|
| 首頁 | `#/home` | 70 週年標誌、校徽、梅花飄落動畫、數字統計、八大篇章卡片、校史時光機、梅高小知識 |
| 目次 | `#/toc` | 依專刊第 4–5 頁目次編排，點文章直接翻到該頁 |
| 翻閱專刊 | `#/read/頁碼` | 預設「完整頁」：依視窗大小自動縮放，整頁原比例完整顯示、不需捲動；頁面兩側大箭頭、輸入頁碼、滑桿、← → 鍵翻頁；可放大 125–250% 看細節；書籤、本篇縮圖列、本頁文字版 |
| 全文檢索 | `#/search/關鍵字` | 搜尋標題、作者與內文；顯示前後文、各篇章命中長條圖、篇章篩選；點結果會在文字版標出關鍵字 |
| 縮圖總覽 | `#/grid` | 220 頁縮圖，可依篇章篩選，已讀頁面打勾 |
| 校史測驗 | `#/quiz` | 10 題選擇題，答對／答錯音效，完成後彩帶慶祝 |
| 我的書籤 | `#/marks` | 書籤清單、全刊與各篇章閱讀進度 |

其他：右上角可調整字級（4 級）與開關音效。音效以 Web Audio 即時合成，不需音檔。
書籤、閱讀紀錄、字級與音效設定存在使用者瀏覽器的 localStorage，不會上傳到任何地方。

---

## 檔案架構

```
ymhs-70th-anniversary/
├── index.html              ← 首頁（網站入口）
├── README.md               ← 本說明文件
├── .nojekyll               ← 讓 GitHub Pages 直接提供檔案，不經 Jekyll 處理
├── assets/
│   ├── css/
│   │   └── style.css       ← 版面與配色（色彩變數在檔案開頭 :root）
│   └── js/
│       ├── data.js         ← 目次篇章、年表、小知識、測驗題目、熱門關鍵字
│       ├── text.js         ← 各頁 OCR 文字（全文檢索用）
│       └── app.js          ← 網站程式（路由、翻頁、檢索、測驗、音效）
└── images/
    ├── badge.png           ← 校徽（去背）
    ├── logo70.webp         ← 70 週年標誌（取自專刊第 1 頁）
    ├── pages/
    │   ├── 001.webp        ← 專刊第 1 頁（寬 1100px）
    │   ├── …
    │   └── 220.webp        ← 專刊第 220 頁
    └── thumbs/
        ├── s00.webp        ← 縮圖拼圖：第 1–20 頁
        ├── …
        └── s10.webp        ← 縮圖拼圖：第 201–220 頁
```

> 縮圖採「拼圖」（sprite）方式：每張 `sNN.webp` 含 20 頁縮圖（5 欄 × 4 列，每格 200×283），
> 讓縮圖總覽只需下載 11 個檔案，載入更快。

---

## 上傳到 GitHub 並開啟 GitHub Pages

### 方法一：網頁上傳（不需安裝軟體）
1. 登入 GitHub → 右上角 **＋ → New repository**，名稱例如 `ymhs-70th-anniversary`，選 **Public** → **Create repository**。
2. 在新倉庫頁面點 **uploading an existing file**。
3. 把 `ymhs-70th-anniversary` 資料夾**裡面的所有檔案與資料夾**拖進上傳區（不要拖外層資料夾本身）。
   - 網頁上傳單次上限 100 個檔案。`images/pages` 有 220 張圖，請分 3 次上傳：
     第 1 次上傳 `index.html`、`README.md`、`.nojekyll`、`assets`、`images/badge.png`、`images/logo70.webp`、`images/thumbs`；
     第 2、3 次各上傳一半的 `images/pages` 圖片（進入 `images/pages` 資料夾後再按 **Add file → Upload files**，或直接拖入保留資料夾路徑）。
   - `.nojekyll` 是隱藏檔，Windows 檔案總管需開啟「顯示隱藏的項目」才看得到；漏傳也不影響網站運作。
4. 每次上傳後按 **Commit changes**。
5. 到 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 **main**、資料夾 **/(root)** → **Save**。
6. 約 1–2 分鐘後，網站網址為：`https://<你的帳號>.github.io/ymhs-70th-anniversary/`

### 方法二：Git 指令
```bash
cd ymhs-70th-anniversary
git init
git add .
git commit -m "楊梅高中70週年校慶專刊網站"
git branch -M main
git remote add origin https://github.com/<你的帳號>/ymhs-70th-anniversary.git
git push -u origin main
```
推送後同樣到 **Settings → Pages** 開啟（步驟 5）。

---

## 如何修改內容

| 想修改… | 編輯檔案 | 說明 |
|---|---|---|
| 篇章、文章標題、作者、起始頁 | `assets/js/data.js` 的 `sections` | 每篇文章格式 `[起始頁, '標題', '作者']`，結束頁會自動推算到下一篇前一頁 |
| 校史時光機 | `data.js` 的 `timeline` | `p` 為點選後翻到的頁碼 |
| 梅高小知識 | `data.js` 的 `facts` | |
| 校史測驗 | `data.js` 的 `quiz` | `a` 為正確選項索引（第一個選項是 0），`p` 為答案出處頁碼 |
| 熱門關鍵字 | `data.js` 的 `hot` | |
| 某頁的文字（修正 OCR 錯字） | `assets/js/text.js` | `PAGE_TEXT` 陣列第 0 個是第 1 頁，以此類推；換行用 `\n` |
| 配色 | `assets/css/style.css` 開頭的 `:root` | 篇章顏色在 `data.js` 每個篇章的 `c` |
| 頁面圖片 | `images/pages/NNN.webp` | 以相同檔名覆蓋即可 |

修改後重新上傳（或 `git commit` + `git push`），GitHub Pages 會在 1–2 分鐘內更新。
若瀏覽器仍顯示舊內容，請按 `Ctrl + F5` 強制重新整理。

---

## 製作說明

- 來源：`楊梅高中70週年校慶.pdf`（220 頁，全為掃描影像）
- 頁面圖：以 PyMuPDF 200 dpi 轉檔後縮為寬 1100px 的 WebP
- 文字：以 Windows 內建文字辨識（Windows.Media.Ocr，繁體中文）產生，供檢索使用；**少數字可能辨識錯誤，內容以原頁圖像為準**
- 配色：取自校徽的紫色與梅花紅，搭配 70 週年標誌的桃紅色
- 版權：專刊內容版權屬桃園市立楊梅高級中等學校及各篇作者所有
