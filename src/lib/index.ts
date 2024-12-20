// place files you want to import through the `$lib` alias in this folder.

export const c2f = (tempc: number): number => {
    return Math.round((9.0 / 5.0 * tempc + 32) * 100) / 100;
};