import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_DONATIONS, 
  INITIAL_REQUESTS, 
  INITIAL_INVENTORY, 
  INITIAL_CONTACT_HISTORY, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USERS 
} from './src/data/shegaonData.js';
import { 
  FoodBusiness, 
  FoodDonation, 
  DonationRequest, 
  HouseholdInventoryItem, 
  ContactHistory, 
  NotificationItem, 
  ParticipationStatus 
} from './src/types.js';
import { evaluateFoodFreshness, generateZeroWasteRecipe } from './src/server/geminiService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory data store for Shegaon platform
  let businesses: FoodBusiness[] = [...INITIAL_BUSINESSES];
  let donations: FoodDonation[] = [...INITIAL_DONATIONS];
  let requests: DonationRequest[] = [...INITIAL_REQUESTS];
  let inventory: HouseholdInventoryItem[] = [...INITIAL_INVENTORY];
  let contactHistory: ContactHistory[] = [...INITIAL_CONTACT_HISTORY];
  let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  let users = [...INITIAL_USERS];

  // Helper for computing impact stats
  function calculateImpact() {
    const statusBreakdown: Record<ParticipationStatus, number> = {
      IDENTIFIED: 0,
      CONTACTED: 0,
      INTERESTED: 0,
      REGISTERED: 0,
      VERIFIED: 0,
      ACTIVE_DONOR: 0,
      NOT_INTERESTED: 0
    };

    businesses.forEach(b => {
      if (statusBreakdown[b.participationStatus] !== undefined) {
        statusBreakdown[b.participationStatus]++;
      }
    });

    const activeDonors = statusBreakdown.ACTIVE_DONOR;
    const verifiedPartners = statusBreakdown.VERIFIED + activeDonors;
    const registeredBusinesses = businesses.length;
    const contactedBusinesses = businesses.filter(b => b.participationStatus !== 'IDENTIFIED').length;

    const completedDonations = donations.filter(d => d.status === 'Completed').length;
    const foodSavedKg = completedDonations * 25 + 150; // estimated food rescued
    const co2SavedKg = Math.round(foodSavedKg * 2.5);
    const mealsProvided = Math.round(foodSavedKg * 3.2);

    return {
      registeredBusinesses,
      contactedBusinesses,
      verifiedPartners,
      activeDonors,
      verifiedNgos: users.filter(u => u.role === 'NGO' && u.isVerified).length,
      foodSavedKg,
      successfulDonations: completedDonations + 18,
      co2SavedKg,
      mealsProvided,
      statusBreakdown
    };
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'FoodSaver Shegaon' });
  });

  // Food Businesses Directory API
  app.get('/api/businesses', (req, res) => {
    res.json(businesses);
  });

  app.post('/api/businesses', (req, res) => {
    const newBiz: FoodBusiness = {
      id: `biz-${Date.now()}`,
      city: 'Shegaon',
      latitude: req.body.latitude || 20.7850,
      longitude: req.body.longitude || 76.6880,
      participationStatus: req.body.participationStatus || 'REGISTERED',
      isVerified: req.body.isVerified || false,
      dataSource: req.body.dataSource || 'VOLUNTARY_REGISTRATION',
      foodCategories: req.body.foodCategories || ['Cooked Food'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };

    businesses.unshift(newBiz);

    // Notify admin
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'usr-admin',
      title: 'New Food Partner Application',
      message: `${newBiz.name} registered from ${newBiz.area}. Pending verification.`,
      type: 'BUSINESS',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newBiz);
  });

  app.put('/api/businesses/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, isVerified, notes, agentName } = req.body;

    const bizIndex = businesses.findIndex(b => b.id === id);
    if (bizIndex === -1) {
      return res.status(404).json({ error: 'Business not found' });
    }

    businesses[bizIndex].participationStatus = status;
    if (typeof isVerified === 'boolean') {
      businesses[bizIndex].isVerified = isVerified;
    }
    businesses[bizIndex].updatedAt = new Date().toISOString();

    // Record contact history entry
    const historyEntry: ContactHistory = {
      id: `ch-${Date.now()}`,
      foodBusinessId: id,
      contactDate: new Date().toISOString(),
      method: 'In-Person Visit',
      status,
      notes: notes || `Status updated to ${status}`,
      agentName: agentName || 'Admin'
    };
    contactHistory.unshift(historyEntry);

    res.json({ business: businesses[bizIndex], history: historyEntry });
  });

  app.get('/api/businesses/:id/history', (req, res) => {
    const { id } = req.params;
    const history = contactHistory.filter(ch => ch.foodBusinessId === id);
    res.json(history);
  });

  // Food Donations API
  app.get('/api/donations', (req, res) => {
    res.json(donations);
  });

  app.post('/api/donations', async (req, res) => {
    try {
      const { foodName, description, imageUrl } = req.body;

      let freshnessData: any = { freshnessScore: 92, freshnessNotes: 'Freshly posted.' };
      if (foodName) {
        freshnessData = await evaluateFoodFreshness(description || foodName, imageUrl);
      }

      const newDonation: FoodDonation = {
        id: `don-${Date.now()}`,
        status: 'Available',
        freshnessScore: freshnessData.freshnessScore,
        freshnessNotes: freshnessData.aiSummary || freshnessData.storageAdvice || freshnessData.freshnessNotes || 'Inspected by AI',
        createdAt: new Date().toISOString(),
        ...req.body
      };

      donations.unshift(newDonation);

      // Notify NGOs in Shegaon
      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: 'usr-ngo1',
        title: 'New Surplus Food Available!',
        message: `${newDonation.donorName} (${newDonation.donorArea}) listed ${newDonation.quantity} ${newDonation.unit} of ${newDonation.foodName}.`,
        type: 'DONATION',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      res.status(201).json(newDonation);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/donations/:id/request', (req, res) => {
    const { id } = req.params;
    const { ngoId, ngoName, ngoContact, recipientNotes, requestedQuantity } = req.body;

    const donIndex = donations.findIndex(d => d.id === id);
    if (donIndex === -1) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    donations[donIndex].status = 'Requested';

    const newRequest: DonationRequest = {
      id: `req-${Date.now()}`,
      donationId: id,
      foodName: donations[donIndex].foodName,
      donorName: donations[donIndex].donorName,
      donorArea: donations[donIndex].donorArea,
      ngoId,
      ngoName,
      ngoContact,
      recipientNotes,
      requestedQuantity: requestedQuantity || donations[donIndex].quantity,
      unit: donations[donIndex].unit,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    requests.unshift(newRequest);

    // Notify Donor
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: donations[donIndex].donorId,
      title: 'Donation Request Received',
      message: `${ngoName} submitted a request for "${donations[donIndex].foodName}".`,
      type: 'DONATION',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newRequest);
  });

  app.get('/api/requests', (req, res) => {
    res.json(requests);
  });

  app.put('/api/requests/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted' | 'Rejected' | 'Completed'

    const reqIndex = requests.findIndex(r => r.id === id);
    if (reqIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    requests[reqIndex].status = status;
    if (status === 'Completed') {
      requests[reqIndex].completedAt = new Date().toISOString();
    }

    // Also sync parent donation status
    const donIndex = donations.findIndex(d => d.id === requests[reqIndex].donationId);
    if (donIndex !== -1) {
      if (status === 'Accepted') donations[donIndex].status = 'Accepted';
      if (status === 'Completed') donations[donIndex].status = 'Completed';
      if (status === 'Rejected') donations[donIndex].status = 'Available';
    }

    res.json(requests[reqIndex]);
  });

  // Household Inventory API
  app.get('/api/inventory', (req, res) => {
    res.json(inventory);
  });

  app.post('/api/inventory', (req, res) => {
    const newItem: HouseholdInventoryItem = {
      id: `inv-${Date.now()}`,
      status: 'FRESH',
      ...req.body
    };
    inventory.unshift(newItem);
    res.status(201).json(newItem);
  });

  app.put('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    inventory[index] = { ...inventory[index], ...req.body };
    res.json(inventory[index]);
  });

  app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(i => i.id !== id);
    res.json({ success: true });
  });

  // AI Routes
  app.post('/api/ai/freshness', async (req, res) => {
    const { description, imageBase64 } = req.body;
    const result = await evaluateFoodFreshness(description || 'Surplus meal', imageBase64);
    res.json(result);
  });

  app.post('/api/ai/recipe', async (req, res) => {
    const { ingredients } = req.body;
    const recipes = await generateZeroWasteRecipe(ingredients || ['Milk', 'Bread']);
    res.json(recipes);
  });

  // Analytics API
  app.get('/api/analytics', (req, res) => {
    res.json(calculateImpact());
  });

  // Notifications API
  app.get('/api/notifications', (req, res) => {
    res.json(notifications);
  });

  // Reset / Re-seed Data Endpoint
  app.post('/api/admin/reset-demo', (req, res) => {
    businesses = [...INITIAL_BUSINESSES];
    donations = [...INITIAL_DONATIONS];
    requests = [...INITIAL_REQUESTS];
    inventory = [...INITIAL_INVENTORY];
    contactHistory = [...INITIAL_CONTACT_HISTORY];
    notifications = [...INITIAL_NOTIFICATIONS];
    users = [...INITIAL_USERS];
    res.json({ message: 'Demo data re-seeded successfully' });
  });

  // Vite development middleware vs production static server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FoodSaver Shegaon server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
