import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("config", () => {
  const envSnapshot = { ...process.env };

  beforeEach(() => {
    process.env = {
      ...envSnapshot,
      SITE_URL: "https://example.com",
      WORDPRESS_URL: "https://wp.example.com",
      WORDPRESS_USERNAME: "user",
      WORDPRESS_APP_PASSWORD: "secret",
      OPENAI_API_KEY: "secret",
      OPENAI_MODEL: "gpt-4.1-mini",
    };
  });

  afterEach(async () => {
    process.env = { ...envSnapshot };
    const config = await import("./config");
    config.resetConfigForTests();
  });

  it("parses required config", async () => {
    const config = await import("./config");
    expect(config.getConfig().SITE_URL).toBe("https://example.com");
  });

  it("accepts docker env-file values wrapped in quotes", async () => {
    process.env.SITE_URL = '"https://homio.se"';
    process.env.WORDPRESS_URL = '"https://backend.homio.se"';
    process.env.WORDPRESS_APP_PASSWORD = '"app password with spaces"';
    const config = await import("./config");
    config.resetConfigForTests();

    expect(config.getConfig().SITE_URL).toBe("https://homio.se");
    expect(config.getConfig().WORDPRESS_URL).toBe("https://backend.homio.se");
    expect(config.getConfig().WORDPRESS_APP_PASSWORD).toBe("app password with spaces");
  });

  it("defaults database url when unset", async () => {
    const config = await import("./config");
    expect(config.getConfig().DATABASE_URL).toBe("file:./dev.db");
  });

  it("allows insecure wordpress tls by default in development", async () => {
    process.env.NODE_ENV = "development";
    const config = await import("./config");
    config.resetConfigForTests();
    expect(config.getConfig().WORDPRESS_ALLOW_INSECURE_TLS).toBe(true);
  });

  it("can disable insecure wordpress tls explicitly", async () => {
    process.env.WORDPRESS_ALLOW_INSECURE_TLS = "false";
    const config = await import("./config");
    config.resetConfigForTests();
    expect(config.getConfig().WORDPRESS_ALLOW_INSECURE_TLS).toBe(false);
  });

  it("fails when min subjects is greater than max", async () => {
    process.env.SUBJECTS_PER_DAY_MIN = "4";
    process.env.SUBJECTS_PER_DAY_MAX = "1";
    const config = await import("./config");
    config.resetConfigForTests();

    expect(() => config.getConfig()).toThrow(/SUBJECTS_PER_DAY_MIN/);
  });
});
