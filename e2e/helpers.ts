import fs from 'fs';
import path from 'path';

const accountFile = path.join(__dirname, '.auth/account.json');

export function getAccountId(): string {
  const data = JSON.parse(fs.readFileSync(accountFile, 'utf-8'));
  return data.accountId;
}

export function settingsUrl(subpath: string): string {
  return `/app/accounts/${getAccountId()}/settings/${subpath}`;
}

export function profileUrl(subpath: string = 'settings'): string {
  return `/app/accounts/${getAccountId()}/profile/${subpath}`;
}

export function reportsUrl(subpath: string): string {
  return `/app/accounts/${getAccountId()}/reports/${subpath}`;
}

export function conversationsUrl(): string {
  return `/app/accounts/${getAccountId()}/conversations`;
}

export function contactsUrl(): string {
  return `/app/accounts/${getAccountId()}/contacts`;
}
