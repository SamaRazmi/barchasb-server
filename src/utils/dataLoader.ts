import TestCategory from '../models/TestCategory';
import TestType from '../models/TestType';
import Question from '../models/Question';

import LanguageCatData from '../data/Tests/Language';

import EnglishData from '../data/Tests/English/English';

import EnglishA1Data from '../data/Tests/English/EnglishA1';
import EnglishA2Data from '../data/Tests/English/EnglishA2';
import EnglishB1Data from '../data/Tests/English/EnglishB1';
import EnglishB2Data from '../data/Tests/English/EnglishB2';
import EnglishC1Data from '../data/Tests/English/EnglishC1';
import EnglishC2Data from '../data/Tests/English/EnglishC2';

import ArabicData from '../data/Tests/Arabic/Arabic';

import ArabicA1Data from '../data/Tests/Arabic/ArabicA1';
import ArabicA2Data from '../data/Tests/Arabic/ArabicA2';
import ArabicB1Data from '../data/Tests/Arabic/ArabicB1';
import ArabicB2Data from '../data/Tests/Arabic/ArabicB2';
import ArabicC1Data from '../data/Tests/Arabic/ArabicC1';
import ArabicC2Data from '../data/Tests/Arabic/ArabicC2';

import SpanishData from '../data/Tests/Spanish/Spanish';

import SpanishA1Data from '../data/Tests/Spanish/SpanishA1';
import SpanishA2Data from '../data/Tests/Spanish/SpanishA2';
import SpanishB1Data from '../data/Tests/Spanish/SpanishB1';
import SpanishB2Data from '../data/Tests/Spanish/SpanishB2';
import SpanishC1Data from '../data/Tests/Spanish/SpanishC1';
import SpanishC2Data from '../data/Tests/Spanish/SpanishC2';

import GermanData from '../data/Tests/German/German';

import GermanA1Data from '../data/Tests/German/GermanA1';
import GermanA2Data from '../data/Tests/German/GermanA2';
import GermanB1Data from '../data/Tests/German/GermanB1';
import GermanB2Data from '../data/Tests/German/GermanB2';
import GermanC1Data from '../data/Tests/German/GermanC1';
import GermanC2Data from '../data/Tests/German/GermanC2';

import FrenchData from '../data/Tests/French/French';

import FrenchA1Data from '../data/Tests/French/FrenchA1';
import FrenchA2Data from '../data/Tests/French/FrenchA2';
import FrenchB1Data from '../data/Tests/French/FrenchB1';
import FrenchB2Data from '../data/Tests/French/FrenchB2';
import FrenchC1Data from '../data/Tests/French/FrenchC1';
import FrenchC2Data from '../data/Tests/French/FrenchC2';

import PsychologicCatData from '../data/Tests/psychologic';

import BARONData from '../data/Tests/BAR-ON/BARON';
import BARONQuestions from '../data/Tests/BAR-ON/questions';

import GardnerMIData from '../data/Tests/GardnerMI/GardnerMI';
import GardnerMIQuestions from '../data/Tests/GardnerMI/questions';

import NEOData from '../data/Tests/NEO/NEOType';
import NEOQuestions from '../data/Tests/NEO/questions';

import MBTIData from '../data/Tests/MBTI/MBTIType';
import MBTIQuestions from '../data/Tests/MBTI/questions';

import HollandData from '../data/Tests/Holland/HollandType';
import HollandQuestions from '../data/Tests/Holland/questions';

import TechnicalCatData from '../data/Tests/Technical';

import AdobePsData from '../data/Tests/AdobePhotoshop/photoshop';
import AdobePsQuestions from '../data/Tests/AdobePhotoshop/questions';

import AdobeAiData from '../data/Tests/AdobeAi/adobeAi';
import AdobeAiQuestions from '../data/Tests/AdobeAi/questions';

import AdobePrData from '../data/Tests/AdobePr/adobePr';
import AdobePrQuestions from '../data/Tests/AdobePr/questions';

import FastAPIData from '../data/Tests/FastAPI/fastapi';
import FastAPIQuestions from '../data/Tests/FastAPI/questions';

import FigmaData from '../data/Tests/Figma/figma';
import FigmaQuestions from '../data/Tests/Figma/questions';

import LaravelData from '../data/Tests/Laravel/laravel';
import LaravelQuestions from '../data/Tests/Laravel/questions';

import NestjsData from '../data/Tests/NestJS/nest';
import NestjsQuestions from '../data/Tests/NestJS/questions';

import NextjsData from '../data/Tests/NextJS/next';
import NextjsQuestions from '../data/Tests/NextJS/questions';

import PythonData from '../data/Tests/Python/python';
import PythonQuestions from '../data/Tests/Python/questions';

import SQLData from '../data/Tests/SQL/sql';
import SQLQuestions from '../data/Tests/SQL/questions';

const loadData = async () => {
  try {
    console.log("Starting data synchronization...");

    const langCategory = await LanguageCatData();
    const languages = [
      { main: EnglishData, levels: [EnglishA1Data, EnglishA2Data, EnglishB1Data, EnglishB2Data, EnglishC1Data, EnglishC2Data] },
      { main: ArabicData,  levels: [ArabicA1Data, ArabicA2Data, ArabicB1Data, ArabicB2Data, ArabicC1Data, ArabicC2Data] },
      { main: SpanishData, levels: [SpanishA1Data, SpanishA2Data, SpanishB1Data, SpanishB2Data, SpanishC1Data, SpanishC2Data] },
      { main: GermanData,  levels: [GermanA1Data, GermanA2Data, GermanB1Data, GermanB2Data, GermanC1Data, GermanC2Data] },
      { main: FrenchData,  levels: [FrenchA1Data, FrenchA2Data, FrenchB1Data, FrenchB2Data, FrenchC1Data, FrenchC2Data] },
    ];

    for (const lang of languages) {
      const langType = await lang.main(langCategory.id);
      await Promise.all(lang.levels.map(levelFn => levelFn(langType.id)));
      console.log(`Synced Language: ${langType.name}`);
    }
    console.log("Syncing Psychology tests...");
    const psychCategory = await PsychologicCatData(); 

    const psychTests = [
      { typeFn: BARONData, questFn: BARONQuestions, name: "Bar-On" },
      { typeFn: GardnerMIData, questFn: GardnerMIQuestions, name: "Gardner MI" },
      { typeFn: NEOData, questFn: NEOQuestions, name: "NEO" },
      { typeFn: MBTIData, questFn: MBTIQuestions, name: "MBTI" },
      { typeFn: HollandData, questFn: HollandQuestions, name: "Holland Career" },
    ];

    for (const test of psychTests) {
      const createdType = await test.typeFn(psychCategory.id);
      if (test.questFn) {
        await test.questFn(createdType.id);
      }
      console.log(`Synced Psychology Test: ${test.name}`);
    }

    console.log("Syncing Technical tests...");
    const techCategory = await TechnicalCatData(); 

    const techTests = [
      { typeFn: AdobePsData, questFn: AdobePsQuestions, name: "Adobe Photoshop" },
      { typeFn: AdobeAiData, questFn: AdobeAiQuestions, name: "Adobe Illustrator" },
      { typeFn: AdobePrData, questFn: AdobePrQuestions, name: "Adobe Premiere" },
      { typeFn: FastAPIData, questFn: FastAPIQuestions, name: "FastAPI" },
      { typeFn: FigmaData,   questFn: FigmaQuestions, name: "Figma" },
      { typeFn: LaravelData, questFn: LaravelQuestions, name: "Laravel" },
      { typeFn: NestjsData, questFn: NestjsQuestions, name: "NestJS" },
      { typeFn: NextjsData, questFn: NextjsQuestions, name: "NextJS" },
      { typeFn: PythonData, questFn: PythonQuestions, name: "Python" },
      { typeFn: SQLData, questFn: SQLQuestions, name: "SQL" },
    ];

    for (const test of techTests) {
      const createdType = await test.typeFn(techCategory.id);
      if (test.questFn) {
        await test.questFn(createdType.id);
      }
      console.log(`Synced Technical Test: ${test.name}`);
    }
    console.log("All data synchronized successfully (No deletion required).");
  } catch (error) {
    console.error("Error during data loading:", error);
  }
};

export default loadData;