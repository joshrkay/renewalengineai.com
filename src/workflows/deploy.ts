import { readFileSync, readdirSync } from "fs";
import { resolve, basename } from "path";

const N8N_BASE_URL = process.env.N8N_BASE_URL || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

async function n8nFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`n8n API ${res.status}: ${body}`);
  }
  return res.json();
}

async function deploy() {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    console.error("Set N8N_BASE_URL and N8N_API_KEY environment variables");
    process.exit(1);
  }

  const templatesDir = resolve(__dirname, "templates");
  const files = readdirSync(templatesDir).filter((f) => f.endsWith(".json"));

  console.log(`\nDeploying ${files.length} workflow templates to n8n...\n`);

  const results: Record<string, string> = {};

  for (const file of files) {
    const slug = basename(file, ".json");
    const templateJson = JSON.parse(readFileSync(resolve(templatesDir, file), "utf-8"));

    // Check if template already exists by name
    const existing = await n8nFetch(`/workflows?name=${encodeURIComponent(templateJson.name)}`);
    const existingWorkflow = (existing.data || []).find(
      (w: any) => w.name === templateJson.name
    );

    if (existingWorkflow) {
      // Update existing template
      await n8nFetch(`/workflows/${existingWorkflow.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nodes: templateJson.nodes,
          connections: templateJson.connections,
          settings: templateJson.settings,
        }),
      });
      results[slug] = existingWorkflow.id;
      console.log(`  Updated: ${templateJson.name} → ${existingWorkflow.id}`);
    } else {
      // Create new template (inactive — templates should not run)
      const workflow = await n8nFetch("/workflows", {
        method: "POST",
        body: JSON.stringify(templateJson),
      });
      results[slug] = workflow.id;
      console.log(`  Created: ${templateJson.name} → ${workflow.id}`);
    }
  }

  console.log("\n--- Template IDs (add to seed.ts) ---\n");
  for (const [slug, id] of Object.entries(results)) {
    console.log(`  "${slug}": "${id}",`);
  }
  console.log("\nDone.\n");
}

deploy().catch((e) => {
  console.error("Deploy failed:", e);
  process.exit(1);
});
