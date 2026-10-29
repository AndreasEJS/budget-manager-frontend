#!/usr/bin/env node
// PS5 Pro-bevakare: kollar produktsidor med jämna mellanrum och pushar till telefonen via ntfy.
// Kör: node monitor.mjs [config.json]   (Node 18+, inga beroenden)
import { readFileSync } from "node:fs";

const configPath = process.argv[2] || new URL("./config.json", import.meta.url).pathname;
let config, intervalMs, ntfyServer, UA;

const log = (...a) => console.log(new Date().toISOString(), ...a);

// Returnerar true (i lager), false (slut) eller null (kunde inte avgöra).
export function detectStock(html, site) {
  if (site.inStockRegex || site.outOfStockRegex) {
    if (site.outOfStockRegex && new RegExp(site.outOfStockRegex, "i").test(html)) return false;
    if (site.inStockRegex) return new RegExp(site.inStockRegex, "i").test(html);
    return true; // bara outOfStockRegex angiven och den matchade inte
  }
  // Standardläge: schema.org-data (JSON-LD) som de flesta butiker lägger på produktsidor.
  const avail = [...html.matchAll(/"availability"\s*:\s*"(?:https?:\/\/schema\.org\/)?(\w+)"/gi)]
    .map((m) => m[1].toLowerCase());
  if (avail.length === 0) return null;
  if (avail.some((a) => a === "instock" || a === "limitedavailability" || a === "onlineonly")) return true;
  return false;
}

async function notify(title, message, click) {
  const res = await fetch(`${ntfyServer}/${encodeURIComponent(config.ntfyTopic)}`, {
    method: "POST",
    headers: { Title: title, Priority: "urgent", Tags: "video_game,rotating_light", ...(click ? { Click: click } : {}) },
    body: message,
  });
  if (!res.ok) throw new Error(`ntfy svarade ${res.status}`);
}

const state = new Map(); // site.name -> senaste kända status

async function check(site) {
  let html;
  try {
    const res = await fetch(site.url, { headers: { "User-Agent": UA, "Accept-Language": "sv-SE,sv;q=0.9" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!res.ok) { log(`${site.name}: HTTP ${res.status}`); return; }
    html = await res.text();
  } catch (e) { log(`${site.name}: fel vid hämtning: ${e.message}`); return; }

  const inStock = detectStock(html, site);
  if (inStock === null) { log(`${site.name}: kunde inte avgöra lagerstatus (ställ in inStockRegex/outOfStockRegex)`); return; }
  const prev = state.get(site.name);
  state.set(site.name, inStock);
  log(`${site.name}: ${inStock ? "I LAGER" : "slut"}`);
  if (inStock && prev !== true) {
    try { await notify(`PS5 Pro i lager: ${site.name}`, `${site.name} verkar ha PS5 Pro i lager!\n${site.url}`, site.url); log(`${site.name}: notis skickad`); }
    catch (e) { state.set(site.name, prev); log(`${site.name}: notis misslyckades (försöker igen nästa runda): ${e.message}`); }
  }
}

async function main() {
  config = JSON.parse(readFileSync(configPath, "utf8"));
  intervalMs = (config.intervalSeconds ?? 300) * 1000;
  ntfyServer = config.ntfyServer || "https://ntfy.sh";
  UA = config.userAgent ||
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
  if (!config.ntfyTopic || !config.sites?.length) throw new Error("config.json måste ha ntfyTopic och minst en site");
  log(`Bevakar ${config.sites.length} sida(or) var ${intervalMs / 1000}:e sekund`);
  if (config.sendStartupNotification !== false) await notify("PS5-bevakaren startad", "Testnotis: notiser fungerar.").catch((e) => log("startnotis misslyckades:", e.message));
  for (;;) {
    await Promise.all(config.sites.map(check));
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
