"use client"
import React from 'react'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import AuthModal from './AuthModal'
import { signOut } from '@/app/actions'

const AuthButton = ({user}) => {

    const [showAuthModal, setShowAuthModal] = useState(false);
    
    if(user){
        return(
            <form action={signOut}>
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer rounded-lg px-3 py-1.5" type="submit">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </form>
        )
    }

    return (
        <>
        <Button onClick={() => setShowAuthModal(true)} variant="outline" size="sm" className="bg-zinc-50 hover:bg-zinc-100 border border-border text-zinc-700 hover:text-zinc-900 rounded-lg gap-2 px-4 py-2 cursor-pointer font-semibold transition-colors">
            <LogIn className="w-4 h-4 text-zinc-500" />
            Sign In
        </Button>

        <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
        />
         </>
    )
}

export default AuthButton