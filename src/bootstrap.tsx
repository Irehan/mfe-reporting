import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './components/ReportDashboard.css';
import ReportDashboard from './components/ReportDashboard';

const ENV_REGISTRY =
  (typeof process !== 'undefined' && (process as any)?.env?.VITE_REGISTRY_URL) ||
  (typeof import.meta !== 'undefined' &&
    (import.meta as any)?.env?.DEV &&
    (import.meta as any)?.env?.VITE_REGISTRY_URL) ||
  '';

const REGISTRY_URL =
  ENV_REGISTRY ||
  ((typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV)
    ? 'http://localhost:4000/registry'
    : '');

async function selfRegister() {
  if (!REGISTRY_URL) {
    console.log('ℹ️ Registry not configured; skipping reporting self-register.');
    return;
  }
  try {
    const res = await fetch('/plugin-manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('manifest not found');
    const manifest = await res.json();

    await fetch(REGISTRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manifest),
    });

    console.log('✅ Registered plugin:', manifest.scope);
  } catch (e) {
    console.warn('⚠️ Plugin self-register failed', e);
  }
}
selfRegister();

const mount = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el);
  const isStandalone = !String(window.name || '').includes('host');

  const App = () => (
    <div className="report-dashboard">
      <h2>Analytics & Reports</h2>
      <ReportDashboard />
    </div>
  );

  root.render(
    <React.StrictMode>
      {isStandalone ? (
        <Router>
          <App />
        </Router>
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
};

if ((import.meta as any)?.env?.DEV) {
  const devRoot = document.getElementById('root');
  if (devRoot && !String(window.name || '').includes('host')) {
    mount(devRoot);
  }
}

export { mount };
