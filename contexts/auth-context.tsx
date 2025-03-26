"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
      toast({
        title: "ログイン成功",
        description: "マイページにリダイレクトします",
      })
      router.push("/mypage")
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "ログインエラー",
        description: "ログインに失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      toast({
        title: "ログアウト成功",
        description: "トップページにリダイレクトします",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "ログアウトエラー",
        description: "ログアウトに失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

