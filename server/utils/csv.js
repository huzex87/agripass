// Minimal, dependency-free CSV serializer.
// Escapes per RFC 4180: fields containing comma, quote, CR or LF are wrapped in
// double quotes with internal quotes doubled. A leading BOM makes Excel read
// UTF-8 (e.g. ₦, accented names) correctly.
const escapeField = (value) => {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

// headers: array of column titles. rows: array of arrays (same order).
const toCSV = (headers, rows) => {
  const lines = [headers.map(escapeField).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeField).join(","));
  }
  return "﻿" + lines.join("\r\n");
};

module.exports = { toCSV, escapeField };
