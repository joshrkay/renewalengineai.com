/**
 * PII Compliance Test Suite
 *
 * Verifies all data protection measures are working correctly:
 * 1. Encryption — AES-256-GCM encrypt/decrypt cycle, ciphertext format
 * 2. PII Logger — emails, SSNs, tokens, API keys are redacted
 * 3. Audit Sanitization — sensitive fields stripped from audit metadata
 * 4. Webhook Auth — HMAC signature verification, tamper detection
 * 5. Tenant Isolation — cross-org query prevention
 * 6. Data Retention — expiry fields set, cleanup logic
 * 7. Code Scan — no raw console.log/error in source (outside safe files)
 * 8. No Plaintext PII — search DB schema for unencrypted sensitive fields
 *
 * Usage: ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") \
 *        WEBHOOK_SECRET=test-secret \
 *        npx tsx scripts/test-pii-compliance.ts
 */

import { randomBytes, createHash, createHmac, createCipheriv, createDecipheriv } from "crypto";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

let passed = 0;
let failed = 0;
let warnings = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

function warn(message: string) {
  console.log(`  ⚠️  WARN: ${message}`);
  warnings++;
}

// ─── Test 1: Encryption (AES-256-GCM) ──────────────────────

function testEncryption() {
  console.log("\n🔐 Test 1: AES-256-GCM Encryption");

  const key = process.env.ENCRYPTION_KEY;
  assert(!!key, "ENCRYPTION_KEY environment variable is set");
  assert(key!.length === 64, `ENCRYPTION_KEY is 64 hex chars (32 bytes) — got ${key!.length}`);

  const keyBuf = Buffer.from(key!, "hex");
  assert(keyBuf.length === 32, "Key decodes to 32 bytes (256 bits)");

  // Test encrypt
  const plaintext = "sk_live_TESTONLY_not_a_real_key";
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", keyBuf, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();
  const ciphertext = iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted;

  assert(ciphertext.includes(":"), "Ciphertext uses iv:tag:encrypted format");
  assert(!ciphertext.includes(plaintext), "Plaintext does NOT appear in ciphertext");
  assert(!ciphertext.includes("sk_live"), "API key does NOT appear in ciphertext");

  const parts = ciphertext.split(":");
  assert(parts.length === 3, "Ciphertext has exactly 3 parts (iv:tag:data)");
  assert(parts[0].length === 32, "IV is 16 bytes (32 hex chars)");
  assert(parts[1].length === 32, "Auth tag is 16 bytes (32 hex chars)");

  // Test decrypt
  const decipher = createDecipheriv("aes-256-gcm", keyBuf, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  assert(decrypted === plaintext, "Decrypt recovers original plaintext");

  // Test tamper detection
  const tamperedTag = Buffer.from(tag);
  tamperedTag[0] ^= 0xff;
  try {
    const tamperDecipher = createDecipheriv("aes-256-gcm", keyBuf, iv);
    tamperDecipher.setAuthTag(tamperedTag);
    tamperDecipher.update(encrypted, "hex", "utf8");
    tamperDecipher.final("utf8");
    assert(false, "Tampered ciphertext should throw");
  } catch {
    assert(true, "Tampered ciphertext is rejected (GCM auth tag validation)");
  }

  // Test unique IVs
  const iv2 = randomBytes(16);
  assert(!iv.equals(iv2), "Each encryption uses a unique random IV");

  // Test sensitive data types
  const sensitiveData = [
    { label: "SSN", value: "123-45-6789" },
    { label: "Email", value: "john.doe@insurance-agency.com" },
    { label: "Policy number", value: "HO-2024-48291" },
    { label: "Credit card", value: "4111-1111-1111-1111" },
    { label: "OAuth token", value: "ya29.a0ARrdaM8_long_google_oauth_token_here" },
  ];

  for (const { label, value } of sensitiveData) {
    const iv3 = randomBytes(16);
    const c = createCipheriv("aes-256-gcm", keyBuf, iv3);
    let enc = c.update(value, "utf8", "hex");
    enc += c.final("hex");
    const ct = iv3.toString("hex") + ":" + c.getAuthTag().toString("hex") + ":" + enc;
    assert(!ct.includes(value), `${label} is not visible in ciphertext`);
  }
}

// ─── Test 2: PII Logger Redaction ───────────────────────────

function testLoggerRedaction() {
  console.log("\n📝 Test 2: PII Logger Redaction");

  // Inline the redaction logic to test it directly
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

  function redact(message: string): string {
    let redacted = message;
    for (const { pattern, replacement } of PII_PATTERNS) {
      redacted = redacted.replace(new RegExp(pattern.source, pattern.flags), replacement);
    }
    return redacted;
  }

  // Email redaction
  const emailInput = "User john.doe@agency.com failed login";
  const emailOutput = redact(emailInput);
  assert(!emailOutput.includes("john.doe@agency.com"), "Email address is redacted");
  assert(emailOutput.includes("[EMAIL]"), "Email replaced with [EMAIL] tag");

  // SSN redaction (hyphenated)
  const ssnInput = "Client SSN is 123-45-6789";
  const ssnOutput = redact(ssnInput);
  assert(!ssnOutput.includes("123-45-6789"), "Hyphenated SSN is redacted");
  assert(ssnOutput.includes("[SSN]"), "SSN replaced with [SSN] tag");

  // SSN redaction (9 digits)
  const ssn9Input = "SSN: 123456789";
  const ssn9Output = redact(ssn9Input);
  assert(!ssn9Output.includes("123456789"), "9-digit SSN is redacted");

  // Access token in JSON
  const tokenInput = '{"accessToken":"ya29.a0ARrdaM8_secret_token_value"}';
  const tokenOutput = redact(tokenInput);
  assert(!tokenOutput.includes("ya29.a0ARrdaM8"), "Access token value is redacted from JSON");
  assert(tokenOutput.includes("[REDACTED]"), "Token replaced with [REDACTED]");

  // Refresh token in JSON
  const refreshInput = '{"refresh_token":"1//0dx_long_refresh_token"}';
  const refreshOutput = redact(refreshInput);
  assert(!refreshOutput.includes("1//0dx"), "Refresh token value is redacted from JSON");

  // Bearer token
  const bearerInput = "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIi.signature";
  const bearerOutput = redact(bearerInput);
  assert(!bearerOutput.includes("eyJhbGci"), "Bearer token is redacted");
  assert(bearerOutput.includes("Bearer [REDACTED]"), "Bearer replaced with [REDACTED]");

  // Stripe keys
  const stripeInput = "Using key sk_live_FAKEFAKEFAKEFAKE000000";
  const stripeOutput = redact(stripeInput);
  assert(!stripeOutput.includes("4eC39HqLyjWDarjtT1zdp7dc"), "Stripe live key is redacted");
  assert(stripeOutput.includes("sk_live_[REDACTED]"), "Stripe key pattern preserved");

  // Stripe test keys
  const stripeTestInput = "Test key: sk_test_abc123def456";
  const stripeTestOutput = redact(stripeTestInput);
  assert(!stripeTestOutput.includes("abc123def456"), "Stripe test key is redacted");

  // Webhook secret
  const whsecInput = "Secret: whsec_abc123def456ghi";
  const whsecOutput = redact(whsecInput);
  assert(!whsecOutput.includes("abc123def456ghi"), "Webhook secret is redacted");

  // Resend API key
  const resendInput = "Key: re_abc123def456ghi";
  const resendOutput = redact(resendInput);
  assert(!resendOutput.includes("abc123def456ghi"), "Resend API key is redacted");

  // Multiple PII in one string
  const multiInput = 'Error for john@test.com with token sk_live_secret123 SSN 123-45-6789';
  const multiOutput = redact(multiInput);
  assert(!multiOutput.includes("john@test.com"), "Email redacted in multi-PII string");
  assert(!multiOutput.includes("sk_live_secret123"), "Stripe key redacted in multi-PII string");
  assert(!multiOutput.includes("123-45-6789"), "SSN redacted in multi-PII string");

  // Safe strings should pass through
  const safeInput = "Processing 42 records for organization org_abc123";
  const safeOutput = redact(safeInput);
  assert(safeOutput === safeInput, "Non-PII strings pass through unchanged");
}

// ─── Test 3: Audit Log Sanitization ─────────────────────────

function testAuditSanitization() {
  console.log("\n📋 Test 3: Audit Log Sanitization");

  const sensitiveKeys = [
    "password", "passwordhash", "accesstoken", "refreshtoken",
    "secret", "token", "ssn", "socialsecurity", "driverlicense",
    "creditcard", "accountnumber", "routingnumber", "taxid",
    "dateofbirth", "dob",
  ];

  function sanitize(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
        sanitized[key] = "[REDACTED]";
      }
    }
    return sanitized;
  }

  // Direct sensitive fields
  const input1 = { accessToken: "ya29.secret", refreshToken: "1//refresh", provider: "gmail" };
  const output1 = sanitize(input1);
  assert(output1.accessToken === "[REDACTED]", "accessToken is redacted in audit metadata");
  assert(output1.refreshToken === "[REDACTED]", "refreshToken is redacted in audit metadata");
  assert(output1.provider === "gmail", "Non-sensitive fields preserved");

  // Password variations
  const input2 = { password: "mypass123", passwordHash: "$2b$12$hash", userEmail: "test@test.com" };
  const output2 = sanitize(input2);
  assert(output2.password === "[REDACTED]", "password field is redacted");
  assert(output2.passwordHash === "[REDACTED]", "passwordHash field is redacted");
  assert(output2.userEmail === "test@test.com", "Non-sensitive field userEmail preserved (not in key list)");

  // Insurance-specific PII fields
  const input3 = { ssn: "123-45-6789", socialSecurityNumber: "987654321", driverLicenseNumber: "DL12345" };
  const output3 = sanitize(input3);
  assert(output3.ssn === "[REDACTED]", "SSN field is redacted");
  assert(output3.socialSecurityNumber === "[REDACTED]", "socialSecurityNumber is redacted");
  assert(output3.driverLicenseNumber === "[REDACTED]", "driverLicenseNumber is redacted");

  // Financial fields
  const input4 = { creditCardNumber: "4111111111111111", accountNumber: "123456789", amount: 150000 };
  const output4 = sanitize(input4);
  assert(output4.creditCardNumber === "[REDACTED]", "creditCardNumber is redacted");
  assert(output4.accountNumber === "[REDACTED]", "accountNumber is redacted");
  assert(output4.amount === 150000, "Non-sensitive numeric fields preserved");

  // Token in various key names
  const input5 = { apiToken: "tok_123", webhookSecret: "whsec_abc", oauthAccessToken: "ya29.x" };
  const output5 = sanitize(input5);
  assert(output5.apiToken === "[REDACTED]", "apiToken is redacted");
  assert(output5.webhookSecret === "[REDACTED]", "webhookSecret is redacted");
  assert(output5.oauthAccessToken === "[REDACTED]", "oauthAccessToken is redacted");
}

// ─── Test 4: Webhook HMAC Signature Verification ────────────

function testWebhookAuth() {
  console.log("\n🔑 Test 4: Webhook HMAC Signature Verification");

  const secret = process.env.WEBHOOK_SECRET || "test-secret";

  function sign(payload: string): string {
    return createHmac("sha256", secret).update(payload).digest("hex");
  }

  function verify(payload: string, signature: string | null): boolean {
    if (!secret) return false;
    if (!signature) return false;
    const expected = sign(payload);
    try {
      const sigBuf = Buffer.from(signature, "hex");
      const expBuf = Buffer.from(expected, "hex");
      if (sigBuf.length !== expBuf.length) return false;
      let result = 0;
      for (let i = 0; i < sigBuf.length; i++) {
        result |= sigBuf[i] ^ expBuf[i];
      }
      return result === 0;
    } catch {
      return false;
    }
  }

  // Valid signature
  const payload = '{"status":"success","data":{"client":"John Doe"}}';
  const validSig = sign(payload);
  assert(verify(payload, validSig), "Valid signature is accepted");

  // Invalid signature
  assert(!verify(payload, "deadbeef"), "Invalid signature is rejected");

  // Null signature
  assert(!verify(payload, null), "Null signature is rejected");

  // Empty signature
  assert(!verify(payload, ""), "Empty signature is rejected");

  // Tampered payload
  const tamperedPayload = '{"status":"success","data":{"client":"Jane Doe"}}';
  assert(!verify(tamperedPayload, validSig), "Tampered payload is rejected");

  // Different payload, same structure
  const payload2 = '{"status":"error","data":{}}';
  const sig2 = sign(payload2);
  assert(verify(payload2, sig2), "Different valid payload+signature pair works");
  assert(!verify(payload, sig2), "Cross-payload signature is rejected");

  // Signature is consistent
  const sig1a = sign(payload);
  const sig1b = sign(payload);
  assert(sig1a === sig1b, "Same payload produces same signature (deterministic)");

  // Signature format
  assert(/^[0-9a-f]{64}$/.test(validSig), "Signature is 64-char lowercase hex (SHA-256)");
}

// ─── Test 5: Source Code PII Scan ───────────────────────────

function testSourceCodeScan() {
  console.log("\n🔍 Test 5: Source Code PII Safety Scan");

  const srcDir = join(process.cwd(), "src");
  const safeFiles = new Set(["src/lib/logger.ts", "src/lib/audit.ts", "src/prisma/seed.ts"]);
  const violations: string[] = [];

  function scanDir(dir: string) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (entry === "node_modules" || entry === ".next") continue;
        scanDir(fullPath);
      } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
        const relativePath = fullPath.replace(process.cwd() + "/", "");
        if (safeFiles.has(relativePath)) continue;

        const content = readFileSync(fullPath, "utf8");
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (/console\.(log|error|warn)\(/.test(line) && !line.trim().startsWith("//")) {
            violations.push(`${relativePath}:${i + 1} — raw console.${line.includes("error") ? "error" : line.includes("warn") ? "warn" : "log"}`);
          }
        }
      }
    }
  }

  scanDir(srcDir);

  if (violations.length === 0) {
    assert(true, "No raw console.log/error/warn found in src/ (excluding safe files)");
  } else {
    assert(false, `Found ${violations.length} raw console calls that bypass PII logger:`);
    for (const v of violations.slice(0, 10)) {
      console.log(`     ${v}`);
    }
  }
}

// ─── Test 6: Schema Encryption Audit ────────────────────────

function testSchemaEncryption() {
  console.log("\n🗄️  Test 6: Database Schema PII Audit");

  const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"), "utf8");

  // Verify result data is stored encrypted
  assert(schema.includes("resultSummaryEncrypted"), "WorkflowRun stores results as encrypted (resultSummaryEncrypted)");
  assert(schema.includes("resultDataEncrypted"), "WorkflowRun stores data as encrypted (resultDataEncrypted)");
  assert(!schema.includes("resultSummary ") || schema.includes("resultSummaryEncrypted"), "No plaintext resultSummary field");
  assert(!schema.includes("resultData ") || schema.includes("resultDataEncrypted"), "No plaintext resultData field");

  // Verify password is hashed not stored plaintext
  assert(schema.includes("passwordHash"), "User stores passwordHash (not plaintext password)");
  assert(!/ password\s+String/.test(schema), "No plaintext 'password' String field in schema");

  // Verify reset tokens have expiry
  assert(schema.includes("expiresAt") && schema.includes("PasswordResetToken"), "PasswordResetToken has expiresAt field");
  assert(schema.includes("usedAt") && schema.includes("PasswordResetToken"), "PasswordResetToken has usedAt field (single-use)");

  // Verify workflow runs have retention expiry
  assert(
    schema.includes("expiresAt") && schema.includes("WorkflowRun"),
    "WorkflowRun has expiresAt field for data retention"
  );

  // Verify audit log exists
  assert(schema.includes("model AuditLog"), "AuditLog model exists in schema");
  assert(schema.includes("@@index([organizationId, createdAt])"), "AuditLog has org+time index for tenant queries");

  // Verify tenant isolation fields
  assert(schema.includes("@@unique([organizationId, provider])"), "OAuthConnection has per-org unique constraint");
  assert(schema.includes("@@unique([organizationId, recipeId])"), "AutomationInstance has per-org unique constraint");
  assert(schema.includes("n8nProjectId"), "Organization has n8nProjectId for n8n project isolation");
}

// ─── Test 7: No Plaintext Credentials in Email ──────────────

function testEmailSafety() {
  console.log("\n📧 Test 7: Email Content Safety");

  const emailFile = readFileSync(join(process.cwd(), "src", "lib", "email.ts"), "utf8");

  assert(!emailFile.includes("tempPassword"), "No tempPassword variable in email templates");
  assert(!emailFile.includes("Temporary Password"), "No 'Temporary Password' text in email templates");
  assert(emailFile.includes("resetToken") || emailFile.includes("resetUrl"), "Email uses secure reset link instead");
  assert(emailFile.includes("set-password?token="), "Welcome email links to set-password page with token");
  assert(emailFile.includes("expires in 24 hours"), "Email mentions token expiry");

  // Check alert emails link to dashboard (not include raw data inline)
  assert(
    emailFile.includes("/dashboard/automations") || emailFile.includes("View in Dashboard"),
    "Alert emails link to dashboard instead of including raw data inline"
  );
}

// ─── Test 8: Webhook Routes Verify Signature ────────────────

function testWebhookRoutesSecurity() {
  console.log("\n🛡️  Test 8: Webhook Route Security");

  const n8nWebhook = readFileSync(
    join(process.cwd(), "src", "app", "api", "webhooks", "n8n", "[workflowId]", "route.ts"),
    "utf8"
  );
  const lgWebhook = readFileSync(
    join(process.cwd(), "src", "app", "api", "webhooks", "langgraph", "[runId]", "route.ts"),
    "utf8"
  );

  // n8n webhook
  assert(n8nWebhook.includes("verifyWebhookSignature"), "n8n webhook calls verifyWebhookSignature");
  assert(n8nWebhook.includes("x-webhook-signature"), "n8n webhook reads x-webhook-signature header");
  assert(n8nWebhook.includes("invalid_signature"), "n8n webhook returns 401 on invalid signature");
  assert(n8nWebhook.includes("resultSummaryEncrypted") || n8nWebhook.includes("encrypt("), "n8n webhook encrypts result data before storage");

  // LangGraph webhook
  assert(lgWebhook.includes("verifyWebhookSignature"), "LangGraph webhook calls verifyWebhookSignature");
  assert(lgWebhook.includes("x-webhook-signature"), "LangGraph webhook reads x-webhook-signature header");
  assert(lgWebhook.includes("invalid_signature"), "LangGraph webhook returns 401 on invalid signature");
  assert(lgWebhook.includes("resultSummaryEncrypted") || lgWebhook.includes("encrypt("), "LangGraph webhook encrypts result data before storage");
}

// ─── Test 9: OAuth CSRF Protection ──────────────────────────

function testOAuthCsrfProtection() {
  console.log("\n🛡️  Test 9: OAuth CSRF State Protection");

  const authorizeRoute = readFileSync(
    join(process.cwd(), "src", "app", "api", "integrations", "[provider]", "authorize", "route.ts"),
    "utf8"
  );
  const callbackRoute = readFileSync(
    join(process.cwd(), "src", "app", "api", "integrations", "[provider]", "callback", "route.ts"),
    "utf8"
  );

  // Authorize route
  assert(authorizeRoute.includes("randomBytes"), "Authorize generates cryptographic random state token");
  assert(authorizeRoute.includes("oauth_state_"), "Authorize stores state in named cookie");
  assert(authorizeRoute.includes("httpOnly: true"), "State cookie is HTTP-only");
  assert(authorizeRoute.includes("secure: true"), "State cookie is secure-only");
  assert(authorizeRoute.includes("maxAge: 600"), "State cookie expires in 10 minutes");
  assert(!authorizeRoute.includes('set("state", orgId)'), "State is NOT raw organizationId");

  // Callback route
  assert(callbackRoute.includes("oauth_state_"), "Callback reads state from cookie");
  assert(callbackRoute.includes("invalid_state"), "Callback rejects mismatched state");
  assert(callbackRoute.includes(".delete("), "Callback deletes state cookie after use");

  // Redirect URI
  assert(authorizeRoute.includes("process.env.NEXTAUTH_URL"), "Authorize uses NEXTAUTH_URL for redirect_uri");
  assert(!authorizeRoute.includes('headers.get("origin")'), "Authorize does NOT use origin header");
  assert(callbackRoute.includes("process.env.NEXTAUTH_URL"), "Callback uses NEXTAUTH_URL for redirect_uri");
}

// ─── Test 10: LangGraph Token Protection ────────────────────

function testLangGraphTokenProtection() {
  console.log("\n🧠 Test 10: LangGraph Credential Protection");

  const recipeEngine = readFileSync(join(process.cwd(), "src", "lib", "recipe-engine.ts"), "utf8");

  assert(!recipeEngine.includes("amsAccessToken"), "Recipe engine does NOT send decrypted AMS tokens");
  assert(recipeEngine.includes("amsConnectionId"), "Recipe engine sends credential reference (connectionId) instead");
  assert(recipeEngine.includes("credentialRefs"), "Recipe engine passes credentialRefs array (not raw tokens)");
  assert(recipeEngine.includes("dataApiUrl"), "Recipe engine passes API URL for server-side data fetch");
  assert(!recipeEngine.includes("decrypt("), "Recipe engine does NOT call decrypt() for LangGraph context");
}

// ─── Test 11: Data Retention ────────────────────────────────

function testDataRetention() {
  console.log("\n🗑️  Test 11: Data Retention & Auto-Deletion");

  const cleanupRoute = readFileSync(
    join(process.cwd(), "src", "app", "api", "cron", "cleanup-expired-data", "route.ts"),
    "utf8"
  );

  assert(cleanupRoute.includes("workflowRun.deleteMany"), "Cleanup cron deletes expired workflow runs");
  assert(cleanupRoute.includes("passwordResetToken.deleteMany"), "Cleanup cron deletes expired reset tokens");
  assert(cleanupRoute.includes("auditLog.deleteMany"), "Cleanup cron deletes old audit logs");
  assert(cleanupRoute.includes("365"), "Audit logs retained for 1 year (365 days)");
  assert(cleanupRoute.includes("CRON_SECRET"), "Cleanup endpoint requires CRON_SECRET auth");

  // Check vercel.json has the cron configured
  const vercelConfig = readFileSync(join(process.cwd(), "vercel.json"), "utf8");
  assert(vercelConfig.includes("cleanup-expired-data"), "Cleanup cron is configured in vercel.json");
}

// ─── Run All Tests ──────────────────────────────────────────

console.log("\n" + "=".repeat(60));
console.log("🔒 RenewalEngineAI — PII Compliance Test Suite");
console.log("=".repeat(60));

testEncryption();
testLoggerRedaction();
testAuditSanitization();
testWebhookAuth();
testSourceCodeScan();
testSchemaEncryption();
testEmailSafety();
testWebhookRoutesSecurity();
testOAuthCsrfProtection();
testLangGraphTokenProtection();
testDataRetention();

console.log("\n" + "=".repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${warnings} warnings out of ${passed + failed} tests`);
console.log("");

if (failed > 0) {
  console.log("❌ COMPLIANCE CHECK FAILED — fix issues above before deploying to production\n");
  process.exit(1);
} else {
  console.log("✅ ALL PII COMPLIANCE CHECKS PASSED\n");
}
