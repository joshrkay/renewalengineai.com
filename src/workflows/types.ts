export interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, { id: string; name: string }>;
  typeVersion?: number;
}

export interface N8nConnection {
  main: Array<Array<{ node: string; type: string; index: number }>>;
}

export interface N8nWorkflowTemplate {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, N8nConnection>;
  settings: {
    executionOrder: string;
    saveManualExecutions: boolean;
    callerPolicy: string;
  };
  meta?: { templateId?: string };
}
