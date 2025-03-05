const migrations = new Map([
  [
    "20250306201000_initial",
    async () => {
      const { settings } = await browser.storage.local.get("settings");

      await browser.storage.local.set({
        settings: {
          webhooks: [],
          notifications: false,

          ...settings,
        },
      });
    },
  ],
]);

export async function applyMigrations() {
  const { appliedMigrations } = await browser.storage.local.get({
    appliedMigrations: [],
  });

  for (const [name, migration] of migrations) {
    const [version] = name.split("_");

    if (appliedMigrations.includes(version)) {
      continue;
    }

    await migration();

    await browser.storage.local.set({
      appliedMigrations: appliedMigrations.concat(version),
    });
  }
}
