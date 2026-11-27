# AI Code Review 報告

審查方式：security-reviewer、code-reviewer 兩個唯讀角色分頭靜態審查；test-runner 跑 `test:unit`（54 通過、1 跳過）與 `test:integration`（10 通過）。

## 已確認的問題（本次修正）

| # | 嚴重度 | 位置 | 問題說明 |
| --- | --- | --- | --- |
| 1 | 高 | `src/utils/shipping.js` `qualifiesForFreeShipping` | 免運門檻用 `>`，小計剛好 1,500 元仍收基本運費；規格為「滿 1,500 元」，應為 `>=` |
| 2 | 高 | `tests/shipping.test.js:29` | 「小計 1,500 元免基本運費」被 `it.skip` 跳過，遮蔽問題 1 |
| 3 | 高 | `src/routes/orderRoutes.js` `GET /:id` | 用 `findOrderById`，未比對 `user_id`；任何登入會員可讀他人訂單（姓名、Email、地址）。應改用 `findOrderForUser`，他人訂單回 404 |
| 4 | 高 | `src/services/paymentService.js` `isTradePaid` | `tradeInfo.CheckMacValue && !verify(...)`：回應缺少 CheckMacValue 時整個驗證被略過，竄改的回應可讓訂單被標為已付款。應為缺少或驗證失敗皆 throw |
| 5 | 中 | `src/routes/cartRoutes.js` `PATCH /:itemId` | 只擋 NaN；0、負數、小數、`null`、`true` 通過驗證，會觸發 DB CHECK 造成 500 或寫入小數。應改用 `parsePositiveInteger`，失敗回 400 |

## 其他發現（未在本次修正，列為後續）

- `src/routes/pageRoutes.js` `/ecpay/payment/:orderId`：無登入與擁有者檢查（高，待確認）
- `/api/orders/:id/pay` 的 `fail` 分支未回補庫存（中）
- 庫存檢查在交易外、扣庫存無 `stock >= ?` 條件（中）
- 訪客 `X-Session-Id` 無格式驗證（中）；`ecpay.js` 預設金鑰缺少 production 強制檢查（低）
- 訂單收件資訊無長度上限（低）；後台 `status` 非法值被靜默忽略（低）
