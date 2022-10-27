const info = (req, res) => {
  try {
    const data = {
      author: 'Ezzaky',
      routes: [
        {
          name: 'info',
          path: '/api',
          method: 'GET',
          description: 'gives you information about this api',
        },
        {
          name: 'validate-one',
          path: '/api/validate-one',
          method: 'POST',
          description: 'used to validate single/one email',
        },
        {
          name: 'validate-bulk',
          path: '/api/validate-bulk',
          method: 'POST',
          description: 'used to validate multiple/bulk email',
        },
      ],
      homepage: '/',
      madeBy: "MD Israfil Miya"
    }
    res.status(200).json(data)
  } catch {
    res.status(500).json({ error: 'Server error.' })
  }
}

export default info
