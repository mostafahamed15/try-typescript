export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  OWNER: string;
  REPO: string;
  FRONTEND_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/auth/callback") {
      return handleCallback(request, env);
    }

    if (url.pathname === "/auth/status") {
      return handleStatus(request, env);
    }

    if (url.pathname === "/auth/logout") {
      return handleLogout();
    }

    return new Response("Not Found", { status: 404 });
  }
};

async function handleCallback(request: Request, env: Env): Promise<Response> {
  const code = new URL(request.url).searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return redirectWithError(env.FRONTEND_URL, "Failed to get access token");
    }

    const starred = await checkStar(env, accessToken);

    const response = new Response(null, {
      status: 302,
      headers: {
        Location: starred ? "/?auth=success" : "/?auth=likerequired"
      }
    });

    response.headers.set("Set-Cookie", `token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
    response.headers.set("Set-Cookie", `starred=${starred ? "true" : "false"}; Path=/; SameSite=Lax; Max-Age=2592000`);

    return response;
  } catch {
    return redirectWithError(env.FRONTEND_URL, "Authentication failed");
  }
}

async function checkStar(env: Env, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${env.OWNER}/${env.REPO}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!response.ok) {
      return false;
    }

    const repoData = await response.json();
    return repoData.stargazers_count > 0;
  } catch {
    return false;
  }
}

async function handleStatus(request: Request, _env: Env): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parseCookies(cookieHeader);

  const token = cookies.get("token");
  const starred = cookies.get("starred") === "true";

  if (!token) {
    return Response.json({ authenticated: false, hasLiked: false });
  }

  return Response.json({
    authenticated: true,
    hasLiked: starred,
    token
  });
}

function handleLogout(): Response {
  const response = new Response(null, {
    status: 302,
    headers: { Location: "/" }
  });

  response.headers.set("Set-Cookie", "token=; Path=/; Max-Age=0");
  response.headers.set("Set-Cookie", "starred=; Path=/; Max-Age=0");

  return response;
}

function redirectWithError(baseUrl: string, error: string): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: `/?auth=error&message=${encodeURIComponent(error)}` }
  });
}

function parseCookies(header: string): Map<string, string> {
  const cookies = new Map<string, string>();
  
  for (const cookie of header.split(";")) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name) {
      cookies.set(name, rest.join("="));
    }
  }
  
  return cookies;
}