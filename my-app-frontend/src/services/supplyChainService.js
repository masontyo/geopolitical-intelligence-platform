import { api } from './api';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://geop-backend.onrender.com');

export const supplyChainAPI = {
  // Get complete supply chain data for a user
  getSupplyChainData: async (userId = 'demo-user') => {
    try {
      const response = await api.get(`/api/supply-chain/data/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supply chain data:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Get suppliers for map display
  getSuppliers: async (userId = 'demo-user') => {
    try {
      const response = await api.get(`/api/supply-chain/suppliers/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return { success: false, suppliers: [], error: error.message };
    }
  },

  // Get ports for map display
  getPorts: async (userId = 'demo-user') => {
    try {
      const response = await api.get(`/api/supply-chain/ports/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ports:', error);
      return { success: false, ports: [], error: error.message };
    }
  },

  // Get shipping routes for map display
  getRoutes: async (userId = 'demo-user') => {
    try {
      const response = await api.get(`/api/supply-chain/routes/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return { success: false, routes: [], error: error.message };
    }
  },

  // Get all supply chain entities for map display
  getAllSupplyChainEntities: async (userId = 'demo-user') => {
    try {
      const [suppliersResponse, portsResponse, routesResponse] = await Promise.all([
        supplyChainAPI.getSuppliers(userId),
        supplyChainAPI.getPorts(userId),
        supplyChainAPI.getRoutes(userId)
      ]);

      return {
        success: true,
        suppliers: suppliersResponse.suppliers || [],
        ports: portsResponse.ports || [],
        routes: routesResponse.routes || []
      };
    } catch (error) {
      console.error('Error fetching all supply chain entities:', error);
      return {
        success: false,
        suppliers: [],
        ports: [],
        routes: [],
        error: error.message
      };
    }
  }
};
