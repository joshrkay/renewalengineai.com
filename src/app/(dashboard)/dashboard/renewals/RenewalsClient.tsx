"use client";

import { useState } from "react";
import { Plus, Sparkles, Send, Edit2, X, Loader2, FileUp } from "lucide-react";

interface RenewalDraft {
  id: string;
  subject: string;
  body: string;
  status: "PENDING" | "SENT" | "CANCELLED";
  sentAt: string | null;
}

interface Policy {
  id: string;
  clientName: string;
  clientEmail: string;
  policyNumber: string;
  policyType: string;
  carrier: string | null;
  premiumAmount: number | null;
  expiresAt: string;
  renewalDrafts: RenewalDraft[];
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function urgencyClass(days: number): string {
  if (days <= 7) return "bg-red-100 text-red-800";
  if (days <= 30) return "bg-orange-100 text-orange-800";
  return "bg-amber-100 text-amber-800";
}

export default function RenewalsClient({
  initialPolicies,
  showAddButton = false,
  primaryCta = false,
}: {
  initialPolicies: Policy[];
  showAddButton?: boolean;
  primaryCta?: boolean;
}) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ policyId: string; draft: RenewalDraft } | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add policy form state
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    policyNumber: "",
    policyType: "Auto",
    carrier: "",
    premiumAmount: "",
    expiresAt: "",
    notes: "",
  });

  async function handleAddPolicy(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/renewals/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const policy = await res.json();
      setPolicies((prev) => [...prev, { ...policy, renewalDrafts: [] }]);
      setShowAddForm(false);
      setForm({ clientName: "", clientEmail: "", policyNumber: "", policyType: "Auto", carrier: "", premiumAmount: "", expiresAt: "", notes: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleGenerate(policyId: string) {
    setGenerating(policyId);
    setError(null);
    try {
      const res = await fetch("/api/renewals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const draft = await res.json();
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === policyId ? { ...p, renewalDrafts: [draft, ...p.renewalDrafts] } : p
        )
      );
      setEditDraft({ policyId, draft });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(null);
    }
  }

  async function handleSend(draftId: string, policyId: string, subject?: string, body?: string) {
    setSending(draftId);
    setError(null);
    try {
      const res = await fetch("/api/renewals/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, subject, body }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === policyId
            ? { ...p, renewalDrafts: p.renewalDrafts.map((d) => (d.id === draftId ? updated : d)) }
            : p
        )
      );
      setEditDraft(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(null);
    }
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/renewals/policies/import", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const { policies: imported } = await res.json();
      setPolicies((prev) => [...prev, ...imported.map((p: Policy) => ({ ...p, renewalDrafts: [] }))]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImportLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {/* Action buttons */}
      {showAddButton && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              primaryCta
                ? "bg-black text-white hover:bg-neutral-800"
                : "bg-white border border-neutral-200 text-black hover:bg-neutral-50"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Policy
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white border border-neutral-200 text-black hover:bg-neutral-50 cursor-pointer transition-colors">
            {importLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
          </label>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add policy form */}
      {showAddForm && (
        <div className="mb-6 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Add Policy</h3>
            <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleAddPolicy} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Client Name *" value={form.clientName} onChange={(v) => setForm((f) => ({ ...f, clientName: v }))} />
            <Field label="Client Email *" type="email" value={form.clientEmail} onChange={(v) => setForm((f) => ({ ...f, clientEmail: v }))} />
            <Field label="Policy Number *" value={form.policyNumber} onChange={(v) => setForm((f) => ({ ...f, policyNumber: v }))} />
            <div>
              <label className="block text-sm font-semibold mb-1">Policy Type *</label>
              <select
                value={form.policyType}
                onChange={(e) => setForm((f) => ({ ...f, policyType: e.target.value }))}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {["Auto", "Home", "Commercial", "Life", "Health", "Umbrella", "Other"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <Field label="Carrier" value={form.carrier} onChange={(v) => setForm((f) => ({ ...f, carrier: v }))} />
            <Field label="Premium ($)" type="number" value={form.premiumAmount} onChange={(v) => setForm((f) => ({ ...f, premiumAmount: v }))} />
            <Field label="Expiry Date *" type="date" value={form.expiresAt} onChange={(v) => setForm((f) => ({ ...f, expiresAt: v }))} />
            <Field label="Notes" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} />
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold">Cancel</button>
              <button type="submit" disabled={addLoading} className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold flex items-center gap-2">
                {addLoading && <Loader2 className="w-4 h-4 animate-spin" />} Add Policy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Policies table */}
      {policies.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-500 text-xs font-semibold uppercase tracking-wide">
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Policy</th>
                <th className="text-left px-4 py-3">Expires</th>
                <th className="text-left px-4 py-3">Draft</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => {
                const days = daysUntil(policy.expiresAt);
                const latestDraft = policy.renewalDrafts[0] ?? null;
                return (
                  <tr key={policy.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{policy.clientName}</p>
                      <p className="text-neutral-500 text-xs">{policy.clientEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{policy.policyType}</p>
                      {policy.carrier && <p className="text-neutral-500 text-xs">{policy.carrier}</p>}
                      <p className="text-neutral-400 text-xs">{policy.policyNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${urgencyClass(days)}`}>
                        {days}d
                      </span>
                      <p className="text-neutral-500 text-xs mt-1">
                        {new Date(policy.expiresAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {latestDraft ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            latestDraft.status === "SENT"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {latestDraft.status === "SENT" ? "Sent" : "Draft Ready"}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">No draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {latestDraft && latestDraft.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => setEditDraft({ policyId: policy.id, draft: latestDraft })}
                              className="p-1.5 rounded-lg hover:bg-neutral-100"
                              title="Edit draft"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSend(latestDraft.id, policy.id)}
                              disabled={sending === latestDraft.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-neutral-800"
                            >
                              {sending === latestDraft.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              Send
                            </button>
                          </>
                        )}
                        {(!latestDraft || latestDraft.status === "SENT") && (
                          <button
                            onClick={() => handleGenerate(policy.id)}
                            disabled={generating === policy.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-neutral-50"
                          >
                            {generating === policy.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            {latestDraft ? "Re-generate" : "Generate Draft"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit draft modal */}
      {editDraft && (
        <DraftModal
          draft={editDraft.draft}
          policyId={editDraft.policyId}
          onClose={() => setEditDraft(null)}
          onSend={handleSend}
          sending={sending}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

function DraftModal({
  draft,
  policyId,
  onClose,
  onSend,
  sending,
}: {
  draft: RenewalDraft;
  policyId: string;
  onClose: () => void;
  onSend: (draftId: string, policyId: string, subject?: string, body?: string) => void;
  sending: string | null;
}) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h3 className="font-bold text-lg">Review & Edit Draft</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-neutral-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold">Cancel</button>
          <button
            onClick={() => onSend(draft.id, policyId, subject, body)}
            disabled={sending === draft.id}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-bold"
          >
            {sending === draft.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
