## Contributing notes — dev server and package manager

When running the project locally from the repository root, the Vite dev server needs access to files outside the `client` folder (for example, `index.html` lives in the repository root).

If you hit the Vite error: "The request id \"<path>/index.html\" is outside of Vite serving allow list", add the repository root to the Vite `server.fs.allow` list so Vite can serve root-level files.

Example `vite.config.ts` snippet:

```ts
server: {
  fs: {
    // allow the repository root and other project folders
    allow: [process.cwd(), path.resolve(__dirname, './client'), path.resolve(__dirname, './shared')]
  }
}
```

Also note: this project uses npm as the preferred package manager. To avoid mismatches between dependency layouts please use npm consistently in your environment and CI (e.g. `npm ci`, `npm run dev`, `npm test`).

Thanks for contributing — if you find other environment-specific issues, add them to this file or open an issue.
