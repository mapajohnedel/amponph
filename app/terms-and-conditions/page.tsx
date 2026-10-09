import { Metadata } from 'next'
import { FileText, CheckSquare, Users, HeartHandshake, Image as ImageIcon, AlertTriangle, RefreshCcw, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions for AmponPH',
}

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sections = [
    {
      icon: <CheckSquare className="h-6 w-6 text-primary" />,
      title: '1. Acceptance of Terms',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using AmponPH, you accept and agree to be bound by the terms and provision of this agreement. 
          In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable 
          to such services.
        </p>
      ),
    },
    {
      icon: <Users className="h-6 w-6 text-[#3b82f6]" />,
      title: '2. Description of Service',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          AmponPH provides a platform to connect individuals looking to adopt pets with animal shelters, rescue groups, 
          and individuals listing pets for adoption ("Partners"). AmponPH is a free service for the community and does not 
          charge adoption fees itself; however, Partners may have their own adoption fees or requirements.
        </p>
      ),
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-[#ef4444]" />,
      title: '3. User Responsibilities',
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">When using our platform, you agree that you will not:</p>
          <ul className="space-y-3">
            {[
              'Provide false, inaccurate, or misleading information during registration or the adoption application process.',
              'Use the platform for any illegal or unauthorized purpose.',
              'Attempt to harass, abuse, or harm another person, including our Partners.',
              'Interfere with or disrupt the integrity or performance of the platform.',
              'List pets for sale or commercial breeding purposes. AmponPH is strictly for adoption and rehoming.',
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef4444]/60" />
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-[#10b981]" />,
      title: '4. Partner Listings and Adoption Process',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          AmponPH acts only as a facilitator to connect you with Partners. We do not guarantee the health, behavior, 
          or breed of any pet listed on the platform. The adoption process, including approval and final handover of the pet, 
          is strictly between the user and the Partner. AmponPH is not liable for any disputes arising from the adoption process.
        </p>
      ),
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-[#8b5cf6]" />,
      title: '5. Content Ownership and Use',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By posting content (such as pet listings, images, or success stories) to AmponPH, you grant us a non-exclusive, 
          worldwide, royalty-free license to use, reproduce, and display that content on our platform and marketing materials.
        </p>
      ),
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-[#f59e0b]" />,
      title: '6. Changes to Terms',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          AmponPH reserves the right, in its sole discretion, to change the Terms under which the platform is offered. 
          The most current version of the Terms will supersede all previous versions.
        </p>
      ),
    },
    {
      icon: <Mail className="h-6 w-6 text-[#06b6d4]" />,
      title: '7. Contact Information',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions or comments regarding these Terms, please email us at{' '}
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
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-5xl lg:text-6xl">
            Terms & Conditions
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            The rules and guidelines for using AmponPH. Please read these carefully before using our platform.
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
