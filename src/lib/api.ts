import { Feature, Repo, Build, BuildEvent, CreateFeatureRequest } from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(
      error.error || error.message || 'Request failed',
      response.status,
      error.code
    );
  }
  return response.json();
}

// Features API
export async function fetchFeatures(): Promise<Feature[]> {
  const response = await fetch('/api/features');
  const data = await handleResponse<{ features: Feature[] }>(response);
  return data.features;
}

export async function fetchFeature(id: string): Promise<Feature | null> {
  const response = await fetch(`/api/features?id=${encodeURIComponent(id)}`);
  const data = await handleResponse<{ features: Feature[] }>(response);
  return data.features?.[0] || null;
}

export async function createFeature(data: CreateFeatureRequest): Promise<Feature> {
  const response = await fetch('/api/features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await handleResponse<{ feature: Feature }>(response);
  return result.feature;
}

// Repos API
export async function fetchRepos(): Promise<Repo[]> {
  const response = await fetch('/api/repos');
  const data = await handleResponse<{ repos: Repo[] }>(response);
  return data.repos;
}

// Builds API
export async function fetchBuilds(featureId?: string): Promise<Build[]> {
  const url = featureId 
    ? `/api/builds?feature_id=${encodeURIComponent(featureId)}`
    : '/api/builds';
  const response = await fetch(url);
  const data = await handleResponse<{ builds: Build[] }>(response);
  return data.builds;
}

export async function fetchBuildEvents(buildId: string): Promise<BuildEvent[]> {
  const response = await fetch(`/api/builds/events?build_id=${encodeURIComponent(buildId)}`);
  const data = await handleResponse<{ events: BuildEvent[] }>(response);
  return data.events;
}

export function createBuildLogsEventSource(buildId: string): EventSource {
  return new EventSource(`/api/builds/logs?build_id=${encodeURIComponent(buildId)}`);
}
