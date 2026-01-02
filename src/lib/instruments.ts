export const instrumentGroups = [
    {
        label: 'Guitar',
        options: [
            "Electric Guitar Clean",
            "Electric Guitar Jazz",
            "Overdriven Guitar",
            "Distortion Guitar",
            "Acoustic Guitar Nylon",
            "Acoustic Guitar Steel"
        ]
    },
    {
        label: 'Bass',
        options: [
            "Electric Bass Finger",
            "Electric Bass Pick",
            "Slap Bass 1",
            "Slap Bass 2",
            "Acoustic Bass"
        ]
    }
];

export function getCoarseInstruments(instruments: string[]): string[] {
    const coarseInstruments = new Set<string>();
    for (const inst of instruments) {
        for (const group of instrumentGroups) {
            if (group.options.includes(inst)) {
                coarseInstruments.add(group.label);
            }
        }
    }
    return Array.from(coarseInstruments);
}
