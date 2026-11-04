export interface Problem {
  id: string;
  slug: string;
  title: string;
  platform: 'LeetCode' | 'Codeforces' | 'HackerRank' | 'CodeChef';
  platformId: string;
  platformUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  solved: boolean;
  companies: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode?: Record<string, string>;
}

export const curatedProblemsCatalog: Problem[] = [
  {
    id: '1',
    slug: 'two-sum',
    title: 'Two Sum',
    platform: 'LeetCode',
    platformId: 'LeetCode #1',
    platformUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptance: '53.4%',
    solved: false,
    companies: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft', 'Uber'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
  },
  {
    id: '2',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    platform: 'LeetCode',
    platformId: 'LeetCode #20',
    platformUrl: 'https://leetcode.com/problems/valid-parentheses/',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    acceptance: '41.5%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order. Every close bracket must have a corresponding open bracket of the same type.',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only: "()[]{}"',
    ],
  },
  {
    id: '3',
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    platform: 'LeetCode',
    platformId: 'LeetCode #21',
    platformUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    difficulty: 'Easy',
    category: 'Linked Lists',
    acceptance: '64.8%',
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
    description:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
  },
  {
    id: '4',
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    platform: 'LeetCode',
    platformId: 'LeetCode #121',
    platformUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    difficulty: 'Easy',
    category: 'Sliding Window',
    acceptance: '54.7%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    description:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
  },
  {
    id: '5',
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    platform: 'LeetCode',
    platformId: 'LeetCode #3',
    platformUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    category: 'Sliding Window',
    acceptance: '35.2%',
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Google', 'Meta'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
  },
  {
    id: '6',
    slug: '3sum',
    title: '3Sum',
    platform: 'LeetCode',
    platformId: 'LeetCode #15',
    platformUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    category: 'Two Pointers',
    acceptance: '34.8%',
    solved: false,
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft', 'Apple'],
    description:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
  },
  {
    id: '7',
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    platform: 'LeetCode',
    platformId: 'LeetCode #11',
    platformUrl: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    category: 'Two Pointers',
    acceptance: '55.1%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Apple'],
    description:
      'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The max area is between index 1 and 8: min(8, 7) * 7 = 49.',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
  },
  {
    id: '8',
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    platform: 'LeetCode',
    platformId: 'LeetCode #49',
    platformUrl: 'https://leetcode.com/problems/group-anagrams/',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    acceptance: '68.2%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    description:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
  },
  {
    id: '9',
    slug: 'coin-change',
    title: 'Coin Change',
    platform: 'LeetCode',
    platformId: 'LeetCode #322',
    platformUrl: 'https://leetcode.com/problems/coin-change/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '43.9%',
    solved: false,
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    description:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
  },
  {
    id: '10',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    platform: 'LeetCode',
    platformId: 'LeetCode #200',
    platformUrl: 'https://leetcode.com/problems/number-of-islands/',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptance: '59.1%',
    solved: false,
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Bloomberg'],
    description:
      'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    examples: [
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1".',
    ],
  },
  {
    id: '11',
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    platform: 'LeetCode',
    platformId: 'LeetCode #215',
    platformUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    difficulty: 'Medium',
    category: 'Heaps & Priority Queues',
    acceptance: '67.5%',
    solved: false,
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    description:
      'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?',
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
      },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
  },
  {
    id: '12',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    platform: 'LeetCode',
    platformId: 'LeetCode #42',
    platformUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    difficulty: 'Hard',
    category: 'Two Pointers',
    acceptance: '62.0%',
    solved: false,
    companies: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft'],
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
  },
  {
    id: '13',
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    platform: 'LeetCode',
    platformId: 'LeetCode #23',
    platformUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    difficulty: 'Hard',
    category: 'Linked Lists',
    acceptance: '53.2%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
    ],
  },
  {
    id: '14',
    slug: 'course-schedule',
    title: 'Course Schedule',
    platform: 'LeetCode',
    platformId: 'LeetCode #207',
    platformUrl: 'https://leetcode.com/problems/course-schedule/',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptance: '47.3%',
    solved: false,
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
    ],
  },
  {
    id: '15',
    slug: 'lru-cache',
    title: 'LRU Cache',
    platform: 'LeetCode',
    platformId: 'LeetCode #146',
    platformUrl: 'https://leetcode.com/problems/lru-cache/',
    difficulty: 'Medium',
    category: 'Design & Hash Maps',
    acceptance: '43.1%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple', 'Bloomberg'],
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations running in O(1) average time complexity.',
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
  },
  {
    id: '16',
    slug: 'word-break',
    title: 'Word Break',
    platform: 'LeetCode',
    platformId: 'LeetCode #139',
    platformUrl: 'https://leetcode.com/problems/word-break/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '46.8%',
    solved: false,
    companies: ['Amazon', 'Meta', 'Google', 'Bloomberg'],
    description:
      'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: 'true',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
    ],
  },
  {
    id: '17',
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    platform: 'LeetCode',
    platformId: 'LeetCode #70',
    platformUrl: 'https://leetcode.com/problems/climbing-stairs/',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    acceptance: '53.0%',
    solved: false,
    companies: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    description:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1+1+1, 1+2, or 2+1.',
      },
    ],
    constraints: ['1 <= n <= 45'],
  },
  {
    id: '18',
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    platform: 'LeetCode',
    platformId: 'LeetCode #53',
    platformUrl: 'https://leetcode.com/problems/maximum-subarray/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '50.8%',
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Bloomberg'],
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum (Kadane Algorithm).',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
  },
  {
    id: '19',
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    platform: 'LeetCode',
    platformId: 'LeetCode #56',
    platformUrl: 'https://leetcode.com/problems/merge-intervals/',
    difficulty: 'Medium',
    category: 'Intervals',
    acceptance: '47.6%',
    solved: false,
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Bloomberg', 'Apple'],
    description:
      'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
  },
  {
    id: '20',
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    platform: 'LeetCode',
    platformId: 'LeetCode #33',
    platformUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    category: 'Binary Search',
    acceptance: '40.9%',
    solved: false,
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    description:
      'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
    ],
  },
  {
    id: '21',
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    platform: 'LeetCode',
    platformId: 'LeetCode #226',
    platformUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    difficulty: 'Easy',
    category: 'Trees',
    acceptance: '76.8%',
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    description:
      'Given the root of a binary tree, invert the tree, and return its root.',
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
      },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
  },
  {
    id: '22',
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    platform: 'LeetCode',
    platformId: 'LeetCode #238',
    platformUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    acceptance: '66.1%',
    solved: false,
    companies: ['Amazon', 'Meta', 'Google', 'Apple', 'Microsoft'],
    description:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
    ],
  },
  {
    id: '23',
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    platform: 'LeetCode',
    platformId: 'LeetCode #347',
    platformUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    difficulty: 'Medium',
    category: 'Heaps & Priority Queues',
    acceptance: '63.9%',
    solved: false,
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
    description:
      'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
    ],
  },
  {
    id: '24',
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    platform: 'LeetCode',
    platformId: 'LeetCode #128',
    platformUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    acceptance: '47.4%',
    solved: false,
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    description:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.',
      },
      {
        input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        output: '9',
      },
    ],
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
  },
  {
    id: '25',
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    platform: 'LeetCode',
    platformId: 'LeetCode #98',
    platformUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    difficulty: 'Medium',
    category: 'Trees',
    acceptance: '32.9%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    description:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node key, and the right subtree contains only nodes with keys greater.',
    examples: [
      {
        input: 'root = [2,1,3]',
        output: 'true',
      },
      {
        input: 'root = [5,1,4,null,null,3,6]',
        output: 'false',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
  },
  {
    id: '26',
    slug: 'combination-sum',
    title: 'Combination Sum',
    platform: 'LeetCode',
    platformId: 'LeetCode #39',
    platformUrl: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    category: 'Backtracking',
    acceptance: '71.5%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    description:
      'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.',
    examples: [
      {
        input: 'candidates = [2,3,6,7], target = 7',
        output: '[[2,2,3],[7]]',
      },
    ],
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      '1 <= target <= 40',
    ],
  },
  {
    id: '27',
    slug: 'word-search',
    title: 'Word Search',
    platform: 'LeetCode',
    platformId: 'LeetCode #79',
    platformUrl: 'https://leetcode.com/problems/word-search/',
    difficulty: 'Medium',
    category: 'Backtracking',
    acceptance: '41.8%',
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Google'],
    description:
      'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
    ],
  },
  {
    id: '28',
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    platform: 'LeetCode',
    platformId: 'LeetCode #76',
    platformUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    difficulty: 'Hard',
    category: 'Sliding Window',
    acceptance: '42.3%',
    solved: false,
    companies: ['Meta', 'Google', 'Amazon', 'Microsoft', 'Apple'],
    description:
      'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
      },
    ],
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
    ],
  },
  {
    id: '29',
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    platform: 'LeetCode',
    platformId: 'LeetCode #4',
    platformUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    difficulty: 'Hard',
    category: 'Binary Search',
    acceptance: '40.7%',
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    description:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.0',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.5',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
    ],
  },
  {
    id: '30',
    slug: 'house-robber',
    title: 'House Robber',
    platform: 'LeetCode',
    platformId: 'LeetCode #198',
    platformUrl: 'https://leetcode.com/problems/house-robber/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '50.6%',
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    description:
      'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.',
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
      },
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
  },
  {
    id: '31',
    slug: 'jump-game',
    title: 'Jump Game',
    platform: 'LeetCode',
    platformId: 'LeetCode #55',
    platformUrl: 'https://leetcode.com/problems/jump-game/',
    difficulty: 'Medium',
    category: 'Greedy',
    acceptance: '38.9%',
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Apple'],
    description:
      'You are given an integer array nums. You are initially positioned at the array first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5',
    ],
  },
  {
    id: '32',
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    platform: 'LeetCode',
    platformId: 'LeetCode #739',
    platformUrl: 'https://leetcode.com/problems/daily-temperatures/',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    acceptance: '66.2%',
    solved: false,
    companies: ['Amazon', 'Meta', 'Google'],
    description:
      'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.',
    examples: [
      {
        input: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]',
      },
    ],
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100',
    ],
  },
  {
    id: '33',
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    platform: 'LeetCode',
    platformId: 'LeetCode #300',
    platformUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '55.3%',
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
    description:
      'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4',
    ],
  },
  {
    id: '34',
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    platform: 'LeetCode',
    platformId: 'LeetCode #54',
    platformUrl: 'https://leetcode.com/problems/spiral-matrix/',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    acceptance: '49.8%',
    solved: false,
    companies: ['Microsoft', 'Google', 'Amazon', 'Apple', 'Meta'],
    description:
      'Given an m x n matrix, return all elements of the matrix in spiral order.',
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
      },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100',
    ],
  },
];

