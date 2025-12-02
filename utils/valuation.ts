/**
 * Calculates the market valuation based on user votes using a Trimmed Mean approach.
 * 
 * Logic:
 * - 0-5 votes: Simple Average.
 * - 6+ votes: Sort ascending, remove top 2 and bottom 2, average the rest.
 */
export const calculateValuation = (votes: number[]): number => {
  if (!votes || votes.length === 0) return 0;

  // Simple Average for small sample size
  if (votes.length <= 5) {
    const sum = votes.reduce((a, b) => a + b, 0);
    return sum / votes.length;
  }

  // Trimmed Mean for larger sample size
  // 1. Sort
  const sortedVotes = [...votes].sort((a, b) => a - b);

  // 2. Slice (Remove top 2 and bottom 2)
  // safe guard: if length is exactly 6, removing 2 top 2 bottom leaves 2 middle.
  const trimmedVotes = sortedVotes.slice(2, sortedVotes.length - 2);

  // 3. Average
  const sum = trimmedVotes.reduce((a, b) => a + b, 0);
  return sum / trimmedVotes.length;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};