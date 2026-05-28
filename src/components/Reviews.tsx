import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviews, type Review } from '@/lib/reviews';
import { fadeUp, staggerParent, viewportOnce } from '@/lib/motion';

export function Reviews() {
  return (
    <section id="reviews" className="bg-sand-soft py-24 sm:py-32">
      <div className="container-x">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          <motion.span variants={fadeUp} className="eyebrow">
            05 — Reviews
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-medium leading-[1.02]"
          >
            Wat klanten <span className="italic text-sand">zeggen</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6"
        >
          {reviews.map((review) => (
            <motion.div key={review.name} variants={fadeUp}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/8 bg-bone p-7 transition-shadow duration-500 hover:shadow-[0_20px_60px_-25px_rgba(10,10,10,0.18)]">
      <div className="flex items-center gap-1" aria-label={`${review.rating} van 5 sterren`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            strokeWidth={1.5}
            className={
              i < review.rating ? 'fill-sand text-sand' : 'fill-transparent text-ink/15'
            }
          />
        ))}
      </div>

      <blockquote className="mt-5 font-display text-lg italic leading-snug text-ink/85">
        “{review.quote}”
      </blockquote>

      <div className="mt-auto pt-6">
        <div className="h-px w-full bg-ink/8" />
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{review.name}</p>
            <p className="text-xs text-ash">{review.city}</p>
          </div>
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest2 text-sand">
              <CheckIcon /> Verified
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
