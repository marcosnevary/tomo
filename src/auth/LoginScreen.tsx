import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

function LoginScreen() {
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Tomo</h1>
      <p className="text-sm text-muted-foreground">
        Sign in to keep track of your books.
      </p>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </main>
  )
}

export { LoginScreen }
