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

interface AlgorithmicArchetype {
  canonicalName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coreTechnique: string;
  // Key semantic phrases & trigger concepts
  conceptTokens: string[];
  // Structural description patterns
  patternRegexes: RegExp[];
  explanation: string;
}

const ALGORITHMIC_ARCHETYPES: AlgorithmicArchetype[] = [
  {
    canonicalName: 'Two Sum (LeetCode #1)',
    difficulty: 'Easy',
    coreTechnique: 'Hash Map / Two Pointers',
    conceptTokens: [
      'two', 'sum', 'pair', 'target', 'indices', 'add', 'up', 'element', 'numbers',
      'complement', 'hash', 'total', 'equals', 'two elements', 'find pair'
    ],
    patternRegexes: [
      /indices\s+of\s+(?:the\s+)?two\s+numbers/i,
      /two\s+(?:numbers|elements|integers|values)\s+such\s+that\s+they\s+add\s+up\s+to\s+target/i,
      /pair\s+(?:of\s+numbers\s+)?that\s+sums?\s+to/i,
      /find\s+two\s+elements?\s+whose\s+sum\s+is/i,
      /return\s+(?:the\s+)?indices\s+of\s+(?:two|a\s+pair)/i,
      /target\s*=\s*\d+.*output\s*=\s*\[\s*\d+\s*,\s*\d+\s*\]/i,
    ],
    explanation: 'Core challenge asks to find a pair of integers that sum to a given target, identical to the classic Two Sum pattern.',
  },
  {
    canonicalName: '3Sum (LeetCode #15)',
    difficulty: 'Medium',
    coreTechnique: 'Two Pointers & Sorting',
    conceptTokens: [
      'three', 'triplet', 'triplets', 'zero', 'sum', 'three numbers', 'nums[i]', 'nums[j]', 'nums[k]',
      'distinct', 'triplet sum', 'unique triplets'
    ],
    patternRegexes: [
      /three\s+(?:numbers|elements|integers)\s+such\s+that\s+they\s+add\s+up\s+to/i,
      /all\s+(?:unique\s+)?triplets?\s+\[nums\[i\],\s*nums\[j\],\s*nums\[k\]\]/i,
      /nums\[i\]\s*\+\s*nums\[j\]\s*\+\s*nums\[k\]\s*==\s*0/i,
      /triplets?\s+that\s+sum\s+to\s+zero/i,
    ],
    explanation: 'Asks to identify all unique triplets whose sum equals zero or target, which matches the 3Sum archetype.',
  },
  {
    canonicalName: 'Valid Parentheses (LeetCode #20)',
    difficulty: 'Easy',
    coreTechnique: 'Monotonic / LIFO Stack',
    conceptTokens: [
      'parentheses', 'brackets', 'braces', 'open', 'close', 'closed', 'valid', 'matching',
      'stack', 'string', 'bracket', 'curly', 'square'
    ],
    patternRegexes: [
      /brackets?\s+must\s+be\s+closed\s+by\s+the\s+same\s+type/i,
      /open\s+brackets?\s+must\s+be\s+closed\s+in\s+the\s+correct\s+order/i,
      /determine\s+if\s+the\s+input\s+string\s+is\s+valid.*['"()\[\]{}]+/i,
      /consisting\s+of\s+characters\s+['"({\[\]})]+/i,
      /balanced\s+(?:parentheses|brackets|braces)/i,
    ],
    explanation: 'Tests balanced opening and closing bracket matching in LIFO order, identical to the Valid Parentheses stack pattern.',
  },
  {
    canonicalName: 'Best Time to Buy and Sell Stock (LeetCode #121)',
    difficulty: 'Easy',
    coreTechnique: 'One-Pass Greedy / Kadane Variation',
    conceptTokens: [
      'stock', 'prices', 'buy', 'sell', 'maximize', 'profit', 'day', 'single day',
      'future', 'maximum profit', 'trading', 'price'
    ],
    patternRegexes: [
      /prices\s+where\s+prices\[i\]\s+is\s+the\s+price/i,
      /maximize\s+(?:your\s+)?profit\s+by\s+choosing\s+a\s+single\s+day\s+to\s+buy/i,
      /maximum\s+profit\s+you\s+can\s+achieve\s+from\s+this\s+transaction/i,
      /buy\s+on\s+one\s+day\s+and\s+sell\s+on\s+a\s+(?:different|later|future)\s+day/i,
    ],
    explanation: 'Involves calculating maximum positive difference between future and past prices in an array, matching the standard Buy & Sell Stock problem.',
  },
  {
    canonicalName: 'Merge Two Sorted Lists (LeetCode #21)',
    difficulty: 'Easy',
    coreTechnique: 'Two Pointers / Linked List Splice',
    conceptTokens: [
      'merge', 'sorted', 'lists', 'linked list', 'heads', 'splicing', 'nodes', 'sorted order',
      'ascending'
    ],
    patternRegexes: [
      /merge\s+(?:the\s+)?two\s+sorted\s+(?:linked\s+)?lists/i,
      /splicing\s+together\s+the\s+nodes\s+of\s+the\s+first\s+two\s+lists/i,
      /heads\s+of\s+two\s+sorted\s+linked\s+lists/i,
      /return\s+(?:the\s+)?head\s+of\s+the\s+merged\s+linked\s+list/i,
    ],
    explanation: 'Requires interweaving two pre-sorted linked lists into a single continuous sorted list, matching Merge Two Sorted Lists.',
  },
  {
    canonicalName: 'Maximum Subarray (LeetCode #53)',
    difficulty: 'Medium',
    coreTechnique: "Kadane's Algorithm / Divide & Conquer",
    conceptTokens: [
      'subarray', 'contiguous', 'largest sum', 'maximum sum', 'kadane', 'array', 'sub-array'
    ],
    patternRegexes: [
      /contiguous\s+subarray.*(?:largest|maximum)\s+sum/i,
      /find\s+the\s+subarray\s+with\s+the\s+largest\s+sum/i,
      /maximum\s+possible\s+sum\s+of\s+a\s+contiguous\s+sub/i,
    ],
    explanation: "Calculates the maximum contiguous subarray sum, which is the exact problem solved by Kadane's algorithm.",
  },
  {
    canonicalName: 'Longest Substring Without Repeating Characters (LeetCode #3)',
    difficulty: 'Medium',
    coreTechnique: 'Sliding Window & Hash Set',
    conceptTokens: [
      'substring', 'repeating', 'characters', 'longest', 'unique', 'without duplicate',
      'sliding window', 'length of the longest'
    ],
    patternRegexes: [
      /longest\s+substring\s+without\s+repeating\s+characters/i,
      /length\s+of\s+the\s+longest\s+substring\s+without\s+duplicate/i,
      /find\s+the\s+length\s+of\s+the\s+longest\s+substring.*unique/i,
    ],
    explanation: 'Finds the longest contiguous window containing all distinct characters, matching the classic Sliding Window archetype.',
  },
  {
    canonicalName: 'Trapping Rain Water (LeetCode #42)',
    difficulty: 'Hard',
    coreTechnique: 'Two Pointers / Monotonic Stack',
    conceptTokens: [
      'trap', 'rain', 'water', 'elevation', 'map', 'bars', 'width', 'trapped'
    ],
    patternRegexes: [
      /elevation\s+map\s+where\s+the\s+width\s+of\s+each\s+bar\s+is\s+1/i,
      /compute\s+how\s+much\s+water\s+it\s+can\s+trap\s+after\s+raining/i,
      /trap\s+(?:rain\s+)?water\s+between\s+(?:bars|heights|elevations)/i,
    ],
    explanation: 'Simulates fluid accumulation between elevation peaks, identical to Trapping Rain Water.',
  },
  {
    canonicalName: 'Reverse Linked List (LeetCode #206)',
    difficulty: 'Easy',
    coreTechnique: 'Pointer Manipulation / Iteration & Recursion',
    conceptTokens: [
      'reverse', 'linked', 'list', 'head', 'nodes', 'pointer', 'singly'
    ],
    patternRegexes: [
      /head\s+of\s+a\s+singly\s+linked\s+list,\s*reverse\s+the\s+list/i,
      /reverse\s+a\s+(?:singly\s+)?linked\s+list/i,
      /return\s+the\s+reversed\s+list/i,
    ],
    explanation: 'Involves reversing direction pointers in a singly linked list, matching the standard Reverse Linked List question.',
  },
  {
    canonicalName: 'Coin Change (LeetCode #322)',
    difficulty: 'Medium',
    coreTechnique: 'Dynamic Programming / Unbounded Knapsack',
    conceptTokens: [
      'coin', 'coins', 'change', 'amount', 'denominations', 'fewest', 'minimum coins'
    ],
    patternRegexes: [
      /fewest\s+number\s+of\s+coins\s+(?:that\s+you\s+need\s+to\s+make\s+up\s+that\s+amount|to\s+make\s+up)/i,
      /coins\s+of\s+different\s+denominations\s+and\s+an\s+integer\s+amount/i,
      /minimum\s+number\s+of\s+coins\s+needed\s+to\s+make/i,
    ],
    explanation: 'Unbounded knapsack dynamic programming problem calculating the fewest coins to reach an amount, matching Coin Change.',
  },
  {
    canonicalName: 'Number of Islands (LeetCode #200)',
    difficulty: 'Medium',
    coreTechnique: 'Matrix Graph Traversal / BFS & DFS',
    conceptTokens: [
      'islands', 'grid', 'water', 'land', '1s', '0s', 'connected', 'horizontal', 'vertical'
    ],
    patternRegexes: [
      /2d\s+grid\s+map\s+of\s+'?1'?s\s+\(land\)\s+and\s+'?0'?s\s+\(water\)/i,
      /count\s+(?:the\s+)?number\s+of\s+islands/i,
      /an\s+island\s+is\s+surrounded\s+by\s+water\s+and\s+is\s+formed\s+by\s+connecting/i,
    ],
    explanation: 'Matrix connected components problem requiring depth-first or breadth-first search to count contiguous land groups, matching Number of Islands.',
  },
  {
    canonicalName: 'Container With Most Water (LeetCode #11)',
    difficulty: 'Medium',
    coreTechnique: 'Two Pointers Greedy Area',
    conceptTokens: [
      'container', 'water', 'height', 'lines', 'vertical', 'area', 'maximum water'
    ],
    patternRegexes: [
      /two\s+lines\s+that\s+together\s+with\s+the\s+x-axis\s+form\s+a\s+container/i,
      /container\s+contains\s+the\s+most\s+water/i,
      /maximize\s+the\s+area\s+of\s+water\s+between\s+two\s+lines/i,
    ],
    explanation: 'Two pointers converging from array boundaries to maximize height * width, matching Container With Most Water.',
  },
];

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
    const combinedContent = `${cleanTitle}\n${cleanDesc}\n${sampleInput}\n${sampleOutput}`.toLowerCase();

    // 1. CONCEPTUAL & SEMANTIC SIMILARITY CHECK
    let matchedArchetype: AlgorithmicArchetype | null = null;
    let conceptMatchScore = 0;

    for (const arch of ALGORITHMIC_ARCHETYPES) {
      // Check regex pattern hits
      for (const rx of arch.patternRegexes) {
        if (rx.test(combinedContent)) {
          matchedArchetype = arch;
          conceptMatchScore = 95;
          break;
        }
      }
      if (matchedArchetype) break;

      // Check token density overlap across both title and description
      const tokenHits = arch.conceptTokens.filter((token) =>
        combinedContent.includes(token.toLowerCase())
      );
      const ratio = tokenHits.length / arch.conceptTokens.length;
      if (ratio >= 0.55 && ratio > conceptMatchScore / 100) {
        matchedArchetype = arch;
        conceptMatchScore = Math.round(ratio * 100);
      }
    }

    // Also check token similarity with existing titles
    let titleSimScore = 0;
    let titleSimilarTo = '';
    const allExisting = Array.from(
      new Set([
        ...existingTitles,
        'Two Sum',
        '3Sum',
        'Valid Parentheses',
        'Merge Two Sorted Lists',
        'Best Time to Buy and Sell Stock',
        'Longest Substring Without Repeating Characters',
        'Coin Change',
        'Number of Islands',
        'Trapping Rain Water',
        'Maximum Subarray',
      ])
    );

    for (const existing of allExisting) {
      const sim = calculateStringSimilarity(cleanTitle.toLowerCase(), existing.toLowerCase());
      if (sim > titleSimScore) {
        titleSimScore = sim;
        titleSimilarTo = existing;
      }
    }

    const isDirectDuplicate = titleSimScore >= 0.82;
    const isConceptualDuplicate = Boolean(matchedArchetype && conceptMatchScore >= 70);
    const isDuplicate = isDirectDuplicate || isConceptualDuplicate;

    const matchedName = matchedArchetype
      ? matchedArchetype.canonicalName
      : isDirectDuplicate
      ? titleSimilarTo
      : null;

    // 2. IMPACT & QUALITY SCORING
    let impactScore = 70;
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Description depth & clarity
    if (cleanDesc.length > 140) {
      impactScore += 12;
      strengths.push('Comprehensive problem specification with explicit input/output boundaries');
    } else if (cleanDesc.length < 80) {
      impactScore -= 15;
      recommendations.push('Elaborate on the problem description: explain the scenario, variables, and return requirements');
    } else {
      impactScore += 5;
    }

    // Concrete test cases
    if (sampleInput.trim() && sampleOutput.trim()) {
      impactScore += 10;
      strengths.push('Concrete sample input and expected output provided for validation');
    } else {
      impactScore -= 18;
      recommendations.push('Include at least 1 concrete sample input and corresponding expected output');
    }

    // Constraints & Complexity
    if (constraints.trim()) {
      impactScore += 8;
      strengths.push('Defines computational scale constraints (e.g. 1 <= N <= 10^5) to govern optimal runtime');
    } else {
      impactScore -= 12;
      recommendations.push('Specify computational constraints (e.g. 1 <= nums.length <= 10^5, time complexity target O(N))');
    }

    // Company relevance
    if (companies.length > 0) {
      impactScore += 5;
      strengths.push(`Tagged with relevant target industry hiring tracks: ${companies.slice(0, 3).join(', ')}`);
    }

    // Heavy penalty if duplicate (title or concept)
    if (isDuplicate) {
      impactScore = Math.min(impactScore, 36);
    }

    impactScore = Math.max(15, Math.min(98, impactScore));

    // Decision
    let decision: 'APPROVED' | 'NEEDS_REVISION' | 'DUPLICATE' = 'APPROVED';
    if (isDuplicate) {
      decision = 'DUPLICATE';
    } else if (impactScore < 65) {
      decision = 'NEEDS_REVISION';
    }

    // 3. AUTO-GENERATE STARTER CODE FOR ALL 8 LANGUAGES
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

    let summaryText = '';
    if (decision === 'APPROVED') {
      summaryText = `High impact ${difficulty} problem for ${category}. Unique algorithmic formulation approved for immediate arena publishing!`;
    } else if (decision === 'DUPLICATE') {
      if (isConceptualDuplicate && matchedArchetype) {
        summaryText = `Conceptual Duplicate Detected: Even though worded differently, this question represents the exact underlying algorithmic concept of "${matchedArchetype.canonicalName}". ${matchedArchetype.explanation} We encourage submitting original twists or novel constraint variants.`;
      } else {
        summaryText = `Duplicate Question: High similarity detected with existing catalog problem "${matchedName}". Please submit original problem variations.`;
      }
    } else {
      summaryText = 'Good problem concept, but needs clearer constraints or test case definitions before arena publication.';
    }

    return NextResponse.json({
      success: true,
      decision,
      impactScore,
      summary: summaryText,
      similarityCheck: {
        exists: isDuplicate,
        isConceptualMatch: isConceptualDuplicate,
        similarTo: matchedName,
        similarityScore: Math.max(Math.round(titleSimScore * 100), conceptMatchScore),
        explanation: matchedArchetype ? matchedArchetype.explanation : undefined,
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

function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const aTokens = new Set(a.split(/\s+/));
  const bTokens = new Set(b.split(/\s+/));
  let intersection = 0;
  aTokens.forEach((t) => {
    if (bTokens.has(t)) intersection++;
  });
  const union = new Set([...Array.from(aTokens), ...Array.from(bTokens)]).size;
  return union === 0 ? 0 : intersection / union;
}

function toCamelCase(str: string): string {
  return (
    str
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('') || 'solve'
  );
}
