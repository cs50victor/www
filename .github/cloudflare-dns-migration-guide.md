# Cloudflare DNS Migration Guide

## Goal

Move an existing DNS zone into Cloudflare by copying the current DNS records table HTML, giving that HTML to an agent to generate a `.zone` file, reviewing the result, importing it into Cloudflare, and confirming all proxy toggles are off.

## 1. Capture the current DNS records

1. Open the current DNS provider's records page.
2. Copy the full table HTML for all DNS records. Do not use a screenshot.
3. Paste that HTML into an agent prompt so the agent can parse exact names, values, TTLs, and priorities.

## 2. Ask an agent to generate the zone file

Use a prompt like this:

```text
Convert this DNS records table HTML into a Cloudflare-importable `.zone` file for <domain>.

Requirements:
- Output a BIND zone file.
- Preserve record name, type, content, TTL, and priority.
- For CNAME, DNAME, MX, NS, PTR, and SRV targets, use fully qualified names with trailing periods where required.
- Flag conflicts, ambiguous rows, or missing values instead of guessing.
- Return the `.zone` file first, then a short review checklist.
```

Cloudflare's DNS import/export docs say the import file should be a BIND zone file, and they call out trailing-period requirements for record types whose content must be a fully qualified domain name: [Cloudflare DNS docs, Import and export records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/import-and-export/).

## 3. Review the generated `.zone` file before import

- Confirm the important records are present, especially apex, `www`, mail, DKIM, SPF, DMARC, MX, verification, and any app subdomains.
- Check TTLs and MX priorities.
- Check that any target hostname that should be fully qualified ends with a trailing period.
- Check for obvious conflicts, especially hostnames that try to mix `CNAME` with `A`, `AAAA`, or another `CNAME` at the same name.
- Remove anything the agent had to guess.

## 4. Import the `.zone` file into Cloudflare

1. Open Cloudflare for the target zone.
2. Go to `DNS` -> `Records`.
3. Open `Import and Export`.
4. Import the reviewed `.zone` file.
5. Leave `Proxy imported DNS records` unchecked.
6. After import, scan the records list and confirm every proxy toggle is off unless a specific record is intentionally meant to be proxied.

Cloudflare documents the dashboard import flow on the same page and notes that `Proxy imported DNS records` controls whether applicable imported records are proxied: [Cloudflare DNS docs, Import and export records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/import-and-export/).

## 5. Verify the imported zone

- Spot-check the most important records in Cloudflare after import.
- Confirm the imported record count is plausible.
- Export the Cloudflare zone as a backup once the import looks correct.
