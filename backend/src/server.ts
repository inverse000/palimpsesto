import app from './app'

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`\n🏛  Palimpsesto API corriendo en http://localhost:${PORT}`)
  console.log(`   Motor de conocimiento: Yuyaypata`)
  console.log(`   Health: http://localhost:${PORT}/health\n`)
})
