export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  // Validate input
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid request' })
  }

  // Get password from environment variable
  const correctPassword = process.env.ADMIN_PASSWORD

  // If env var not set, return 503 (Service Unavailable)
  if (!correctPassword) {
    return res.status(503).json({ error: 'Server configuration error' })
  }

  // Verify password
  if (password === correctPassword) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ success: false, error: 'Invalid password' })
}
