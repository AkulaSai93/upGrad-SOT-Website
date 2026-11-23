import { EMAIL, PHONE, SOT_URL } from "@/components/site/contact";
import { applicationId, type Application } from "./application";
import { feeSummary, money } from "./fees";

/**
 * The application fee invoice: a plain, printable page opened in a new
 * tab, from which the browser prints it or saves it as a PDF (or, where
 * pop-ups are blocked, downloaded as a page to open). Built from
 * the payment saved in this browser; it says so (test mode) until the
 * payment gateway and the admissions back end are wired up.
 */

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** the invoice as a full HTML page */
export function invoiceHtml(app: Application): string {
  const p = app.payment;
  if (!p) return "";
  const fee = feeSummary(p.coupon);
  const d = app.profile;
  const date = new Date(p.paidAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const line = (label: string, value: string, strong = false) =>
    `<tr${strong ? ' class="total"' : ""}><td>${esc(label)}</td><td>${esc(value)}</td></tr>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Invoice ${esc(p.reference)} | upGrad School of Technology</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#0b0d12;background:#fff}
  .page{max-width:720px;margin:40px auto;padding:0 24px}
  header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e4002b;padding-bottom:16px}
  h1{margin:0;font-size:22px;letter-spacing:-.01em}
  .brand{color:#e4002b;font-weight:700;font-size:18px}
  .muted{color:#6b7280}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0}
  h2{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  td{padding:10px 0;border-bottom:1px solid #ebebeb}
  td:last-child{text-align:right;font-weight:600}
  tr.total td{border-bottom:0;border-top:2px solid #0b0d12;font-size:16px;font-weight:700}
  tr.total td:last-child{color:#e4002b}
  .note{margin-top:28px;padding:12px 14px;border:1px dashed #d4d4d4;border-radius:4px;font-size:12.5px}
  footer{margin-top:28px;font-size:12.5px}
  @media print{.page{margin:0 auto}button{display:none}}
</style></head>
<body><div class="page">
<header>
  <div><div class="brand">upGrad School of Technology</div>
  <div class="muted">${esc(SOT_URL.replace("https://", ""))} · ${esc(EMAIL.label)} · ${esc(PHONE.label)}</div></div>
  <div style="text-align:right"><h1>Invoice</h1>
  <div class="muted">No. ${esc(p.reference)}<br />${esc(date)}</div></div>
</header>
<div class="grid">
  <div><h2>Billed to</h2>
    <div><strong>${esc(d.name)}</strong><br />${esc(d.email)}<br />+91 ${esc(d.phone)}<br />${esc([d.city, d.state].filter(Boolean).join(", "))}</div></div>
  <div><h2>Application</h2>
    <div>Application ID <strong>${esc(applicationId(d.phone))}</strong><br />uGNET 2027 application fee<br />Paid by ${esc(p.method)}</div></div>
</div>
<table>
  ${line("uGNET application fee", money(fee.base))}
  ${fee.coupon ? line(`Discount (${fee.coupon})`, `−${money(fee.discount)}`) : ""}
  ${line("Subtotal", money(fee.subtotal))}
  ${line("IGST (18%)", money(fee.igst))}
  ${line("Total paid", money(p.amount), true)}
</table>
<div class="note">Test mode: this invoice was generated before online payments went live, so no money was taken.</div>
<footer class="muted">No refund will be given if the candidate is later found ineligible.</footer>
<p style="margin-top:28px"><button onclick="window.print()" style="font:inherit;padding:10px 16px;border:0;border-radius:4px;background:#e4002b;color:#fff;cursor:pointer">Print or save as PDF</button></p>
</div></body></html>`;
  return html;
}

/** open the invoice in a new tab; where pop-ups are blocked, download it */
export function openInvoice(app: Application) {
  const html = invoiceHtml(app);
  if (!html) return;
  const tab = window.open("", "_blank");
  if (tab) {
    tab.document.open();
    tab.document.write(html);
    tab.document.close();
    return;
  }
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `uGSOT-invoice-${app.payment!.reference}.html`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
