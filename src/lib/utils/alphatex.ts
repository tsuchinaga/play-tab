import {instrumentGroups} from '$lib/instruments';

export interface TrackData {
    name: string;
    instrument: string;
    tuning: string;
    tex: string;
    isVisible?: boolean;
}

export interface TabData {
    name: string;
    bpm: number;
    username: string;
    tracks: TrackData[];
}

/**
 * 楽器に応じた音部記号（\clef）を取得する
 */
export function getClef(instrument: string): string {
    if (instrumentGroups.find(g => g.label === 'Guitar')?.options.includes(instrument)) {
        return '\\clef Treble';
    } else if (instrumentGroups.find(g => g.label === 'Bass')?.options.includes(instrument)) {
        return '\\clef Bass';
    }
    return '';
}

/**
 * トラック情報をalphaTex形式の文字列に変換する
 */
export function generateTrackTex(track: TrackData): string {
    const clef = getClef(track.instrument);
    return `\\track "${track.name}"
${clef ? clef + '\n' : ''}\\instrument "${track.instrument}"
\\tuning (${track.tuning}) {hide}
${track.tex}`;
}

/**
 * 全体のalphaTex文字列を生成する
 */
export function generateFullTex(tab: TabData): string {
    const header = `\\title "${tab.name}"
\\artist "${tab.username}"
\\tempo ${tab.bpm}`;

    const tracksTex = tab.tracks
        .filter(track => track.tex.trim() !== '')
        .map(track => generateTrackTex(track))
        .join('\n\n');

    return `${header}

${tracksTex}`;
}
