const TestCategory = require('../models/TestCategory');
const TestType = require('../models/TestType');
const Question = require('../models/Question');

const LanguageCatData = require('../data/Tests/Language');

const EnglishData = require('../data/Tests/English/English');

const EnglishA1Data = require('../data/Tests/English/EnglishA1');
const EnglishA2Data = require('../data/Tests/English/EnglishA2');
const EnglishB1Data = require('../data/Tests/English/EnglishB1');
const EnglishB2Data = require('../data/Tests/English/EnglishB2');
const EnglishC1Data = require('../data/Tests/English/EnglishC1');
const EnglishC2Data = require('../data/Tests/English/EnglishC2');

const ArabicData = require('../data/Tests/Arabic/Arabic');

const ArabicA1Data = require('../data/Tests/Arabic/ArabicA1');
const ArabicA2Data = require('../data/Tests/Arabic/ArabicA2');
const ArabicB1Data = require('../data/Tests/Arabic/ArabicB1');
const ArabicB2Data = require('../data/Tests/Arabic/ArabicB2');
const ArabicC1Data = require('../data/Tests/Arabic/ArabicC1');
const ArabicC2Data = require('../data/Tests/Arabic/ArabicC2');

const SpanishData = require('../data/Tests/Spanish/Spanish');

const SpanishA1Data = require('../data/Tests/Spanish/SpanishA1');
const SpanishA2Data = require('../data/Tests/Spanish/SpanishA2');
const SpanishB1Data = require('../data/Tests/Spanish/SpanishB1');
const SpanishB2Data = require('../data/Tests/Spanish/SpanishB2');
const SpanishC1Data = require('../data/Tests/Spanish/SpanishC1');
const SpanishC2Data = require('../data/Tests/Spanish/SpanishC2');

const GermanData = require('../data/Tests/German/German');

const GermanA1Data = require('../data/Tests/German/GermanA1');
const GermanA2Data = require('../data/Tests/German/GermanA2');
const GermanB1Data = require('../data/Tests/German/GermanB1');
const GermanB2Data = require('../data/Tests/German/GermanB2');
const GermanC1Data = require('../data/Tests/German/GermanC1');
const GermanC2Data = require('../data/Tests/German/GermanC2');

const FrenchData = require('../data/Tests/French/French');

const FrenchA1Data = require('../data/Tests/French/FrenchA1');
const FrenchA2Data = require('../data/Tests/French/FrenchA2');
const FrenchB1Data = require('../data/Tests/French/FrenchB1');
const FrenchB2Data = require('../data/Tests/French/FrenchB2');
const FrenchC1Data = require('../data/Tests/French/FrenchC1');
const FrenchC2Data = require('../data/Tests/French/FrenchC2');

const PsychologicCatData = require('../data/Tests/psychologic');

const BARONData = require('../data/Tests/BAR-ON/BARON');
const BARONQuestions = require('../data/Tests/BAR-ON/questions');

const GardnerMIData = require('../data/Tests/GardnerMI/GardnerMI');
const GardnerMIQuestions = require('../data/Tests/GardnerMI/questions');

const NEOData = require('../data/Tests/NEO/NEOType');
const NEOQuestions = require('../data/Tests/NEO/questions');

const MBTIData = require('../data/Tests/MBTI/MBTIType');
const MBTIQuestions = require('../data/Tests/MBTI/questions');

const HollandData = require('../data/Tests/Holland/HollandType');
const HollandQuestions = require('../data/Tests/Holland/questions');

const TechnicalCatData = require('../data/Tests/Technical');

const AdobePsData = require('../data/Tests/AdobePhotoshop/photoshop');
const AdobePsQuestions = require('../data/Tests/AdobePhotoshop/questions');

const AdobeAiData = require('../data/Tests/AdobeAi/adobeAi');
const AdobeAiQuestions = require('../data/Tests/AdobeAi/questions');

const AdobePrData = require('../data/Tests/AdobePr/adobePr');
const AdobePrQuestions = require('../data/Tests/AdobePr/questions');

const FastAPIData = require('../data/Tests/FastAPI/fastapi');
const FastAPIQuestions = require('../data/Tests/FastAPI/questions');

const FigmaData = require('../data/Tests/Figma/figma');
const FigmaQuestions = require('../data/Tests/Figma/questions');

const LaravelData = require('../data/Tests/Laravel/laravel');
const LaravelQuestions = require('../data/Tests/Laravel/questions');

const NestjsData = require('../data/Tests/NestJS/nest');
const NestjsQuestions = require('../data/Tests/NestJS/questions');

const NextjsData = require('../data/Tests/NextJS/next');
const NextjsQuestions = require('../data/Tests/NextJS/questions');

const PythonData = require('../data/Tests/Python/python');
const PythonQuestions = require('../data/Tests/Python/questions');

const SQLData = require('../data/Tests/SQL/sql');
const SQLQuestions = require('../data/Tests/SQL/questions');

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
      const langType = await lang.main(langCategory._id);
      await Promise.all(lang.levels.map(levelFn => levelFn(langType._id)));
      console.log(`ynced Language: ${langType.name}`);
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
      const createdType = await test.typeFn(psychCategory._id);
      if (test.questFn) {
        await test.questFn(createdType._id);
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
      const createdType = await test.typeFn(techCategory._id);
      if (test.questFn) {
        await test.questFn(createdType._id);
      }
      console.log(`Synced Technical Test: ${test.name}`);
    }
    console.log("All data synchronized successfully (No deletion required).");
  } catch (error) {
    console.error("Error during data loading:", error);
  }
};

module.exports = loadData;