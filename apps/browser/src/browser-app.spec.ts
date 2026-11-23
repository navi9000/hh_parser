import { describe, expect, it, vi } from 'vitest';
import { BrowserApp } from './browser-app.js';

describe('BrowserApp states', () => {
  it('starts idle and ready to accept session requests', () => {
    const app = new BrowserApp();

    expect(app.state).toBe('idle');
  });

  it('launches a background browser session on request', () => {
    const app = new BrowserApp();

    const session = app.launchBackground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('background');
    expect(session.mode).toBe('background');
    expect(session.headless).toBe(true);
  });

  it('launches a foreground browser session for user intervention', () => {
    const app = new BrowserApp();

    const session = app.launchForeground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('foreground');
    expect(session.mode).toBe('foreground');
    expect(session.headless).toBe(false);
  });

  it('returns to idle after the active background session closes', () => {
    const app = new BrowserApp();
    const session = app.launchBackground();

    session.close();

    expect(app.state).toBe('idle');
  });

  it('returns to idle after the foreground session closes', () => {
    const app = new BrowserApp();
    const session = app.launchForeground();

    session.close();

    expect(app.state).toBe('idle');
  });

  it('accepts an intervention in the foreground while idle', () => {
    const app = new BrowserApp();
    const intervention = app.launchForeground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('foreground');
    expect(intervention.startUrl).toBe('https://hh.ru');
  });
});
