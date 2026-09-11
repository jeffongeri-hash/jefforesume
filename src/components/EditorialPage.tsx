import { ReactNode } from 'react';

interface EditorialHeroProps {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}

export const EditorialHero = ({ kicker, title, intro, children }: EditorialHeroProps) => (
  <section className="bg-ink-deep text-on-media">
    <div className="container-blog pb-16 pt-32 md:pb-20 md:pt-40">
      <p className="kicker text-on-media/60 reveal-up">{kicker}</p>
      <h1 className="mt-5 font-serif leading-[0.95] text-5xl sm:text-6xl md:text-7xl reveal-up">
        {title}
        <span className="text-editorial">.</span>
      </h1>
      {intro && (
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-media/70 reveal-up">{intro}</p>
      )}
      {children && <div className="mt-8 reveal-up">{children}</div>}
    </div>
  </section>
);

interface EditorialSectionProps {
  index?: string;
  kicker?: string;
  title?: string;
  alt?: boolean;
  children: ReactNode;
}

export const EditorialSection = ({ index, kicker, title, alt, children }: EditorialSectionProps) => (
  <section className={alt ? 'bg-paper-alt' : 'bg-paper'}>
    <div className="container-blog py-14 md:py-20">
      {(kicker || title) && (
        <>
          <div className="editorial-rule mb-6" />
          <div className="mb-8 flex items-baseline gap-4">
            {index && <span className="kicker text-editorial">{index}</span>}
            <div>
              {kicker && <p className="kicker text-ink/50">{kicker}</p>}
              {title && (
                <h2 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">
                  {title}
                </h2>
              )}
            </div>
          </div>
        </>
      )}
      {children}
    </div>
  </section>
);
