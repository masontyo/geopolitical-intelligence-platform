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
  let score = 0;
  let totalWeight = 0;
  
  // Business units matching (weight: 0.3)
  const businessUnitMatches = userProfile.businessUnits.filter(unit => 
    event.categories && event.categories.some(category => 
      category.toLowerCase().includes(unit.toLowerCase())
    )
  ).length;
  
  if (userProfile.businessUnits.length > 0) {
    score += (businessUnitMatches / userProfile.businessUnits.length) * 0.3;
    totalWeight += 0.3;
  }
  
  // Areas of concern matching (weight: 0.3)
  const concernMatches = userProfile.areasOfConcern.filter(concern => 
    event.categories && event.categories.some(category => 
      category.toLowerCase().includes(concern.toLowerCase())
    )
  ).length;
  
  if (userProfile.areasOfConcern.length > 0) {
    score += (concernMatches / userProfile.areasOfConcern.length) * 0.3;
    totalWeight += 0.3;
  }
  
  // Regional matching (weight: 0.2)
  if (userProfile.regions && event.regions) {
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
  const eventText = `${event.title} ${event.description}`.toLowerCase();
  const profileText = `${userProfile.businessUnits.join(' ')} ${userProfile.areasOfConcern.join(' ')}`.toLowerCase();
  
  const profileWords = profileText.split(' ');
  const matchingWords = profileWords.filter(word => 
    word.length > 3 && eventText.includes(word)
  ).length;
  
  if (profileWords.length > 0) {
    score += (matchingWords / profileWords.length) * 0.2;
    totalWeight += 0.2;
  }
  
  // Normalize score by total weight
  return totalWeight > 0 ? score / totalWeight : 0;
};

module.exports = {
  validateUserProfile,
  calculateRelevanceScore
}; 