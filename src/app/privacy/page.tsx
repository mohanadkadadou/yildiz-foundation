import type { Metadata } from 'next'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Yildiz Foundation collects, uses and protects your personal data.' }
export default function PrivacyPage() { return <LegalPage kind="privacy" /> }
