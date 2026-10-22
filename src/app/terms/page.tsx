import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = { title: 'Terms of Service', description: 'Terms of use for the Yildiz Foundation website and consultancy services.' }
export default function TermsPage() { return <LegalPage kind="terms" /> }
