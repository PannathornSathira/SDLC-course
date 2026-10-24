import { openApiSpec } from "./openapi";

const SWAGGER_UI_VERSION = "5";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Farmart API Docs</title>
    <meta name="description" content="Swagger UI for the Farmart Grocery REST API." />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui.css" />
    <style>
      body { margin: 0; background: #faf9f6; }
      .topbar { display: none; }
      .farmart-bar { display: flex; gap: 16px; align-items: center; padding: 12px 24px; background: #1f2937; color: #fff; font: 14px system-ui, sans-serif; }
      .farmart-bar a { color: #fcd34d; text-decoration: none; }
      .farmart-bar a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <nav class="farmart-bar">
      <strong>Farmart API</strong>
      <a href="/">Storefront</a>
      <a href="/overview">Overview</a>
      <a href="/docs/openapi.json">openapi.json</a>
      <a href="/mermaid.html">Database ER Diagram</a>
      <a href="/test-report.html">Test Report</a>
    </nav>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}/swagger-ui-bundle.js" crossorigin></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/docs/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        docExpansion: "list",
        tryItOutEnabled: false,
      });
    </script>
  </body>
</html>`;

/**
 * GET /docs           -> Swagger UI
 * GET /docs?format=json -> raw OpenAPI spec (same as /docs/openapi.json)
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("format") === "json") {
    return Response.json(openApiSpec);
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
