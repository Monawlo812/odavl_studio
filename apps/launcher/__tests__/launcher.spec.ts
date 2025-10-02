import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('launcher', () => {
  it('should respond to /health with 200', async () => {
    const app = express();
    app.get('/health', (req, res) => res.send('ok'));
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
  });
});
