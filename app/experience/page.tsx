import { Metadata } from "next"

import { Card, CardContent, CardHeader } from "./card"
import { RESUME_DATA } from "@/resume-data"
import { tw } from "../tw"
import { AnimatedName } from "../animated-name"

const Section=({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <section className={tw("flex min-h-0 flex-col gap-y-3", className)} {...props} />
}

export const metadata: Metadata = {
  title: `${RESUME_DATA.name}`,
  description: RESUME_DATA.summary,
}

export default function Page() {
  return (
    <>
      <AnimatedName />
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <Section>
          <h2 className="text-xl font-bold font-display">Work Experience</h2>
          {RESUME_DATA.work.map((work) => (
            <Card key={work.company}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                    <a className="hover:underline" href={work.link}>
                      {work.company}
                    </a>

                    <span className="inline-flex gap-x-1">
                      {work.badges.map((badge) => (
                        <span
                          className="align-middle text-xs"
                          key={badge}
                        >
                          {badge}
                        </span>
                      ))}
                    </span>
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {work.start} - {work.end}
                  </div>
                </div>
                <h4 className="text-sm leading-none">{work.title}</h4>
              </CardHeader>
              <CardContent className="text-sm -mt-2">
                <ul className="list-disc ml-3">
                  {work.bulletPoints.map((bulletPoint) => (
                    <li key={bulletPoint} className="my-1.5">
                      {bulletPoint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Section>
        <Section>
          <h2 className="text-xl font-bold font-display">Education</h2>
          {RESUME_DATA.education.map((education) => (
            <Card key={education.school}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="font-semibold leading-none">{education.school}</h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    {education.start} - {education.end}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2 mt-2 text-sm">{education.degree}</CardContent>
            </Card>
          ))}
        </Section>
      </section>
    </>
  )
}