const { app, request, registerUser } = require('./setup');

describe('GET /api/orders pagination', () => {
  let token;

  beforeAll(async () => {
    ({ token } = await registerUser());
  });

  const list = (query = '') =>
    request(app).get(`/api/orders${query}`).set('Authorization', `Bearer ${token}`);

  it('回傳 orders 與 pagination（沒有訂單時 total 為 0）', async () => {
    const res = await list();
    expect(res.status).toBe(200);
    expect(res.body.data.orders).toEqual([]);
    expect(res.body.data.pagination).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 });
  });

  it('limit 超過 50 以 50 計', async () => {
    const res = await list('?limit=999');
    expect(res.status).toBe(200);
    expect(res.body.data.pagination.limit).toBe(50);
  });

  it.each(['?status=unknown', '?status=', '?page=0', '?page=1.5', '?page=abc', '?limit=-1', '?limit=0', '?limit=2x'])(
    '不合法的查詢 %s 回 400',
    async (query) => {
      const res = await list(query);
      expect(res.status).toBe(400);
      expect(res.body.data).toBeNull();
      expect(res.body.error).toBe('VALIDATION_ERROR');
    }
  );

  it('需要登入', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });
});
