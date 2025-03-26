"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
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
    console.log("AuthProvider mounted")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email)
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      console.log("Starting Google sign in...")
      const provider = new GoogleAuthProvider()
      
      // スコープを設定
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
      
      // プロンプトを設定
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      console.log("Provider configured, attempting to sign in...")
      
      // ログインを実行
      const result = await signInWithPopup(auth, provider)
      console.log("Sign in successful:", result.user.email)
      
      // ユーザー情報を設定
      setUser(result.user)
      
      // 成功メッセージを表示
      toast({
        title: "ログイン成功",
        description: "メインページにリダイレクトします",
      })
      
      // メインページにリダイレクト
      router.push("/")
    } catch (error: any) {
      console.error("Error signing in:", error)
      
      let errorMessage = "ログインに失敗しました。もう一度お試しください。"
      
      // エラーメッセージを設定
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "ポップアップがブロックされました。ポップアップを許可してください。"
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "ログインがキャンセルされました。"
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "ログインがキャンセルされました。"
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "ネットワークエラーが発生しました。インターネット接続を確認してください。"
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "このドメインからのログインは許可されていません。"
      }
      
      // エラーメッセージを表示
      toast({
        title: "ログインエラー",
        description: errorMessage,
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
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "ログアウトエラー",
        description: error.message || "ログアウトに失敗しました。もう一度お試しください。",
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
