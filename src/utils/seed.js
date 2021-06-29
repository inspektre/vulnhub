/*
Author: Uday Korlimarla
Copyright (c) inspektre.io Pty Ltd
*/
import { runCveMutations } from './transforms';

// CVE Mutations
const iterCves = async () => {
    let currentYear;
    const maxYear = new Date().getFullYear();
    for (currentYear = 2002; currentYear <= maxYear; currentYear++) {
        const complete = await runCveMutations(currentYear);
    }
};

iterCves();