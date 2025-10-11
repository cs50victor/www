'use client'

import { motion } from 'motion/react'
import { XIcon } from 'lucide-react'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { WORKS, WORK_EXPERIENCE, SOCIAL_LINKS, ABOUT } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { CursorText } from '@/components/cursor-text'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ALL_WRITINGS } from './_w'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type WorkVideoProps = {
  src: string
}

function WorkVideo({ src }: WorkVideoProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full px-2.5 py-1 text-sm transition-colors duration-200 hover:underline"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={(
        <div className='animate-pulse'></div>
      )}
    >
      <motion.main
        variants={VARIANTS_CONTAINER}
        className='mt-30 mb-40 overflow-x-clip'
        initial="hidden"
        animate="visible"
      >
        <AnimatedTabsHover />
      </motion.main>
    </Suspense>
  )
}

function AnimatedTabsHover() {
  const TABS = ['About', 'Work', 'Thoughts', 'Experience', 'Contact'] as const;
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || TABS[0];
  
  const handleTabClick = (tab:string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!searchParams.has('tab')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', TABS[0]);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, []);

  return (
    <div className='w-full'>
      <div className='flex justify-between mb-12'>
        <AnimatedBackground
          defaultValue={activeTab}
          className='rounded-lg bg-zinc-100 dark:bg-zinc-800'
          transition={{
            type: 'spring',
            bounce: 0.2,
            duration: 0.3,
          }}
          enableHover
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              data-id={tab}
              type='button'
              className={`px-4 py-1.5 tracking-tight transition-colors duration-300 ${
                activeTab === tab 
                  ? 'text-zinc-950 dark:text-zinc-50 font-medium'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </AnimatedBackground>
      </div>
      
      {activeTab === TABS[0] && (
        <motion.section
          initial="hidden"
          animate="visible"
          key="about-section"
          transition={TRANSITION_SECTION}
          className='dark:text-foreground/70 leading-6 max-w-4/6 mx-auto'
        >
          <CursorText text={ABOUT} />
        </motion.section>
      )}
      
      {activeTab === TABS[1] && (
        <motion.section
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
          key="work-section"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WORKS.map((work) => (
              <div key={work.name} className="space-y-2">
                <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <WorkVideo src={work.video} />
                </div>
                <div className="px-1">
                  <a
                    className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                    href={work.link}
                    target="_blank"
                  >
                    {work.name}
                    <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full"></span>
                  </a>
                  <p className="text-base text-zinc-600 dark:text-zinc-400">
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
      
      {activeTab === TABS[2] && (
        <motion.section
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
          key="writing-section"
        >
          <div className="flex flex-col space-y-0">
            <p className='max-w-9/12 mb-6 mx-auto text-foreground/70'>
              <q>If you&apos;re thinking without writing, you only think you&apos;re thinking.</q>
              <br />
              - <cite>Leslie Lamport</cite>
            </p>
            <AnimatedBackground
              enableHover
              className="h-full w-full rounded-lg bg-foreground/5 goup-hover"
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.2,
              }}
            >
              {ALL_WRITINGS.map((post, i) => (
                <Link
                  key={`w-${i}`}
                  className="writing item-mx-3 block rounded-xl px-3 py-3 group"
                  href={post.slug}
                  data-id={`w-${i}`}
                >
                  <div className="flex flex-col space-y-1">
                    <div>
                      <span className='inline-block mr-2'>{ALL_WRITINGS.length - i-1}. </span>
                      <h4 className="inline-block font-normal">{post.title}</h4>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">{post.description}</p>
                  </div>
                </Link>
              ))}
            </AnimatedBackground>
          </div>
        </motion.section>
      )}
      
      {activeTab === TABS[3] && (
        <motion.section
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
          key="experience-section"
        >
          <div className="flex flex-col space-y-3 max-w-11/12 mx-auto">
            <div className='mb-10'>
              <InfiniteSlider speedOnHover={20} gap={24}>
                {WORK_EXPERIENCE.map(({img_src, company}, index) => (
                  <img
                    key={index}
                    src={img_src}
                    alt={company}
                    className='aspect-square w-[100px] rounded-[0px] object-cover filter grayscale hover:grayscale-0'
                  />
                ))}
              </InfiniteSlider>
            </div>
            {WORK_EXPERIENCE.map(({link, title, company, achievement_summary, start, end}, i) => (
              <a
                className="relative overflow-hidden p-[1px] border-b hover:bg-foreground/5 hover:rounded-xl"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
              >
                <div className="relative h-full w-full rounded-[15px] p-2">
                  <div className="relative flex w-full flex-row justify-between">
                    <div>
                      <h4 className='mb-2 tracking-tighter'>{title}</h4>
                      <p>{company}</p>
                      {achievement_summary && <p className='mt-4 text-sm text-foreground/70 lowercase'>{achievement_summary}</p>}
                    </div>
                    <p className='text-sm lowercase'>{start} - {end}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.section>
      )}
      
      {activeTab === TABS[4] && (
        <motion.section
          variants={VARIANTS_SECTION}
          initial="hidden"
          animate="visible"
          transition={TRANSITION_SECTION}
          key="contact-section"
          className='w-full flex items-center justify-center'
        >
          <div className="flex items-center justify-start space-x-3">
            {SOCIAL_LINKS.map((link) => (
              <MagneticSocialLink key={link.label} link={link.link}>
                {link.label}
              </MagneticSocialLink>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}