export function extractCleanData(fields: Record<string, string>) {
  function normalizeTextractFields(rawFields: Record<string, string>) {
    const fixed: Record<string, string> = {};
    const knownKeys = ["FN", "LN", "DL", "DOB", "EXP", "ISS", "CLASS", "ADDR", "ADDRESS", "NAME"];
    for (const [rawKey, rawValue] of Object.entries(rawFields)) {
      const key = rawKey.trim().toUpperCase();
      const val = rawValue?.trim() || "";
      const mergedKey = knownKeys.find(k => key.startsWith(k) && key.length > k.length);
      if (mergedKey) {
        const splitValue = key.slice(mergedKey.length).trim();
        fixed[mergedKey] = splitValue && !val.startsWith(splitValue)
          ? `${splitValue} ${val}` : val;
      } else {
        fixed[key] = val;
      }
    }
    return fixed;
  }

  function toHtmlDate(str: string) {
    const match = str.match(/^(\d{2})[\/.](\d{2})[\/.](\d{4})$/);
    return match ? `${match[3]}-${match[1]}-${match[2]}` : "";
  }

  // --- main logic ---
  const cleanedFields = normalizeTextractFields(fields);
  const clean = (v: string) => v.replace(/\s+/g, " ").replace(/(\d)\s+(\d)/g, "$1$2").trim();
  const entries = Object.entries(cleanedFields).map(([k, v]) => [k.toUpperCase(), clean(v)]);
  const flatText = entries.map(([_, v]) => v).join(" ");
  const findValue = (patterns: string[]) => {
    const match = entries.find(([k]) => patterns.some((p) => k.includes(p.toUpperCase())));
    return match ? clean(match[1]) : "";
  };
  // LICENSE NUMBER
  const licenseNo = findValue(["DL", "LIC", "ID"]) || flatText.match(/\b[A-Z]?\s?\d{5,}[A-Z0-9]*\b/)?.[0] || "";
  const rawText = flatText.replace(/\s+/g, " ");
  const flexibleDatePattern = /\b(\d\s*\d)[\/.](\d\s*\d)[\/.](\d\s*\d\s*\d\s*\d)\b/g;
  const allDates = [];
  let match;
  while ((match = flexibleDatePattern.exec(rawText)) !== null) {
    const cleanedDate = match[0].replace(/\s+/g, "");
    allDates.push(cleanedDate);
  }
  const currentYear = new Date().getFullYear();
  let dob = "";
  let expiryDate = "";
  for (const date of allDates) {
    const parts = date.split(/[/.]/);
    const year = parseInt(parts[2].length === 2 ? `19${parts[2]}` : parts[2]);
    if (year < currentYear - 16 && !dob) dob = date;
    else if (year >= currentYear && !expiryDate) expiryDate = date;
  }
  if (!expiryDate) expiryDate = findValue(["EXP", "EXPI"]);
  if (!dob) dob = findValue(["DOB", "BIRTH"]);
  // NAME DETECTION
  let firstName = "";
  let lastName = "";
  const nameCandidates = entries.filter(([k]) => k.match(/FN|LN|NAME/)).map(([_, v]) => v);
  if (nameCandidates.length === 1) {
    const text = nameCandidates[0];
    const parts = text.split(/\d|STREET|ROAD|AVE/i)[0].trim().split(" ");
    if (parts.length >= 2) {
      firstName = parts.slice(1).join(" ");
      lastName = parts[0];
    }
  } else if (nameCandidates.length >= 2) {
    firstName = nameCandidates[0];
    lastName = nameCandidates[1];
  } else {
    const nameMatch = flatText.match(/\b[A-Z]{3,}\s+[A-Z]{3,}(\s+[A-Z]{3,})?\b/);
    if (nameMatch) {
      const parts = nameMatch[0].split(" ");
      firstName = parts.slice(0, -1).join(" ");
      lastName = parts[parts.length - 1];
    }
  }
  // ADDRESS EXTRACTION
  let address = "";
  const addressMatch = flatText.match(/\d+\s+[\w\s,]+(ST|RD|ROAD|STREET|AVE|BLVD|CA|TX|NY|MI|WA|FL|OH|IL|PA)/i);
  if (addressMatch) address = clean(addressMatch[0]);
  address = address.replace(new RegExp(`${firstName}|${lastName}`, "gi"), "").replace(/\s+/g, " ").trim();
  return { firstName, lastName, licenseNo, expiryDate: toHtmlDate(expiryDate), dob: toHtmlDate(dob), address };
}
