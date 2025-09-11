# reporting-app — Reporting Micro‑Frontend

## 1) Setup
```bash
npm install
npm start     # → http://localhost:3003
npm run build # → dist/
```

## 2) Architecture Decisions
- **Exposes**: `./ReportDashboard` via Module Federation.
- **Charts**: Recharts Pie/Bar; live updates from events.
- **Shared singletons**: `react`, `react-dom`.
- **Optional self‑register**: `bootstrap` posts manifest to `VITE_REGISTRY_URL`.

## 3) Communication Design
- **Consumes**: `booking:created` / `booking:updated` to refresh charts.
- **Props**: `{ user }` (enforces admin‑only; shows “Access Denied” if role ≠ admin).
- **Registry example**:
```json
{
  "name": "reporting-app",
  "displayName": "Reporting",
  "scope": "reportingApp",
  "url": "https://arh-mfe-reporting.vercel.app/remoteEntry.js",
  "routes": ["/reports"],
  "roles": ["admin"],
  "module": "./ReportDashboard"
}
```
