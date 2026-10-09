import { Metadata } from 'next'
import { ShieldCheck, Eye, Database, Share2, Lock, History, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AmponPH',
}

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sections = [
    {
      icon: <Eye className="h-6 w-6 text-primary" />,
      title: '1. Introduction',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Welcome to AmponPH. We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you visit our 
          website or use our platform to adopt or list pets.
        </p>
      ),
    },
    {
      icon: <Database className="h-6 w-6 text-[#3b82f6]" />,
      title: '2. Information We Collect',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">We may collect and process the following data about you:</p>
          <ul className="space-y-3">
            {[
              { label: 'Personal Identification:', text: 'Name, email address, phone number, and location.' },
              { label: 'Account Data:', text: 'Username, password, and profile preferences.' },
              { label: 'Adoption Applications:', text: 'Information provided during the adoption process to help partners match you with pets.' },
              { label: 'Technical Data:', text: 'IP address, browser type, and device information.' },
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span><strong className="text-foreground font-medium">{item.label}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#10b981]" />,
      title: '3. How We Use Your Information',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">We use the collected information for the following purposes:</p>
          <ul className="space-y-3">
            {[
              'To provide and maintain our service, including matching adopters with pets.',
              'To notify you about changes to our platform or your adoption applications.',
              'To provide customer support and respond to inquiries.',
              'To monitor the usage of our platform and improve our services.',
              'To detect, prevent, and address technical issues or fraudulent activity.',
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981]/60" />
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      icon: <Share2 className="h-6 w-6 text-[#8b5cf6]" />,
      title: '4. Sharing Your Information',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We do not sell your personal data. We may share your information with partner shelters, 
          rescues, or individual listers solely for the purpose of facilitating the pet adoption process. 
          We may also disclose your information if required to do so by law.
        </p>
      ),
    },
    {
      icon: <Lock className="h-6 w-6 text-[#f59e0b]" />,
      title: '5. Security of Your Data',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          The security of your data is important to us, but remember that no method of transmission over the 
          Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable 
          means to protect your personal data, we cannot guarantee its absolute security.
        </p>
      ),
    },
    {
      icon: <History className="h-6 w-6 text-[#ec4899]" />,
      title: '6. Changes to This Privacy Policy',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>
      ),
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-[#06b6d4]" />,
      title: '7. Contact Us',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please email us at{' '}
          <a href="mailto:mapajohnedel@gmail.com" className="text-primary hover:underline font-medium">mapajohnedel@gmail.com</a>.
        </p>
      ),
    },
  ]

  return (
    <div className="relative min-h-screen bg-slate-50/30 dark:bg-muted/30">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-white/60 dark:border-white/10 bg-[linear-gradient(180deg,#fffaf6_0%,#eef7ff_100%)] dark:bg-[linear-gradient(180deg,var(--page-gradient-from)_0%,var(--page-gradient-to)_100%)] pb-24 pt-20 lg:pt-28">
        <div className="absolute left-[10%] top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[10%] top-10 h-48 w-48 rounded-full bg-[#84c5ff]/20 blur-3xl" />
        
        <div className="site-container relative text-center">
          <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-2xl bg-white/60 dark:bg-card/60 p-4 shadow-sm ring-1 ring-border/50 backdrop-blur">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            How we collect, use, and protect your information to create a safer pet adoption community.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-400 uppercase tracking-wider">
            Last Updated: {currentDate}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="site-container relative -mt-12 pb-24">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-card/80 p-6 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.2)] backdrop-blur sm:p-12 md:p-16">
          <div className="space-y-12 sm:space-y-16">
            {sections.map((section, idx) => (
              <section key={idx} className="group relative">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-2xl bg-slate-50/50 dark:bg-muted/50 opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-sm ring-1 ring-slate-100 dark:ring-border">
                    {section.icon}
                  </div>
                  <div className="flex-1 space-y-3 pt-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-2xl">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
