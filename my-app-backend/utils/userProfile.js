/**
 * User Profile Utility Functions
 * Handles validation and relevance scoring for user profiles
 */

/**
 * Validates a user profile object
 * @param {Object} profile - The user profile to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
const validateUserProfile = (profile) => {
  const errors = [];
  
  // Required fields
  const requiredFields = ['name', 'title', 'company', 'industry', 'businessUnits', 'areasOfConcern'];
  
  requiredFields.forEach(field => {
    if (!profile[field]) {
      errors.push(`${field} is required`);
    }
  });
  
  // Validate arrays are not empty
  if (profile.businessUnits && profile.businessUnits.length === 0) {
    errors.push('businessUnits cannot be empty');
  }
  
  if (profile.areasOfConcern && profile.areasOfConcern.length === 0) {
    errors.push('areasOfConcern cannot be empty');
  }
  
  // Validate risk tolerance if provided
  if (profile.riskTolerance && !['low', 'medium', 'high'].includes(profile.riskTolerance)) {
    errors.push('riskTolerance must be low, medium, or high');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculates relevance score between user profile and geopolitical event
 * @param {Object} userProfile - The user's profile
 * @param {Object} event - The geopolitical event
 * @returns {number} - Relevance score between 0 and 1
 */
const calculateRelevanceScore = (userProfile, event) => {
  // Handle null/undefined inputs
  if (!userProfile || !event) {
    return 0;
  }
  
  let score = 0;
  let totalWeight = 0;
  
  // Business units matching (weight: 0.3)
  if (userProfile.businessUnits && Array.isArray(userProfile.businessUnits)) {
    const businessUnitMatches = userProfile.businessUnits.filter(unit => {
      if (!unit || !unit.name) return false;
      const unitName = unit.name.toLowerCase();
      return event.categories && event.categories.some(category => {
        const categoryName = category.toLowerCase();
        // Check if category contains unit name OR unit name contains category
        return categoryName.includes(unitName) || unitName.includes(categoryName) ||
               // Special mappings for common terms
               (unitName.includes('semiconductor') && categoryName.includes('technology')) ||
               (unitName.includes('supply chain') && categoryName.includes('supply chain')) ||
               (unitName.includes('cloud') && categoryName.includes('technology')) ||
               (unitName.includes('ai') && categoryName.includes('technology'));
      });
    }).length;
  
    if (userProfile.businessUnits.length > 0) {
      score += (businessUnitMatches / userProfile.businessUnits.length) * 0.3;
      totalWeight += 0.3;
    }
  }
  
  // Areas of concern matching (weight: 0.3)
  if (userProfile.areasOfConcern && Array.isArray(userProfile.areasOfConcern)) {
    const concernMatches = userProfile.areasOfConcern.filter(concern => {
      if (!concern || !concern.category) return false;
      const concernCategory = concern.category.toLowerCase();
      return event.categories && event.categories.some(category => {
        const categoryName = category.toLowerCase();
        // Check if category contains concern OR concern contains category
        return categoryName.includes(concernCategory) || concernCategory.includes(categoryName) ||
               // Special mappings for common terms
               (concernCategory.includes('trade disputes') && categoryName.includes('trade')) ||
               (concernCategory.includes('sanctions') && categoryName.includes('sanctions')) ||
               (concernCategory.includes('supply chain disruptions') && categoryName.includes('supply chain')) ||
               (concernCategory.includes('regulatory changes') && categoryName.includes('regulation')) ||
               (concernCategory.includes('cybersecurity threats') && categoryName.includes('cybersecurity'));
      });
    }).length;
  
    if (userProfile.areasOfConcern.length > 0) {
      score += (concernMatches / userProfile.areasOfConcern.length) * 0.3;
      totalWeight += 0.3;
    }
  }
  
  // Regional matching (weight: 0.2)
  if (userProfile.regions && Array.isArray(userProfile.regions) && event.regions && Array.isArray(event.regions)) {
    const regionMatches = userProfile.regions.filter(region => 
      event.regions.some(eventRegion => 
        eventRegion.toLowerCase().includes(region.toLowerCase())
      )
    ).length;
    
    if (userProfile.regions.length > 0) {
      score += (regionMatches / userProfile.regions.length) * 0.2;
      totalWeight += 0.2;
    }
  }
  
  // Text content matching (weight: 0.2)
  if (event.title && event.description) {
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    const businessUnitNames = userProfile.businessUnits && Array.isArray(userProfile.businessUnits) 
      ? userProfile.businessUnits.map(unit => unit.name).join(' ')
      : '';
    const concernCategories = userProfile.areasOfConcern && Array.isArray(userProfile.areasOfConcern)
      ? userProfile.areasOfConcern.map(concern => concern.category).join(' ')
      : '';
    const profileText = `${businessUnitNames} ${concernCategories}`.toLowerCase();
    
    const profileWords = profileText.split(' ').filter(word => word.length > 0);
    const matchingWords = profileWords.filter(word => 
      word.length > 3 && eventText.includes(word)
    ).length;
    
    if (profileWords.length > 0) {
      score += (matchingWords / profileWords.length) * 0.2;
      totalWeight += 0.2;
    }
  }
  
  // Normalize score by total weight
  return totalWeight > 0 ? score / totalWeight : 0;
};

module.exports = {
  validateUserProfile,
  calculateRelevanceScore
}; 