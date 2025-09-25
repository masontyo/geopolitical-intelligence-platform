const express = require('express');
const router = express.Router();
const UserOnboarding = require('../models/UserOnboarding');

// GET /api/supply-chain/data/:userId - Get user's supply chain data
router.get('/data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user onboarding data
    const onboarding = await UserOnboarding.findOne({ userId });

    if (!onboarding || !onboarding.onboardingData) {
      return res.status(404).json({ error: 'Supply chain data not found' });
    }

    const supplyChainData = onboarding.onboardingData;

    // Transform the data for map display
    const transformedData = {
      userInfo: supplyChainData.userInfo || {},
      suppliers: supplyChainData.suppliers || [],
      ports: supplyChainData.portsAndRoutes?.ports || [],
      warehouses: supplyChainData.portsAndRoutes?.warehouses || [],
      shippingRoutes: supplyChainData.portsAndRoutes?.shippingRoutes || [],
      backupSuppliers: supplyChainData.backupSuppliers || [],
      timelines: supplyChainData.timelines || {},
      riskThresholds: supplyChainData.riskThresholds || {}
    };

    res.json({
      success: true,
      data: transformedData,
      lastUpdated: onboarding.lastUpdated
    });

  } catch (error) {
    console.error('Error fetching supply chain data:', error);
    res.status(500).json({ error: 'Failed to fetch supply chain data' });
  }
});

// GET /api/supply-chain/suppliers/:userId - Get user's suppliers for map display
router.get('/suppliers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const onboarding = await UserOnboarding.findOne({ userId });

    if (!onboarding || !onboarding.onboardingData?.suppliers) {
      return res.json({
        success: true,
        suppliers: []
      });
    }

    const suppliers = onboarding.onboardingData.suppliers.map((supplier, index) => ({
      id: `supplier_${userId}_${index}`,
      name: supplier.name || supplier.supplierName || `Supplier ${index + 1}`,
      internalName: supplier.internalName || supplier.name,
      country: supplier.locations?.[0]?.country || 'Unknown',
      tier: supplier.tier || 'Tier 1',
      products: supplier.products || [],
      locations: supplier.locations || [],
      riskLevel: supplier.riskLevel || 'medium',
      alertCount: Math.floor(Math.random() * 5) + 1, // Mock alert count
      coords: getCoordinatesFromLocation(supplier.locations?.[0]?.country || 'Unknown'),
      status: 'active',
      lastUpdated: new Date().toISOString()
    }));

    res.json({
      success: true,
      suppliers
    });

  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// GET /api/supply-chain/ports/:userId - Get user's ports for map display
router.get('/ports/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const onboarding = await UserOnboarding.findOne({ userId });

    if (!onboarding || !onboarding.onboardingData?.portsAndRoutes?.ports) {
      return res.json({
        success: true,
        ports: []
      });
    }

    const ports = onboarding.onboardingData.portsAndRoutes.ports.map((port, index) => ({
      id: `port_${userId}_${index}`,
      name: port.name || `Port ${index + 1}`,
      country: port.country || 'Unknown',
      type: port.type || 'container',
      capacity: port.capacity || 'large',
      status: port.status || 'operational',
      alertCount: Math.floor(Math.random() * 3) + 1, // Mock alert count
      coords: getCoordinatesFromLocation(port.country || 'Unknown'),
      lastUpdated: new Date().toISOString()
    }));

    res.json({
      success: true,
      ports
    });

  } catch (error) {
    console.error('Error fetching ports:', error);
    res.status(500).json({ error: 'Failed to fetch ports' });
  }
});

// GET /api/supply-chain/routes/:userId - Get user's shipping routes
router.get('/routes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const onboarding = await UserOnboarding.findOne({ userId });

    if (!onboarding || !onboarding.onboardingData?.portsAndRoutes?.shippingRoutes) {
      return res.json({
        success: true,
        routes: []
      });
    }

    const routes = onboarding.onboardingData.portsAndRoutes.shippingRoutes.map((route, index) => ({
      id: `route_${userId}_${index}`,
      name: route.name || `Route ${index + 1}`,
      from: route.from || 'Unknown',
      to: route.to || 'Unknown',
      type: route.type || 'shipping',
      frequency: route.frequency || 'weekly',
      status: route.status || 'active',
      coords: [
        getCoordinatesFromLocation(route.from || 'Unknown'),
        getCoordinatesFromLocation(route.to || 'Unknown')
      ],
      lastUpdated: new Date().toISOString()
    }));

    res.json({
      success: true,
      routes
    });

  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Helper function to get coordinates from country/location name
function getCoordinatesFromLocation(location) {
  // Simple country to coordinates mapping
  const countryCoords = {
    'United States': [39.8283, -98.5795],
    'China': [35.8617, 104.1954],
    'Germany': [51.1657, 10.4515],
    'Japan': [36.2048, 138.2529],
    'United Kingdom': [55.3781, -3.4360],
    'France': [46.6034, 1.8883],
    'India': [20.5937, 78.9629],
    'Brazil': [-14.2350, -51.9253],
    'Canada': [56.1304, -106.3468],
    'Australia': [-25.2744, 133.7751],
    'Russia': [61.5240, 105.3188],
    'South Korea': [35.9078, 127.7669],
    'Mexico': [23.6345, -102.5528],
    'Italy': [41.8719, 12.5674],
    'Spain': [40.4637, -3.7492],
    'Netherlands': [52.1326, 5.2913],
    'Singapore': [1.3521, 103.8198],
    'Taiwan': [23.6978, 120.9605],
    'Thailand': [15.8700, 100.9925],
    'Vietnam': [14.0583, 108.2772],
    'Unknown': [0, 0]
  };

  return countryCoords[location] || countryCoords['Unknown'];
}

module.exports = router;
