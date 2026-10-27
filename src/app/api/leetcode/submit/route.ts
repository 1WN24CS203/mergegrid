import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, questionId, lang, code, sessionToken, csrfToken } = body;

    if (!slug || !code) {
      return NextResponse.json(
        { error: 'Problem slug and code are required' },
        { status: 400 }
      );
    }

    // If no credentials provided, notify client to use direct web clipboard submission
    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        requiresSession: true,
        message:
          'No LEETCODE_SESSION configured. Use 1-click web submission with copied code.',
      });
    }

    const leetCodeLangMap: Record<string, string> = {
      typescript: 'typescript',
      python: 'python3',
      cpp: 'cpp',
      java: 'java',
    };
    const leetLang = leetCodeLangMap[lang] || 'typescript';

    const submitUrl = `https://leetcode.com/problems/${slug}/submit/`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/problems/${slug}/`,
      Origin: 'https://leetcode.com',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: `LEETCODE_SESSION=${sessionToken}; ${csrfToken ? `csrftoken=${csrfToken};` : ''}`,
    };

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const submitRes = await fetch(submitUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        lang: leetLang,
        question_id: questionId ? String(questionId) : undefined,
        typed_code: code,
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      return NextResponse.json(
        {
          success: false,
          requiresSession: submitRes.status === 403 || submitRes.status === 401,
          message:
            submitRes.status === 403 || submitRes.status === 401
              ? 'LeetCode session token expired or invalid CSRF token.'
              : `LeetCode submit returned HTTP ${submitRes.status}`,
          details: errText.slice(0, 300),
        },
        { status: 200 }
      );
    }

    const submitData = await submitRes.json();
    const submissionId = submitData.submission_id;

    if (!submissionId) {
      return NextResponse.json({
        success: false,
        message: 'No submission ID returned by LeetCode',
        raw: submitData,
      });
    }

    // Poll for judge result (up to 6 attempts)
    let checkResult: any = null;
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      const checkRes = await fetch(
        `https://leetcode.com/submissions/detail/${submissionId}/check/`,
        { headers }
      );
      if (checkRes.ok) {
        checkResult = await checkRes.json();
        if (checkResult.state === 'SUCCESS') {
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      result: checkResult || { state: 'PENDING' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error communicating with LeetCode' },
      { status: 500 }
    );
  }
}
