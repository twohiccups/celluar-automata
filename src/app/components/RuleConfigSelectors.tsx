import { useRulesContext } from "../contexts/RulesContext";
import { tooltips } from "../tooltips";
import SectionTitle from "./SectionTitle";

export default function RuleConfigSelectors() {


    const {
        numStates,
        setNumStatesAndReset,
        ruleLength,
        setRuleLengthAndReset,
    } = useRulesContext();

    const ruleLengths = [2, 3, 4, 5];
    const numStatesOptions = [2, 3, 4, 5, 6];

    return (
        <>
            <section className="mt-6">
                <SectionTitle title={'Rule Length'} tooltip={tooltips.ruleLength} />
                <div className="flex flex-wrap gap-2">
                    {ruleLengths.map((len) => (
                        <button
                            key={len}
                            onClick={() => setRuleLengthAndReset(len)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${ruleLength === len
                                ? 'bg-blue-600 text-white font-bold border-black'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            {len}
                        </button>
                    ))}
                </div>
            </section >

            <section className="mt-6">
                <SectionTitle title={'Number of States'} tooltip={tooltips.numStates} />
                <div className="flex flex-wrap gap-2">
                    {numStatesOptions.map((n) => (
                        <button
                            key={n}
                            onClick={() => setNumStatesAndReset(n)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${numStates === n
                                ? 'bg-blue-600 text-white font-bold border-black'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </section>
        </>
    );
}
