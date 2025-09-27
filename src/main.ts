import "./style.css";

const dictionaryAPI: string = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

//Declare the types that we need to get from API
interface Definition {
    definition: string;
    example: string;
    synonyms?: string[]; //it means it will be an array of string if synonyms exist
    antonyms?: string[];
}

type Meaning = {
    partOfSpeech: string;
    definitions: Definition[]; //an array of the Definition type that we already declared above
}

type Phonetic = {
    text?: string;
    audio?: string;
}

type DictionaryAPIResponse = {
    word: string,
    phonetic: string;
    phonetics: Phonetic[];
    origin?: string;
    meanings: Meaning[];
}

// Fetch data from the API
const searchWord = async (word: string): Promise< DictionaryAPIResponse[] | undefined > => {
    try {
        const response = await fetch(`${dictionaryAPI}${word}`);

        //Good practice:
        if (! response.ok) {
            throw new Error(`Invalid response from API server: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

// Extract word definitions from the data
const extractWordDefinitions = (data) => {
    if (data && Array.isArray(data)) {
        if (data[0].meanings && Array.isArray(data[0].meanings)) {
            return data[0].meanings;
        }
    }
};

// Extract word phonetics from the data
const extractWordPhonetics = (data) => {
    if (data && Array.isArray(data)) {
        if (data[0].phonetics && Array.isArray(data[0].phonetics)) {
            return data[0].phonetics;
        }
    }
};

// Helper to clear the definitions section
const clearDefinitionsSection = () => {
    const definitionsSection = document.getElementById("definitions");
    definitionsSection.innerHTML = "";
    return definitionsSection;
};

// Helper to create the definitions heading
const createDefinitionsHeading = () => {
    const definitionsHeading = document.createElement("h1");
    definitionsHeading.classList.add("text-2xl", "font-semibold");
    definitionsHeading.innerText = "Definitions";
    return definitionsHeading;
};

// Helper to create the definition div
const createDefinitionDiv = () => {
    const definitionDiv = document.createElement("div");
    definitionDiv.classList.add("bg-sky-50");
    return definitionDiv;
};

// Helper to create the part of speech element
const createPartOfSpeechElement = (partOfSpeech) => {
    const partOfSpeechName = document.createElement("p");
    partOfSpeechName.classList.add(
        "px-4",
        "py-2",
        "font-semibold",
        "text-white",
        "bg-sky-600",
    );
    partOfSpeechName.innerText = partOfSpeech;
    return partOfSpeechName;
};

// Helper to create the definitions list
const createDefinitionsList = () => {
    const definitionsList = document.createElement("ul");
    definitionsList.classList.add(
        "p-2",
        "ml-6",
        "font-light",
        "list-disc",
        "text-sky-700",
    );
    return definitionsList;
};

// Helper to create the definition item
const createDefinitionItem = (definitionObj) => {
    const definitionsItem = document.createElement("li");
    definitionsItem.innerText = definitionObj.definition;
    return definitionsItem;
};

// Display the word definitions
const displayWordDefinition = (meanings) => {
    const definitionsSection = clearDefinitionsSection();

    const definitionsHeading = createDefinitionsHeading();
    definitionsSection.appendChild(definitionsHeading);

    meanings.forEach((meaning) => {
        const definitionDiv = createDefinitionDiv();
        definitionsSection.appendChild(definitionDiv);

        const { partOfSpeech, definitions } = meaning;

        const partOfSpeechName = createPartOfSpeechElement(partOfSpeech);
        definitionDiv.appendChild(partOfSpeechName);

        const definitionsList = createDefinitionsList();
        definitionDiv.appendChild(definitionsList);

        const definitionListItems = definitions.map(createDefinitionItem);
        definitionsList.append(...definitionListItems);
    });
};

// Helper to clear the phonetics section
const createPhoneticsSection = () => {
    const phoneticsSection = document.getElementById("phonetics");
    phoneticsSection.innerHTML = "";
    phoneticsSection.classList.add("flex", "flex-col", "gap-4");
    return phoneticsSection;
};

// Helper to create the phonetics heading
const createPhoneticsHeading = () => {
    const phoneticsHeading = document.createElement("h1");
    phoneticsHeading.classList.add("text-2xl", "font-semibold");
    phoneticsHeading.innerText = "Phonetics";
    return phoneticsHeading;
};

// Helper to create the phonetics div
const createPhoneticsDiv = () => {
    const phoneticsDiv = document.createElement("div");
    phoneticsDiv.classList.add("bg-stone-100");
    return phoneticsDiv;
};

// Helper to create the phonetic element
const createPhoneticElement = (text) => {
    const phoneticText = document.createElement("p");
    phoneticText.classList.add("px-4", "py-3", "text-white", "bg-stone-700");
    phoneticText.innerText = text;
    return phoneticText;
};

// Helper to create the audio control
const createAudioControl = () => {
    const audioControl = document.createElement("audio");
    audioControl.style = "width: 100%";
    audioControl.setAttribute("controls", "true");
    return audioControl;
};

// Helper to create the audio source
const createAudioSource = (audio) => {
    const source = document.createElement("source");
    source.setAttribute("src", audio);
    source.setAttribute("type", "audio/mpeg");
    return source;
};

// Helper to create the fallback text
const fallbackText = document.createTextNode(
    "Your browser does not support the audio element.",
);

// Display the word phonetics
const displayWordPhonetic = (phonetics) => {
    const phoneticsSection = createPhoneticsSection();

    const phoneticsHeading = createPhoneticsHeading();
    phoneticsSection.appendChild(phoneticsHeading);

    phonetics.forEach((phonetic) => {
        const { text, audio } = phonetic;

        if (!text || !audio) return;

        const phoneticsDiv = createPhoneticsDiv();
        phoneticsSection.appendChild(phoneticsDiv);

        const phoneticText = createPhoneticElement(text);
        phoneticsDiv.appendChild(phoneticText);

        const audioControl = createAudioControl();
        phoneticsDiv.appendChild(audioControl);

        const source = createAudioSource(audio);
        audioControl.appendChild(source);

        const fallBackText = fallbackText;
        audioControl.appendChild(fallBackText);
    });
};

// Get the input word and search for its definition
const inputWord = document.getElementById("input");
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (event) => {
    const word = inputWord.value.trim();
    if (!word) return;

    searchWord(word)
        .then((data) => {
            console.log(data);
            const meanings = extractWordDefinitions(data);
            displayWordDefinition(meanings);

            const phonetics = extractWordPhonetics(data);
            displayWordPhonetic(phonetics);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
});
