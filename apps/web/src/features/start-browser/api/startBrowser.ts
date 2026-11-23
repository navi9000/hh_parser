const browserStartApiUrl = "http://127.0.0.1:3000/browser/start"

async function startBrowser(): Promise<void> {
  const response = await fetch(browserStartApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://hh.ru" }),
  })

  if (!response.ok) {
    throw new Error(`Browser start failed with status ${response.status}`)
  }
}

export { startBrowser }
