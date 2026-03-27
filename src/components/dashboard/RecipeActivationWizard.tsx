"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Link2,
  Sparkles,
  Eye,
  Zap,
  Lock,
  AlertCircle,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
} from "lucide-react";

interface RecipeData {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  engineType: string;
  minimumTier: string;
  requiredIntegrations: string[];
  config: Record<string, any>;
}

interface WizardProps {
  recipe: RecipeData;
  userTier: string;
  hasTier: boolean;
  connectedProviders: string[];
  missingIntegrations: string[];
  isAlreadyActive: boolean;
  integrationLabels: Record<string, string>;
}

const STEPS = ["Overview", "Integrations", "Customize", "Preview", "Activate"];

const CHANNEL_ICONS: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

const ENGINE_LABELS: Record<string, { label: string; color: string }> = {
  N8N: { label: "Workflow Automation", color: "bg-orange-100 text-orange-700" },
  LANGGRAPH: { label: "AI-Powered", color: "bg-purple-100 text-purple-700" },
  HYBRID: { label: "AI + Automation", color: "bg-blue-100 text-blue-700" },
};

export function RecipeActivationWizard({
  recipe,
  userTier,
  hasTier,
  connectedProviders,
  missingIntegrations: initialMissing,
  isAlreadyActive,
  integrationLabels,
}: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<Record<string, any>>(recipe.config);
  const [missingIntegrations, setMissingIntegrations] = useState(initialMissing);
  const [activating, setActivating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [activated, setActivated] = useState(isAlreadyActive);
  const [error, setError] = useState("");

  const canProceedFromIntegrations = missingIntegrations.length === 0;

  const handleConnect = (provider: string) => {
    window.location.href = `/api/integrations/${provider}/authorize`;
  };

  const loadPreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/recipes/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id, config }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    setError("");
    try {
      const res = await fetch("/api/automations/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id, config }),
      });
      if (res.ok) {
        setActivated(true);
      } else {
        const data = await res.json();
        setError(data.message || "Activation failed");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setActivating(false);
    }
  };

  const goNext = () => {
    if (step === 3) loadPreview();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/recipes")}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recipes
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge className={ENGINE_LABELS[recipe.engineType]?.color || "bg-neutral-100"}>
            {ENGINE_LABELS[recipe.engineType]?.label || recipe.engineType}
          </Badge>
          <Badge variant="outline">{recipe.category}</Badge>
          {!hasTier && (
            <Badge variant="destructive" className="gap-1">
              <Lock className="w-3 h-3" />
              Requires {recipe.minimumTier}
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-black text-black tracking-tight">{recipe.name}</h1>
        <p className="text-lg text-neutral-500 mt-2 max-w-2xl">{recipe.description}</p>
      </div>

      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <button
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i === step
                    ? "text-primary"
                    : i < step
                    ? "text-green-600 cursor-pointer"
                    : "text-neutral-300"
                }`}
              >
                {i < step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className={`w-5 h-5 ${i === step ? "fill-primary/20" : ""}`} />
                )}
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${i < step ? "bg-green-400" : "bg-neutral-200"}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1" />
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {/* ─── Step 0: Overview ─────────────────────────────── */}
        {step === 0 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">How This Automation Works</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* What it does */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">What It Does</h3>
                <p className="text-neutral-600 leading-relaxed">{recipe.description}</p>

                {config.channels && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-neutral-500 mb-3">Channels Used</h4>
                    <div className="flex gap-2">
                      {(config.channels as string[]).map((ch) => {
                        const Icon = CHANNEL_ICONS[ch] || Zap;
                        return (
                          <div
                            key={ch}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100"
                          >
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium capitalize">{ch}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {config.touchpoints && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-neutral-500 mb-3">Touchpoint Schedule</h4>
                    <div className="flex flex-wrap gap-2">
                      {(config.touchpoints as number[]).map((day) => (
                        <div
                          key={day}
                          className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-bold"
                        >
                          Day {day}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Requirements</h3>
                <div className="space-y-3">
                  {/* Tier */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${hasTier ? "bg-green-50" : "bg-red-50"}`}>
                    {hasTier ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{recipe.minimumTier} Plan Required</p>
                      <p className="text-xs text-neutral-500">
                        You're on {userTier}
                      </p>
                    </div>
                  </div>

                  {/* Integrations */}
                  {recipe.requiredIntegrations.map((int) => {
                    const connected = connectedProviders.includes(int.toLowerCase());
                    return (
                      <div
                        key={int}
                        className={`flex items-center gap-3 p-4 rounded-xl ${
                          connected ? "bg-green-50" : "bg-amber-50"
                        }`}
                      >
                        {connected ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {integrationLabels[int] || int.toUpperCase()}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {connected ? "Connected" : "Not connected yet"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 1: Connect Integrations ────────────────── */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">Connect Your Tools</h2>
            <p className="text-neutral-500 mb-8">
              Connect the required integrations to power this automation.
            </p>

            <div className="space-y-4">
              {recipe.requiredIntegrations.map((provider) => {
                const connected = connectedProviders.includes(provider.toLowerCase());
                return (
                  <div
                    key={provider}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                      connected
                        ? "border-green-200 bg-green-50/50"
                        : "border-neutral-200 bg-white hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          connected ? "bg-green-100" : "bg-neutral-100"
                        }`}
                      >
                        <Link2
                          className={`w-6 h-6 ${connected ? "text-green-600" : "text-neutral-400"}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-black">
                          {integrationLabels[provider] || provider.toUpperCase()}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {connected
                            ? "Connected and ready"
                            : "Click to connect via OAuth"}
                        </p>
                      </div>
                    </div>

                    {connected ? (
                      <Badge className="bg-green-100 text-green-700 border-0 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Button onClick={() => handleConnect(provider)} className="rounded-xl">
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {!canProceedFromIntegrations && (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Connect all required integrations before proceeding.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 2: Customize Templates ─────────────────── */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">Customize Your Automation</h2>
            <p className="text-neutral-500 mb-8">
              Adjust the settings and content templates for your agency.
            </p>

            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="templates">Content Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-6">
                {/* Schedule */}
                {config.schedule && (
                  <div>
                    <Label className="text-sm font-medium">Run Schedule</Label>
                    <select
                      className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
                      value={config.schedule}
                      onChange={(e) =>
                        setConfig({ ...config, schedule: e.target.value })
                      }
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}

                {/* Rate threshold */}
                {config.rateThreshold !== undefined && (
                  <div>
                    <Label className="text-sm font-medium">
                      Rate Increase Alert Threshold
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="number"
                        value={config.rateThreshold}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            rateThreshold: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-24 rounded-xl"
                      />
                      <span className="text-sm text-neutral-500">% increase triggers alert</span>
                    </div>
                  </div>
                )}

                {/* Touchpoints */}
                {config.touchpoints && (
                  <div>
                    <Label className="text-sm font-medium">Outreach Touchpoints (days)</Label>
                    <p className="text-xs text-neutral-500 mt-1 mb-3">
                      Days before expiration (or after event) to send outreach
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(config.touchpoints as number[]).map((day, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={day}
                            onChange={(e) => {
                              const newTouchpoints = [...(config.touchpoints as number[])];
                              newTouchpoints[idx] = parseInt(e.target.value) || 0;
                              setConfig({ ...config, touchpoints: newTouchpoints });
                            }}
                            className="w-20 rounded-xl text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Channels */}
                {config.channels && (
                  <div>
                    <Label className="text-sm font-medium">Active Channels</Label>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {["email", "sms", "call"].map((ch) => {
                        const active = (config.channels as string[]).includes(ch);
                        return (
                          <label
                            key={ch}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <Switch
                              checked={active}
                              onCheckedChange={(checked) => {
                                const channels = checked
                                  ? [...(config.channels as string[]), ch]
                                  : (config.channels as string[]).filter((c) => c !== ch);
                                setConfig({ ...config, channels });
                              }}
                            />
                            <span className="text-sm font-medium capitalize">{ch}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Regions */}
                {config.regions !== undefined && (
                  <div>
                    <Label className="text-sm font-medium">Target Regions</Label>
                    <p className="text-xs text-neutral-500 mt-1 mb-3">
                      Leave empty to monitor all regions where your clients have policies
                    </p>
                    <Input
                      placeholder="e.g. TX, FL, CA (comma separated)"
                      value={(config.regions as string[]).join(", ")}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          regions: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="rounded-xl"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                {/* Email template */}
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Email Template</h3>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                      <Sparkles className="w-3 h-3" />
                      AI Generate
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-neutral-500">Subject Line</Label>
                      <Input
                        placeholder="e.g. Your policy renewal is coming up — let's review your options"
                        defaultValue={config.emailSubject || ""}
                        onChange={(e) =>
                          setConfig({ ...config, emailSubject: e.target.value })
                        }
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-neutral-500">Email Body</Label>
                      <Textarea
                        placeholder="Use {{client_name}}, {{policy_type}}, {{expiration_date}}, {{agent_name}} as merge fields..."
                        rows={6}
                        defaultValue={config.emailBody || ""}
                        onChange={(e) =>
                          setConfig({ ...config, emailBody: e.target.value })
                        }
                        className="rounded-xl mt-1 font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-neutral-400">
                      Available merge fields: {"{{client_name}}"}, {"{{policy_type}}"}, {"{{expiration_date}}"}, {"{{premium_amount}}"}, {"{{agent_name}}"}, {"{{agency_name}}"}
                    </p>
                  </div>
                </div>

                {/* SMS template */}
                {config.channels?.includes("sms") && (
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">SMS Template</h3>
                    </div>
                    <Textarea
                      placeholder="Hi {{client_name}}, your {{policy_type}} policy expires on {{expiration_date}}. Reply YES to schedule a review."
                      rows={3}
                      defaultValue={config.smsBody || ""}
                      onChange={(e) =>
                        setConfig({ ...config, smsBody: e.target.value })
                      }
                      className="rounded-xl font-mono text-sm"
                    />
                    <p className="text-xs text-neutral-400 mt-2">
                      160 character limit per SMS segment
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* ─── Step 3: Preview with Real Data ──────────────── */}
        {step === 3 && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Preview with Real Customer Data</h2>
                <p className="text-neutral-500 mt-1">
                  See how this automation will look using an actual customer from your database.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={loadPreview}
                disabled={previewLoading}
                className="rounded-xl gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${previewLoading ? "animate-spin" : ""}`} />
                Refresh Preview
              </Button>
            </div>

            {previewLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-medium">Pulling a sample customer and generating preview...</p>
              </div>
            ) : previewData ? (
              <div className="space-y-6">
                {/* Customer info */}
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-500 mb-3">Sample Customer</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-400">Name</p>
                      <p className="font-semibold">{previewData.customer?.name || "John Smith"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Policy Type</p>
                      <p className="font-semibold">{previewData.customer?.policyType || "Home"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Expiration</p>
                      <p className="font-semibold">{previewData.customer?.expirationDate || "Apr 15, 2026"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">Premium</p>
                      <p className="font-semibold">{previewData.customer?.premium || "$2,400/yr"}</p>
                    </div>
                  </div>
                </div>

                {/* Email preview */}
                {previewData.emailPreview && (
                  <div className="rounded-2xl border border-neutral-200 overflow-hidden">
                    <div className="bg-neutral-100 px-6 py-3 flex items-center gap-2 border-b border-neutral-200">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-600">Email Preview</span>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-neutral-500 mb-1">Subject:</p>
                      <p className="font-semibold mb-4">{previewData.emailPreview.subject}</p>
                      <Separator className="mb-4" />
                      <div
                        className="prose prose-sm max-w-none text-neutral-700"
                        dangerouslySetInnerHTML={{ __html: previewData.emailPreview.body }}
                      />
                    </div>
                  </div>
                )}

                {/* SMS preview */}
                {previewData.smsPreview && (
                  <div className="rounded-2xl border border-neutral-200 overflow-hidden">
                    <div className="bg-neutral-100 px-6 py-3 flex items-center gap-2 border-b border-neutral-200">
                      <MessageSquare className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-600">SMS Preview</span>
                    </div>
                    <div className="p-6">
                      <div className="max-w-sm mx-auto bg-green-50 rounded-2xl rounded-bl-none p-4">
                        <p className="text-sm">{previewData.smsPreview}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workflow summary */}
                {previewData.workflowSummary && (
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                    <h3 className="font-semibold text-primary mb-2">Automation Flow</h3>
                    <p className="text-sm text-neutral-600">{previewData.workflowSummary}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <Eye className="w-10 h-10 mb-4" />
                <p className="font-medium">Click "Refresh Preview" to see a live preview</p>
                <p className="text-sm mt-1">
                  We'll pull a real customer from your connected AMS and show what the outreach will look like.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 4: Confirm & Activate ──────────────────── */}
        {step === 4 && (
          <div className="p-8">
            {activated ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-black mb-3">Automation Active!</h2>
                <p className="text-lg text-neutral-500 max-w-md mx-auto mb-8">
                  {recipe.name} is now running. You'll see results in your dashboard as the automation executes.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/automations")}
                  className="rounded-xl px-8 py-6 text-lg"
                >
                  View Active Automations
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Review & Activate</h2>

                <div className="space-y-4 mb-8">
                  {/* Summary cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-2xl p-5">
                      <p className="text-sm text-neutral-500 mb-1">Recipe</p>
                      <p className="font-bold text-lg">{recipe.name}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl p-5">
                      <p className="text-sm text-neutral-500 mb-1">Engine</p>
                      <p className="font-bold text-lg">
                        {ENGINE_LABELS[recipe.engineType]?.label}
                      </p>
                    </div>
                    {config.schedule && (
                      <div className="bg-neutral-50 rounded-2xl p-5">
                        <p className="text-sm text-neutral-500 mb-1">Schedule</p>
                        <p className="font-bold text-lg capitalize">{config.schedule}</p>
                      </div>
                    )}
                    {config.channels && (
                      <div className="bg-neutral-50 rounded-2xl p-5">
                        <p className="text-sm text-neutral-500 mb-1">Channels</p>
                        <p className="font-bold text-lg capitalize">
                          {(config.channels as string[]).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Integrations confirmation */}
                  <div className="bg-green-50 rounded-2xl p-5">
                    <p className="text-sm text-green-700 font-medium mb-2">Connected Integrations</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.requiredIntegrations.map((int) => (
                        <Badge key={int} className="bg-green-100 text-green-700 border-0 gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {integrationLabels[int] || int}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleActivate}
                  disabled={activating || !hasTier}
                  className="w-full py-7 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                >
                  {activating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Provisioning Workflow...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Activate {recipe.name}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Navigation footer */}
        {step < 4 || !activated ? (
          <>
            <Separator />
            <div className="flex items-center justify-between p-6">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
                className="rounded-xl gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < 4 && (
                <Button
                  onClick={goNext}
                  disabled={step === 1 && !canProceedFromIntegrations}
                  className="rounded-xl gap-2"
                >
                  {step === 3 ? "Review & Activate" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
