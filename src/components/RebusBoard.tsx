import { Fragment } from 'react';
import { getRebusPicture, type RebusPuzzle } from '../utils/rebusPuzzles';

export function RebusBoard({ puzzle }: { puzzle: RebusPuzzle }) {
  const hasRemoval = puzzle.parts.some(part => 'picture' in part && part.remove);
  const hasReverse = puzzle.parts.some(part => 'picture' in part && part.reverse);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1430] px-3 py-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:gap-x-4" role="group" aria-label="Resfebe ipuçları">
        {puzzle.parts.map((part, index) => (
          <Fragment key={index}>
            {index > 0 && <span className="text-xl font-bold text-violet-300" aria-label="birleştir">+</span>}
            <div className="flex min-h-20 items-center justify-center gap-1.5 rounded-xl border border-violet-200/20 bg-[#20284b] px-3 text-2xl font-black sm:min-h-24 sm:px-5 sm:text-3xl">
              {'text' in part ? part.text : (
                <>
                  {part.reverse && <span className="text-teal-200" role="img" aria-label="tersten oku">←</span>}
                  <span className="text-4xl leading-none sm:text-5xl" role="img" aria-label={getRebusPicture(part).label}>{getRebusPicture(part).symbol}</span>
                  {part.remove && <span className="rounded-md bg-rose-300/15 px-1.5 py-1 text-base text-rose-200" aria-label={part.remove + ' harflerini çıkar'}>−{part.remove}</span>}
                </>
              )}
            </div>
          </Fragment>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-300">
        Görsellerin adını düşün ve parçaları birleştir.
        {hasRemoval && ' − işaretinden sonraki harfleri çıkar.'}
        {hasReverse && ' ← işaretli görselin adını tersten oku.'}
      </p>
    </div>
  );
}
