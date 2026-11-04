import { NextResponse } from 'next/server';

interface ReviewRequestBody {
  title: string;
  category: string;
  difficulty: string;
  companies?: string[];
  description: string;
  sampleInput?: string;
  sampleOutput?: string;
  constraints?: string;
  existingTitles?: string[];
}

export async function POST(request: Request) {
  try {
    const body: ReviewRequestBody = await request.json();
    const {
      title,
      category,
      difficulty,
      companies = [],
      description,
      sampleInput = '',
      sampleOutput = '',
      constraints = '',
      existingTitles = [],
    } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Problem title and description are required for AI review.' },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    // 1. DUPLICATE / SIMILARITY CHECK
    const standardCatalog = [
      'Two Sum',
      '3Sum',
      'Valid Parentheses',
      'Merge Two Sorted Lists',
      'Best Time to Buy and Sell Stock',
      'Longest Substring Without Repeating Characters',
      'Coin Change',
      'Number of Islands',
      'Kth Largest Element in an Array',
      'Trapping Rain Water',
      'Merge k Sorted Lists',
      'Course Schedule',
      'Word Break',
      'LRU Cache',
      'Climbing Stairs',
      'Maximum Subarray',
      'Binary Tree Level Order Traversal',
      'Longest Palindromic Substring',
      'Median of Two Sorted Arrays',
      'Container With Most Water',
    ];

    const allCorpus = Array.from(new Set([...existingTitles, ...standardCatalog]));
    let highestSim = 0;
    let mostSimilar = '';

    for (const item of allCorpus) {
      const sim = calculateStringSimilarity(cleanTitle.toLowerCase(), item.toLowerCase());
      if (sim > highestSim) {
        highestSim = sim;
        mostSimilar = item;
      }
    }

    const isDuplicate = highestSim >= 0.82;
    const isModerateSim = highestSim >= 0.55 && highestSim < 0.82;

    // 2. IMPACT & QUALITY SCORING
    let impactScore = 70;
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Check description depth
    if (cleanDesc.length > 120) {
      impactScore += 10;
      strengths.push('Comprehensive problem statement with clear problem boundaries');
    } else {
      impactScore -= 10;
      recommendations.push('Elaborate on the input format and edge cases in the description');
    }

    // Check examples
    if (sampleInput.trim() && sampleOutput.trim()) {
      impactScore += 10;
      strengths.push('Valid sample input/output test case included');
    } else {
      impactScore -= 15;
      recommendations.push('Provide at least 1 concrete sample input and expected output');
    }

    // Check constraints
    if (constraints.trim()) {
      impactScore += 8;
      strengths.push('Explicit computational constraints provided (helps prevent TLE)');
    } else {
      impactScore -= 10;
      recommendations.push('Specify constraints (e.g., 1 <= n <= 10^5, time complexity target O(N))');
    }

    // Check company relevance
    if (companies.length > 0) {
      impactScore += 5;
      strengths.push(`Tagged with relevant target companies: ${companies.slice(0, 3).join(', ')}`);
    }

    // Penalize if duplicate
    if (isDuplicate) {
      impactScore = Math.min(impactScore, 42);
    }

    impactScore = Math.max(20, Math.min(98, impactScore));

    // Decision
    let decision: 'APPROVED' | 'NEEDS_REVISION' | 'DUPLICATE' = 'APPROVED';
    if (isDuplicate) {
      decision = 'DUPLICATE';
    } else if (impactScore < 65) {
      decision = 'NEEDS_REVISION';
    }

    // 3. AUTO-GENERATE STARTER CODE SIGNATURES FOR ALL LANGUAGES
    const fnName = toCamelCase(cleanTitle);
    const starterCode = {
      c: `/**\n * Solution for ${cleanTitle}\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* ${fnName}(int* nums, int numsSize, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
      cpp: `class Solution {\npublic:\n    int ${fnName}(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int ${fnName}(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
      python: `class Solution:\n    def ${fnName}(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass`,
      typescript: `function ${fnName}(nums: number[]): number {\n  // Write your solution here\n  return 0;\n}`,
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nvar ${fnName} = function(nums) {\n  // Write your solution here\n  return 0;\n};`,
      go: `package main\n\nfunc ${fnName}(nums []int) int {\n    // Write your solution here\n    return 0\n}`,
      rust: `impl Solution {\n    pub fn ${fnName}(nums: Vec<i32>) -> i32 {\n        // Write your solution here\n        0\n    }\n}`,
    };

    return NextResponse.json({
      success: true,
      decision,
      impactScore,
      summary:
        decision === 'APPROVED'
          ? `High impact ${difficulty} problem for ${category}. Approved for immediate arena access!`
          : decision === 'DUPLICATE'
          ? `High similarity detected with existing problem "${mostSimilar}". We recommend contributing unique problem variations.`
          : 'Good foundation, but needs more test cases or tighter constraints before publishing.',
      similarityCheck: {
        exists: isDuplicate,
        similarTo: isDuplicate || isModerateSim ? mostSimilar : null,
        similarityScore: Math.round(highestSim * 100),
      },
      strengths,
      recommendations,
      starterCode,
      reviewedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'AI review process failed' },
      { status: 500 }
    );
  }
}

// Helpers
function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const aTokens = new Set(a.split(/\s+/));
  const bTokens = new Set(b.split(/\s+/));
  let intersection = 0;

  aTokens.forEach((token) => {
    if (bTokens.has(token)) intersection++;
  });

  const union = new Set([...Array.from(aTokens), ...Array.from(bTokens)]).size;
  return union === 0 ? 0 : intersection / union;
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('') || 'solve';
}
