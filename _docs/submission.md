# 第四場作業繳交

**GitHub 儲存庫**：https://github.com/rockayumitw/20261126-ai-adv-course-hw4-starter

| 項目 | 內容 |
| --- | --- |
| AI Agent | Claude Code |
| 挑戰等級 | LV3 |
| 作業系統 | Linux（GitHub Codespaces） |
| 新增或調整的環境變數 | 無 |
| 機密資料 | 未提交任何 API Key、Token、密碼 |

## 挑戰一：SubAgent 小隊與 AI Code Review

- `.claude/agents/` 定義 3 個 SubAgent：
  - `security-reviewer`、`code-reviewer`：tools 僅 Read、Grep、Glob
  - `test-runner`：model 為 haiku，無 Edit、Write
- `docs/ai-review.md` 列出 5 個埋設問題（皆含位置與說明），已全部修正：
  1. `src/utils/shipping.js`：免運門檻用 `>`，改為 `>=`
  2. `tests/shipping.test.js`：1,500 元邊界測試被 `it.skip`，已恢復
  3. `GET /api/orders/:id`：未檢查訂單擁有者，改用 `findOrderForUser`
  4. `src/services/paymentService.js`：缺少 CheckMacValue 時略過驗證，改為必須存在且正確
  5. `PATCH /api/cart/:itemId`：數量驗證不足，改為必須是正整數
- 已補回歸測試；`test:unit`、`test:integration` 通過

## 挑戰二：Issue 驅動開發

- 已建立標籤：`ready`、`in-progress`、`in-review`、`needs-human`
- `.claude/settings.json` 已 deny `Edit(./tests/acceptance/**)`
- Issue A（#1 結帳優惠碼）由網頁開立，經 PR #2 合併關閉，`test:acceptance -- coupon` 與 GitHub Actions 皆通過
- `.claude/skills/work-issue/SKILL.md` 已建立（不含合併 PR）

## 挑戰三：Loop 自動觸發與 CI 回饋

- `.claude/loop.md` 已建立（只處理自己開的 Issue、修正超過 3 輪改 `needs-human`、不得合併 PR、不得修改 `tests/acceptance/`）
- Issue B（#3 我的訂單篩選與分頁）由 Loop 領取處理，經 PR #4 合併關閉，`test:acceptance -- order-filter` 與 GitHub Actions 皆通過
- Loop 在 Issue #3 留下回報留言；排程已取消（`CronList` 顯示 "No scheduled jobs."）

## 測試結果

| 指令 | 結果 |
| --- | --- |
| `npm run test:unit` | 94 項通過 |
| `npm run test:integration` | 10 項通過 |
| `npm run test:acceptance -- coupon` | 10 項通過 |
| `npm run test:acceptance -- order-filter` | 7 項通過 |

`tests/acceptance/` 與 main 無差異。

## LV3 額外繳交

- Loop 觸發處理第二個 Issue 的錄影：<貼上 YouTube 不公開連結>
- 排程任務清單截圖：`_docs/` 內的截圖（建立排程、`CronList`、取消排程）

## 補充說明

- Issue #3 建立於 Loop 啟動前不久，之後由 Loop 自動領取處理。
- `loop.md` 設定為「有動作才在 Issue 留言」，Issue #3 上有 2 則 Loop 回報；沒有動作的輪次沒有留言。
