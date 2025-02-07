interface ShopCode {
  code: string;
  description: string;
  expiryDate: string;
  type: 'regular' | 'top_score';
}

export async function getShopCode(score: number = 0): Promise<ShopCode> {
  try {
    // Determine if this is a top score
    const type = score >= 2000 ? 'top_score' : 'regular';
    
    // Fetch code from API
    const response = await fetch(`/api/codes?type=${type}&score=${score}`);
    if (!response.ok) {
      throw new Error('Failed to fetch code');
    }
    
    const data = await response.json();
    return {
      code: data.code,
      description: data.description,
      expiryDate: new Date(data.expiryDate).toLocaleDateString(),
      type: data.type
    };
  } catch (error) {
    console.error('Error getting shop code:', error);
    // Fallback code if API fails
    return {
      code: 'HHNYC2024',
      description: "Thanks for playing! Here's your code to use in our shop.",
      expiryDate: '12/31/2024',
      type: 'regular'
    };
  }
}
