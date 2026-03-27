const PII_PATTERNS = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL]" },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[SSN]" },
  { pattern: /\b\d{9}\b/g, replacement: "[SSN]" },
  { pattern: /"(access_?token|refresh_?token|accessToken|refreshToken)"\s*:\s*"[^"]+"/gi, replacement: '"$1":"[REDACTED]"' },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, replacement: "Bearer [REDACTED]" },
  { pattern: /sk_(test|live)_[A-Za-z0-9]+/g, replacement: "sk_$1_[REDACTED]" },
  { pattern: /whsec_[A-Za-z0-9]+/g, replacement: "whsec_[REDACTED]" },
  { pattern: /re_[A-Za-z0-9]+/g, replacement: "re_[REDACTED]" },
];

function redactPii(message: string): string {
  let redacted = message;
  for (const { pattern, replacement } of PII_PATTERNS) {
    redacted = redacted.replace(pattern, replacement);
  }
  return redacted;
}

function formatArgs(args: any[]): string {
  return args
    .map((arg) => {
      if (typeof arg === "string") return redactPii(arg);
      if (arg instanceof Error) return redactPii(`${arg.message}\n${arg.stack || ""}`);
      try {
        return redactPii(JSON.stringify(arg));
      } catch {
        return String(arg);
      }
    })
    .join(" ");
}

export const log = {
  info(...args: any[]) {
    console.log(`[INFO]`, formatArgs(args));
  },
  warn(...args: any[]) {
    console.warn(`[WARN]`, formatArgs(args));
  },
  error(...args: any[]) {
    console.error(`[ERROR]`, formatArgs(args));
  },
};
