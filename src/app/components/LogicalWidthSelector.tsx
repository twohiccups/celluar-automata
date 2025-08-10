import { useCelluarContext } from "../contexts/CelluarContext";
import { tooltips } from "../tooltips";
import SectionTitle from "./SectionTitle";

export default function LogicalWidthSelector() {
    const { logicalWidth, setLogicalWidth, initializeState } = useCelluarContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setLogicalWidth(newWidth);
        initializeState(); // Reset canvas to fill space
    };

    return (
        <section className="space-y-2">
            <SectionTitle title={'Logical Width'} tooltip={tooltips.logicalWidth} />
            <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={logicalWidth}
                onChange={handleChange}
                className="w-full"
            />
            <div className="text-sm text-gray-600">
                {logicalWidth} px wide — approx. {Math.floor(logicalWidth / 4)} cells
            </div>
        </section>
    );
}