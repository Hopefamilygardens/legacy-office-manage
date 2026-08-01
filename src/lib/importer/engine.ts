import type { ImportConnector } from './connector';
import type { SourceType, ConnectorInput, ImportJob } from './types';
import { ConnectorRegistry } from './connectors/registry';
import * as api from './api';

// ImportEngine is the single entry point for all import operations.
// It coordinates between the connector registry (browser-side) and the
// n8n pipeline (backend intelligence).
//
// Usage:
//   const engine = new ImportEngine(connectorRegistry);
//   const job = await engine.submitImport('pdf', { file });
//   await engine.approveUpdate(job.id, updateId);
//   await engine.commitApproved(job.id);
export class ImportEngine {
  constructor(private readonly registry: ConnectorRegistry) {}

  // Returns all registered connectors.
  getConnectors(): ImportConnector[] {
    return this.registry.getAll();
  }

  // Returns available (non-future) connectors.
  getAvailableConnectors(): ImportConnector[] {
    return this.registry.getAvailable();
  }

  // Returns the connector for a given source type, or undefined.
  getConnector(sourceType: SourceType): ImportConnector | undefined {
    return this.registry.get(sourceType);
  }

  // Prepare the input using the appropriate connector, then submit to n8n.
  // Returns the created ImportJob with its assigned ID and initial stage.
  async submitImport(sourceType: SourceType, input: ConnectorInput): Promise<ImportJob> {
    const connector = this.registry.get(sourceType);
    if (!connector) throw new Error('No connector registered for source type: ' + sourceType);
    if (!connector.is_available) {
      throw new Error(connector.unavailable_reason ?? 'Connector not available: ' + sourceType);
    }

    const prepared = await connector.prepare(input);
    const response = await api.submitImport(prepared);
    if (!response.ok) throw new Error(response.error ?? 'Import submission failed.');
    return response.job;
  }

  // Poll the current pipeline state of a job.
  async getJobStatus(jobId: string): Promise<ImportJob> {
    const response = await api.getJobStatus(jobId);
    if (!response.ok) throw new Error(response.error ?? 'Failed to retrieve job status.');
    return response.job;
  }

  // Approve a single proposed Brain update.
  async approveUpdate(jobId: string, updateId: string, notes?: string): Promise<ImportJob> {
    const response = await api.decideUpdate(jobId, 'approved', updateId, notes);
    if (!response.ok) throw new Error(response.error ?? 'Failed to approve update.');
    return response.job!;
  }

  // Reject a single proposed Brain update.
  async rejectUpdate(jobId: string, updateId: string, notes?: string): Promise<ImportJob> {
    const response = await api.decideUpdate(jobId, 'rejected', updateId, notes);
    if (!response.ok) throw new Error(response.error ?? 'Failed to reject update.');
    return response.job!;
  }

  // Approve all pending proposed updates in a job at once.
  async approveAllPending(jobId: string): Promise<ImportJob> {
    const response = await api.decideUpdate(jobId, 'approved');
    if (!response.ok) throw new Error(response.error ?? 'Failed to approve all updates.');
    return response.job!;
  }

  // Commit all approved updates to the Brain.
  // This is the final irreversible step. Only approved updates are written.
  async commitApproved(jobId: string): Promise<ImportJob> {
    const response = await api.commitApproved(jobId);
    if (!response.ok) throw new Error(response.error ?? 'Failed to commit updates to Brain.');
    return response.job!;
  }
}
