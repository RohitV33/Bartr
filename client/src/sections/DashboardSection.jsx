import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, SealCheck, ChatText, Star } from '@phosphor-icons/react'

const STORIES = [
  {
    category: 'Design & Code Swap',
    title: 'Figma UI/UX Design for React Frontend Development',
    students: 'Aisha J. ⇄ Marcus L.',
    description: 'Aisha needed a web prototype built in React, and Marcus wanted to learn UX layout and wireframing in Figma. They did a 6-session swap and launched a campus roommate-finder app.',
    rating: '5.0',
    tags: ['Design', 'React', 'Campus Project']
  },
  {
    category: 'Content & Media Swap',
    title: 'Copywriting for Professional Video Editing',
    students: 'Priya S. ⇄ Sofia R.',
    description: 'Priya wrote marketing landing copy and newsletters for Sofia’s freelance editing studio, while Sofia edited a 2-minute personal brand reel for Priya’s internship application.',
    rating: '4.9',
    tags: ['Marketing', 'Premiere Pro', 'Writing']
  },
  {
    category: 'STEM & Language Swap',
    title: 'Python Scripting for Spanish Conversation',
    students: 'Mateo K. ⇄ Sofia V.',
    description: 'Mateo helped Sofia prepare for her Data Science midterm with coding lessons, and Sofia coached Mateo with native conversation for his exchange semester in Madrid.',
    rating: '5.0',
    tags: ['Python', 'Spanish', 'Academics']
  },
  {
    category: 'Art & Writing Swap',
    title: 'Vector Illustration for Technical Writing',
    students: 'Lucas G. ⇄ Maya T.',
    description: 'Lucas illustrated custom vector icons for Maya’s engineering portfolio, and Maya helped structure and edit Lucas’s technical research grant proposal.',
    rating: '5.0',
    tags: ['Vector Art', 'Technical docs', 'Research']
  }
]

export default function DashboardSection() {
  const containerRef = useRef(null)

  // Track scroll position of the parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  // Map vertical scroll progress (0 to 1) to horizontal translation (0% to -65%)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%'])
  const smoothX = useSpring(x, { stiffness: 85, damping: 22 })

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[#F7F7F5]" id="platform">
      
      {/* Sticky container that locks in viewport */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header container (keeps fixed margin on left) */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-jakarta font-bold uppercase tracking-widest text-[#6D28D9] block mb-3">
              Success Stories
            </span>
            <h2 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-[#0B0B0A]">
              Real student collaborations.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-jakarta text-[#0B0B0A]/40 font-medium max-w-xs">
            Scroll vertically to slide through verified swaps and see how student skills complement each other.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div className="flex w-full">
          <motion.div 
            style={{ x: smoothX }} 
            className="flex gap-8 px-6 md:px-12 w-max"
          >
            {STORIES.map((story, i) => (
              <motion.div
                key={story.title}
                className="w-[380px] sm:w-[460px] bg-white rounded-3xl p-8 border border-[#0B0B0A]/5 shadow-[0_10px_30px_rgba(11,11,10,0.02)] flex flex-col justify-between h-[400px] group transition-all duration-300 hover:border-[#6D28D9]/20"
                whileHover={{ y: -6 }}
              >
                
                {/* Top card metadata */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-jakarta font-bold uppercase tracking-wider text-[#6D28D9]">
                      {story.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-jakarta font-semibold text-[#0B0B0A]/60">
                      <Star className="w-3.5 h-3.5 fill-[#6D28D9] text-[#6D28D9]" />
                      {story.rating}
                    </div>
                  </div>
                  
                  <h3 className="font-syne text-xl sm:text-2xl font-bold text-[#0B0B0A] leading-snug group-hover:text-[#6D28D9] transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm font-jakarta text-[#0B0B0A]/60 leading-relaxed font-medium">
                    {story.description}
                  </p>
                </div>

                {/* Bottom card metadata */}
                <div className="border-t border-[#0B0B0A]/5 pt-6 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center text-[10px] font-bold">
                        {story.students[0]}
                      </div>
                      <span className="text-xs font-jakarta font-bold text-[#0B0B0A]">
                        {story.students}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-jakarta font-bold text-[#10B981] uppercase tracking-wider bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                      <SealCheck className="w-3.5 h-3.5" />
                      Verified Swap
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {story.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-jakarta font-bold uppercase tracking-wider bg-[#0B0B0A]/5 text-[#0B0B0A]/50 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            ))}

            {/* Final CTA slide card inside horizontal scroll */}
            <div className="w-[300px] sm:w-[360px] bg-[#6D28D9] rounded-3xl p-8 text-[#F7F7F5] flex flex-col justify-between h-[400px]">
              <div className="space-y-4">
                <span className="text-[10px] font-jakarta font-bold uppercase tracking-wider text-[#F7F7F5]/60">
                  Ready to start?
                </span>
                <h3 className="font-syne text-2xl sm:text-3xl font-bold leading-tight">
                  Your skillset is someone’s gateway.
                </h3>
                <p className="text-xs sm:text-sm font-jakarta text-[#F7F7F5]/70 leading-relaxed">
                  Join a premium student-only circle. Swap coding, art, language, math or editing expertise.
                </p>
              </div>

              <a 
                href="/register"
                className="group flex items-center justify-between w-full bg-[#F7F7F5] text-[#0B0B0A] text-xs font-jakarta font-bold px-6 py-4 rounded-full transition-all hover:bg-white"
              >
                Create Account Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </motion.div>
        </div>

      </div>

    </div>
  )
}