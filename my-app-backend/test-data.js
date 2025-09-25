const mongoose = require('mongoose');
const UserOnboarding = require('./models/UserOnboarding');
require('dotenv').config();

async function checkAndCreateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geopolitical-intelligence');
    console.log('Connected to database');
    
    let onboarding = await UserOnboarding.findOne({ userId: 'demo-user' });
    
    if (!onboarding) {
      console.log('No onboarding data found for demo-user, creating sample data...');
      
      // Create sample supply chain onboarding data
      const sampleData = {
        userId: 'demo-user',
        onboardingStatus: 'completed',
        onboardingType: 'supply_chain',
        onboardingData: {
          userInfo: {
            name: 'Demo User',
            company: 'Acme Manufacturing',
            email: 'demo@acme.com',
            role: 'Supply Chain Manager'
          },
          suppliers: [
            {
              name: 'Shanghai Metal Works',
              internalName: 'Primary Steel Supplier',
              tier: 'Tier 1',
              products: ['Steel Components', 'Raw Materials'],
              locations: [
                {
                  name: 'Shanghai Facility',
                  address: '123 Industrial Ave, Shanghai, China',
                  country: 'China',
                  coordinates: [31.2304, 121.4737]
                }
              ],
              riskLevel: 'medium'
            },
            {
              name: 'German Electronics Ltd',
              internalName: 'EU Electronics Supplier',
              tier: 'Tier 1', 
              products: ['Electronic Components', 'Circuit Boards'],
              locations: [
                {
                  name: 'Berlin Plant',
                  address: '456 Tech Street, Berlin, Germany',
                  country: 'Germany',
                  coordinates: [52.5200, 13.4050]
                }
              ],
              riskLevel: 'low'
            },
            {
              name: 'Thai Components Inc',
              internalName: 'Asian Components',
              tier: 'Tier 2',
              products: ['Plastic Components', 'Assembly Parts'],
              locations: [
                {
                  name: 'Bangkok Factory',
                  address: '789 Manufacturing Blvd, Bangkok, Thailand',
                  country: 'Thailand',
                  coordinates: [13.7563, 100.5018]
                }
              ],
              riskLevel: 'medium'
            }
          ],
          portsAndRoutes: {
            ports: [
              {
                name: 'Port of Shanghai',
                country: 'China',
                type: 'container',
                capacity: 'large',
                status: 'active',
                coordinates: [31.2397, 121.4994]
              },
              {
                name: 'Port of Hamburg',
                country: 'Germany',
                type: 'container',
                capacity: 'large',
                status: 'active',
                coordinates: [53.5511, 9.9937]
              },
              {
                name: 'Port of Los Angeles',
                country: 'United States',
                type: 'container',
                capacity: 'large',
                status: 'active',
                coordinates: [33.7175, -118.2708]
              }
            ],
            warehouses: [],
            shippingRoutes: [
              {
                name: 'Shanghai to Los Angeles',
                from: 'China',
                to: 'United States',
                type: 'shipping',
                frequency: 'weekly',
                status: 'active'
              },
              {
                name: 'Hamburg to New York',
                from: 'Germany',
                to: 'United States',
                type: 'shipping',
                frequency: 'bi-weekly',
                status: 'active'
              },
              {
                name: 'Shanghai to Hamburg',
                from: 'China',
                to: 'Germany',
                type: 'shipping',
                frequency: 'weekly',
                status: 'active'
              }
            ]
          },
          backupSuppliers: [
            {
              name: 'Vietnam Steel Co',
              linkedSupplier: 'Shanghai Metal Works',
              tier: 'Tier 2',
              products: ['Steel Components'],
              country: 'Vietnam',
              riskLevel: 'medium'
            }
          ],
          timelines: {
            supplierSwitchTime: '2-4 weeks',
            shipmentFrequency: 'weekly',
            leadTimes: {
              'Shanghai Metal Works': '4-6 weeks',
              'German Electronics Ltd': '2-3 weeks',
              'Thai Components Inc': '3-4 weeks'
            }
          },
          riskThresholds: {
            critical: 8,
            high: 6,
            medium: 4,
            low: 2
          }
        },
        completionPercentage: 100,
        lastUpdated: new Date(),
        createdAt: new Date()
      };
      
      onboarding = new UserOnboarding(sampleData);
      await onboarding.save();
      console.log('Created sample onboarding data for demo-user');
    } else {
      console.log('Found existing onboarding data for demo-user:');
      console.log('Status:', onboarding.onboardingStatus);
      console.log('Type:', onboarding.onboardingType);
      if (onboarding.onboardingData) {
        console.log('Has onboarding data:', Object.keys(onboarding.onboardingData));
        if (onboarding.onboardingData.suppliers) {
          console.log('Suppliers count:', onboarding.onboardingData.suppliers.length);
        }
        if (onboarding.onboardingData.portsAndRoutes?.ports) {
          console.log('Ports count:', onboarding.onboardingData.portsAndRoutes.ports.length);
        }
        if (onboarding.onboardingData.portsAndRoutes?.shippingRoutes) {
          console.log('Routes count:', onboarding.onboardingData.portsAndRoutes.shippingRoutes.length);
        }
      }
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateData();
