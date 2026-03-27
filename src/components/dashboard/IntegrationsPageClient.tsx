"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Link2,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Database,
  Users,
  MessageSquare,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Integration {
  provider: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  tags: string[];
}

const INTEGRATIONS: Integration[] = [
  // Email
  {
    provider: "GMAIL",
    name: "Gmail",
    description: "Send email campaigns and automated follow-ups via Gmail. Supports personalized templates with merge fields.",
    category: "Email",
    icon: Mail,
    tags: ["google", "email", "campaigns", "outreach"],
  },
  {
    provider: "OUTLOOK",
    name: "Microsoft Outlook",
    description: "Send email campaigns and follow-ups via Outlook / Microsoft 365. Full OAuth integration.",
    category: "Email",
    icon: Mail,
    tags: ["microsoft", "office", "email", "campaigns", "o365"],
  },
  // CRM
  {
    provider: "HUBSPOT",
    name: "HubSpot",
    description: "Sync contacts, deals, and pipeline data. Trigger automations on deal stage changes and new leads.",
    category: "CRM",
    icon: Users,
    tags: ["crm", "contacts", "deals", "pipeline", "leads", "marketing"],
  },
  {
    provider: "SALESFORCE",
    name: "Salesforce",
    description: "Sync contacts, opportunities, and pipeline data. Two-way sync with Salesforce objects.",
    category: "CRM",
    icon: Users,
    tags: ["crm", "contacts", "opportunities", "enterprise", "leads"],
  },
  // Phone & SMS
  {
    provider: "TWILIO",
    name: "Twilio",
    description: "Send SMS messages, make voice calls, and handle inbound communications. Supports automated phone outreach.",
    category: "Phone & SMS",
    icon: Phone,
    tags: ["sms", "voice", "calls", "text", "messaging", "phone"],
  },
  // AMS
  {
    provider: "APPLIED_EPIC",
    name: "Applied Epic",
    description: "Connect to Applied Epic AMS for policy data, renewal dates, client information, and claims history.",
    category: "Agency Management System",
    icon: Database,
    tags: ["ams", "insurance", "policies", "renewals", "applied", "epic", "agency"],
  },
  {
    provider: "HAWKSOFT",
    name: "HawkSoft",
    description: "Connect to HawkSoft AMS for policy management, client data, and renewal tracking.",
    category: "Agency Management System",
    icon: Database,
    tags: ["ams", "insurance", "policies", "renewals", "hawksoft", "agency"],
  },
  {
    provider: "EZLYNX",
    name: "EZLynx",
    description: "Connect to EZLynx for comparative rating, policy management, and client data.",
    category: "Agency Management System",
    icon: Database,
    tags: ["ams", "insurance", "rating", "policies", "ezlynx", "agency", "quoting"],
  },
];

const CATEGORIES = ["All", ...new Set(INTEGRATIONS.map((i) => i.category))];

interface IntegrationsPageClientProps {
  connectionMap: Record<string, { id: string; status: string; provider: string }>;
}

export function IntegrationsPageClient({ connectionMap }: IntegrationsPageClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const connectedCount = Object.values(connectionMap).filter(
    (c) => c.status === "CONNECTED"
  ).length;

  const filtered = useMemo(() => {
    let result = INTEGRATIONS;

    if (activeCategory !== "All") {
      result = result.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q))
      );
    }

    return result;
  }, [search, activeCategory]);

  const handleConnect = (provider: string) => {
    setLoadingProvider(provider);
    window.location.href = `/api/integrations/${provider.toLowerCase()}/authorize`;
  };

  const handleDisconnect = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await fetch(`/api/integrations/${provider.toLowerCase()}/disconnect`, {
        method: "POST",
      });
      window.location.reload();
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back to settings */}
      <Link
        href="/dashboard/settings"
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Integrations
          </h1>
          <p className="text-neutral-500 mt-1">
            Connect your tools to power your automation recipes
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-bold text-green-700">
            {connectedCount} connected
          </span>
        </div>
      </div>

      {/* Search & category filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search integrations by name, category, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 rounded-xl h-12 border-neutral-200 bg-white"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count =
            cat === "All"
              ? INTEGRATIONS.length
              : INTEGRATIONS.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? "text-white/70" : "text-neutral-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Integration grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <Search className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="font-medium text-neutral-600">No integrations found</p>
          <p className="text-sm text-neutral-400 mt-1">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((integration) => {
            const connection = connectionMap[integration.provider];
            const isConnected = connection?.status === "CONNECTED";
            const isExpired = connection?.status === "EXPIRED";
            const isLoading = loadingProvider === integration.provider;
            const Icon = integration.icon;

            return (
              <div
                key={integration.provider}
                className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                  isConnected
                    ? "border-green-200 bg-green-50/30"
                    : isExpired
                    ? "border-amber-200"
                    : "border-neutral-200 hover:border-primary/20 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isConnected
                        ? "bg-green-100"
                        : isExpired
                        ? "bg-amber-100"
                        : "bg-neutral-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isConnected
                          ? "text-green-600"
                          : isExpired
                          ? "text-amber-600"
                          : "text-neutral-500"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-black">{integration.name}</h3>
                      {isConnected && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-xs gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                      {integration.description}
                    </p>

                    {/* Category tag */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {integration.category}
                      </Badge>

                      {/* Actions */}
                      {isConnected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.provider)}
                          disabled={isLoading}
                          className="rounded-xl text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(integration.provider)}
                          disabled={isLoading}
                          className="rounded-xl gap-1.5"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          {isLoading
                            ? "Connecting..."
                            : isExpired
                            ? "Reconnect"
                            : "Connect"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
