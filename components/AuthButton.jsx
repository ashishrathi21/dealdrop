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
                <Button varient="ghost" size="sm" className='gap-2' type='submit'>
                    <LogOut className='w-4 h-4' />
                    Sign Out
                </Button>
            </form>
        )
    }

    return (
        <>
        <Button onClick={() => setShowAuthModal(true)} varient="default" size="sm" className='bg-orange-500  hover:bg-orange-600 gap-2'>
            <LogIn className='w-4 h-4' />
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