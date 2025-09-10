import React from 'react';
import ReactDOM from 'react-dom/client';
import ReportDashboard from './components/ReportDashboard';

const mount = (el: HTMLElement, props: any) => {
  const root = ReactDOM.createRoot(el);
  root.render(
    <React.StrictMode>
      <ReportDashboard {...props} />
    </React.StrictMode>
  );
};

if (process.env.NODE_ENV === 'development' && !window.name.includes('host')) {
  const devRoot = document.getElementById('root');
  if (devRoot) {
    mount(devRoot, {});
  }
}

export { mount };