import { LoginScreen } from "@/auth/LoginScreen"
import { useSession } from "@/auth/useSession"
import { BooksScreen } from "@/books/BooksScreen"

function App() {
  const session = useSession()

  if (session === undefined) return null
  if (session === null) return <LoginScreen />
  return <BooksScreen />
}

export default App
