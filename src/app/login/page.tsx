'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })

            if (response.ok) {
                router.push('/')
                router.refresh()
            } else {
                setError('Invalid password')
            }
        } catch (err) {
            setError(`An error occurred: ${err}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-2xl font-bold text-center">Login Required</h1>

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full"
                    />

                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
} 