/*
Author: Uday Korlimarla
Copyright (c) Inspektre Pty Ltd
*/
import { runCveMutations } from './transforms';

// CVE Mutations
console.log("Initializgin CVE Seed Mutations");

const iterCves = async () => {
    // const complete = await runCveMutations(year);
    // console.log("Completed ", year);
    let currentYear;
    const maxYear = new Date().getFullYear();
    for (currentYear = 2002; currentYear <= maxYear; currentYear++) {
        const complete = await runCveMutations(currentYear);
        // console.log(complete);
    }
};

iterCves();