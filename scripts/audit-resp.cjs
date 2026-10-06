const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function audit(page, url, label) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  } catch (e) {
    console.log(`[${label}] NAV FAIL: ${e.message.slice(0, 100)}`);
    return;
  }
  await new Promise((r) => setTimeout(r, 1500));
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflow = [];
    const bigText = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || r.width === 0 || r.height === 0) return;
      if (r.right > vw + 2 || r.left < -2) {
        const cls = (typeof el.className === "string" ? el.className : "").slice(0, 70);
        overflow.push(`${el.tagName}.${cls} L${Math.round(r.left)} R${Math.round(r.right)}`);
      }
      const fs = parseFloat(st.fontSize);
      if (fs >= 26 && el.children.length === 0 && (el.textContent || "").trim().length > 0) {
        const cls = (typeof el.className === "string" ? el.className : "").slice(0, 70);
        bigText.push(`${fs}px ${el.tagName}.${cls} "${(el.textContent || "").trim().slice(0, 30)}"`);
      }
    });
    return {
      vw,
      scrollW: document.documentElement.scrollWidth,
      overflow: [...new Set(overflow)].slice(0, 12),
      bigText: [...new Set(bigText)].slice(0, 12),
    };
  });
  console.log(`\n[${label}] vw=${res.vw} scrollW=${res.scrollW}`);
  if (res.scrollW > res.vw + 2) console.log("  !! HORIZONTAL SCROLL");
  res.overflow.forEach((o) => console.log("  OVER: " + o));
  res.bigText.forEach((b) => console.log("  BIG : " + b));
  if (!res.overflow.length && !res.bigText.length && res.scrollW <= res.vw + 2) console.log("  clean");
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });

  const base = "http://localhost:3000";
  // get a product id
  let pid = "";
  try {
    const r = await page.goto(base + "/api/products", { waitUntil: "domcontentloaded" });
    const j = JSON.parse(await r.text());
    pid = (Array.isArray(j) ? j : [])[0]?.id || "";
  } catch {}

  await audit(page, base + "/", "home");
  if (pid) await audit(page, `${base}/product/${pid}`, "product");
  await audit(page, base + "/reviews", "reviews");
  await audit(page, base + "/wishlist", "wishlist");
  await audit(page, base + "/orders/track", "track-order");
  await audit(page, base + "/account", "account");
  await audit(page, base + "/checkout", "checkout");

  await browser.close();
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
