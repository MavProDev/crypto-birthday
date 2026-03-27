export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // This is the MM-DD date
  
  if (!id) {
    return new Response(null, { status: 302, headers: { Location: '/' } });
  }
  
  // Get the base URL for absolute og:image URL (X requires absolute URLs)
  const baseUrl = new URL(req.url).origin;
  const ogImageUrl = `${baseUrl}/api/og?d=${encodeURIComponent(id)}`;
  const redirectUrl = `${baseUrl}/?d=${encodeURIComponent(id)}`;
  
  // Return an HTML page with og:image meta tags
  // X's crawler will read these, then the user gets redirected to the app
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta property="og:title" content="What Crypto Are You?">
<meta property="og:description" content="I just found my crypto personality. Enter your birthday and find yours.">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:url" content="${baseUrl}/s/${id}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="What Crypto Are You?">
<meta name="twitter:description" content="I just found my crypto personality. Enter your birthday and find yours.">
<meta name="twitter:image" content="${ogImageUrl}">
<meta http-equiv="refresh" content="0;url=${redirectUrl}">
<title>What Crypto Are You?</title>
</head>
<body style="background:#0a0a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<p>Loading your crypto personality...</p>
<script>window.location.href="${redirectUrl}";</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
