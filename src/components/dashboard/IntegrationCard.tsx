"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface IntegrationCardProps {
  integration: {
    provider: string;
    name: string;
    description: string;
    category: string;
  };
  connection?: {
    id: string;
    status: string;
    provider: string;
  } | null;
}

export function IntegrationCard({
  integration,
  connection,
}: IntegrationCardProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    window.location.href = `/api/integrations/${integration.provider.toLowerCase()}/authorize`;
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch(
        `/api/integrations/${integration.provider.toLowerCase()}/disconnect`,
        { method: "POST" }
      );
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const isConnected = connection?.status === "CONNECTED";
  const isExpired = connection?.status === "EXPIRED";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-black">{integration.name}</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {integration.description}
          </p>
        </div>
        {isConnected && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
        {isExpired && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
      </div>

      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-600 font-medium flex-1">
            Connected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={loading}
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>
      ) : isExpired ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-amber-500 text-white text-sm"
        >
          Reconnect
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={loading}
          variant="outline"
          className="w-full text-sm"
        >
          <Link2 className="w-4 h-4 mr-2" />
          {loading ? "Connecting..." : "Connect"}
        </Button>
      )}
    </div>
  );
}
