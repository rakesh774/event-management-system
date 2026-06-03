import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import CreateEvent from './src/pages/CreateEvent.jsx';

try {
  const html = renderToString(
    <StaticRouter>
      <CreateEvent />
    </StaticRouter>
  );
  console.log("Rendered successfully:", html.length);
} catch (e) {
  console.error("Render failed:");
  console.error(e);
}
