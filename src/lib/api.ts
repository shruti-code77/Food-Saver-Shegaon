import { 
  FoodBusiness, 
  FoodDonation, 
  DonationRequest, 
  HouseholdInventoryItem, 
  NotificationItem, 
  ImpactAnalytics, 
  ContactHistory,
  ParticipationStatus
} from '../types';

const API_BASE = '/api';

export async function fetchBusinesses(): Promise<FoodBusiness[]> {
  const res = await fetch(`${API_BASE}/businesses`);
  if (!res.ok) throw new Error('Failed to fetch businesses');
  return res.json();
}

export async function createBusiness(data: Partial<FoodBusiness>): Promise<FoodBusiness> {
  const res = await fetch(`${API_BASE}/businesses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create business');
  return res.json();
}

export async function updateBusinessStatus(
  id: string, 
  status: ParticipationStatus, 
  isVerified?: boolean, 
  notes?: string,
  agentName?: string
) {
  const res = await fetch(`${API_BASE}/businesses/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, isVerified, notes, agentName })
  });
  if (!res.ok) throw new Error('Failed to update business status');
  return res.json();
}

export async function fetchBusinessHistory(id: string): Promise<ContactHistory[]> {
  const res = await fetch(`${API_BASE}/businesses/${id}/history`);
  if (!res.ok) throw new Error('Failed to fetch business history');
  return res.json();
}

export async function fetchDonations(): Promise<FoodDonation[]> {
  const res = await fetch(`${API_BASE}/donations`);
  if (!res.ok) throw new Error('Failed to fetch donations');
  return res.json();
}

export async function createDonation(data: Partial<FoodDonation>): Promise<FoodDonation> {
  const res = await fetch(`${API_BASE}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to post donation');
  return res.json();
}

export async function requestDonation(
  donationId: string, 
  reqData: { ngoId: string; ngoName: string; ngoContact: string; recipientNotes: string; requestedQuantity?: number }
): Promise<DonationRequest> {
  const res = await fetch(`${API_BASE}/donations/${donationId}/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqData)
  });
  if (!res.ok) throw new Error('Failed to request donation');
  return res.json();
}

export async function fetchRequests(): Promise<DonationRequest[]> {
  const res = await fetch(`${API_BASE}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function updateRequestStatus(requestId: string, status: 'Accepted' | 'Rejected' | 'Completed') {
  const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update request status');
  return res.json();
}

export async function fetchInventory(): Promise<HouseholdInventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
}

export async function addInventoryItem(data: Partial<HouseholdInventoryItem>): Promise<HouseholdInventoryItem> {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add inventory item');
  return res.json();
}

export async function updateInventoryItem(id: string, data: Partial<HouseholdInventoryItem>): Promise<HouseholdInventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update inventory item');
  return res.json();
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete inventory item');
}

export async function fetchAnalytics(): Promise<ImpactAnalytics> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function inspectFreshnessWithAI(description: string, imageBase64?: string) {
  const res = await fetch(`${API_BASE}/ai/freshness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, imageBase64 })
  });
  if (!res.ok) throw new Error('AI freshness evaluation failed');
  return res.json();
}

export async function generateRecipesWithAI(ingredients: string[]) {
  const res = await fetch(`${API_BASE}/ai/recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients })
  });
  if (!res.ok) throw new Error('AI recipe generation failed');
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch(`${API_BASE}/admin/reset-demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}
