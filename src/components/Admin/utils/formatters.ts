// Formatting utilities for the admin dashboard
import { MEMORY_THRESHOLDS } from '../config/constants';

export function html(str: string | number): string {
  return String(str).replace(/[&<>]/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  }[s] || s));
}

export function formatJSON(obj: any): string {
  try {
    if (typeof obj === 'string') obj = JSON.parse(obj);
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export function formatMemoryGB(mem: string | number | null | undefined): string {
  if (mem == null) return '';
  let raw = String(mem).trim();
  
  // Extract digits if memory was part of a sentence
  const digits = raw.match(/\d+(?:[.,]\d+)?/g);
  if (digits && digits.length) raw = digits[0].replace(',', '.');
  
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return String(mem);
  
  // Heuristics: typical API returns KB (e.g., 67037080 -> ~64 GB)
  let gb: number;
  if (n > MEMORY_THRESHOLDS.VERY_LARGE) {
    gb = n / 1048576; // KB -> GiB
  } else if (n > MEMORY_THRESHOLDS.LARGE) {
    gb = n / 1024; // MB -> GiB
  } else if (n > MEMORY_THRESHOLDS.MEDIUM) {
    gb = n; // GB
  } else {
    // small numbers treat as GB already
    gb = n;
  }
  
  const roundedUp = Math.ceil(gb); // round up to the next whole GB
  return `${roundedUp} GB`;
}

export function formatUTCDate(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  
  // try parse ISO or epoch
  let d: Date;
  if (typeof val === 'number') {
    d = new Date(val > 1e12 ? val : val * 1000);
  } else {
    const s = String(val).trim();
    // if numeric string
    if (/^\d+$/.test(s)) {
      const num = Number(s);
      d = new Date(num > 1e12 ? num : num * 1000);
    } else {
      d = new Date(s);
    }
  }
  
  if (isNaN(d.getTime())) return String(val);
  
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const HH = String(d.getUTCHours()).padStart(2, '0');
  const MM = String(d.getUTCMinutes()).padStart(2, '0');
  const SS = String(d.getUTCSeconds()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS} UTC`;
}

export function memoryToGBNumber(mem: string | number | null | undefined): number {
  if (mem == null) return 0;
  let raw = String(mem).trim();
  const digits = raw.match(/\d+(?:[.,]\d+)?/g);
  if (digits && digits.length) raw = digits[0].replace(',', '.');
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return 0;
  if (n > MEMORY_THRESHOLDS.VERY_LARGE) return n / 1048576; // KB -> GiB
  if (n > MEMORY_THRESHOLDS.LARGE) return n / 1024;    // MB -> GiB
  return n; // assume already GB otherwise
}
