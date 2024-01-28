export async function verifyToken(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let authToken = token.split('Bearer ')[1];
    const decodedToken = jwt.verify(authToken, 'timesheet123');
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}