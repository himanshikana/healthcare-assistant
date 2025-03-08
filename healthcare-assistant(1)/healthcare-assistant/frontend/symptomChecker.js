// Levenshtein Distance Algorithm for fuzzy matching
const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

// Symptom Database
const symptomsDB = {
    "head": ["headache", "dizziness", "blurred vision"],
    "chest": ["cough", "shortness of breath", "chest pain"],
    "stomach": ["nausea", "vomiting", "stomach pain"],
    "skin": ["rash", "itching", "redness"],
    "joints": ["joint pain", "swelling", "stiffness"]
};

// Disease Mapping
const diseaseMap = {
    "fever": ["Flu", "COVID-19", "Dengue"],
    "cough": ["Common Cold", "Bronchitis", "Asthma"],
    "headache": ["Migraine", "Tension Headache", "Sinusitis"],
    "shortness of breath": ["Asthma", "Pneumonia", "Heart Disease"],
    "stomach pain": ["Food Poisoning", "Ulcer", "Gastritis"],
    "rash": ["Allergy", "Eczema", "Measles"],
    "joint pain": ["Arthritis", "Gout", "Lupus"]
};

// Function to find the closest symptom using fuzzy matching
function getClosestSymptom(input, bodyPart) {
    let possibleSymptoms = symptomsDB[bodyPart] || [];
    let bestMatch = null;
    let minDistance = 3;

    possibleSymptoms.forEach(symptom => {
        let distance = levenshtein(input.toLowerCase(), symptom.toLowerCase());
        if (distance < minDistance) {
            bestMatch = symptom;
            minDistance = distance;
        }
    });

    return bestMatch;
}

// Function to check symptoms and suggest diseases
function checkSymptoms() {
    let bodyPart = document.getElementById("bodyPart").value;
    let inputSymptoms = document.getElementById("symptomInput").value.toLowerCase().split(",");
    
    let matchedSymptoms = [];
    let possibleConditions = new Set();

    inputSymptoms.forEach(symptom => {
        let trimmedSymptom = symptom.trim();
        let correctedSymptom = getClosestSymptom(trimmedSymptom, bodyPart);
        if (correctedSymptom) {
            matchedSymptoms.push(correctedSymptom);
            if (diseaseMap[correctedSymptom]) {
                diseaseMap[correctedSymptom].forEach(disease => possibleConditions.add(disease));
            }
        }
    });

    let resultDiv = document.getElementById("result");
    if (matchedSymptoms.length > 0) {
        resultDiv.innerHTML = `<strong>Matched Symptoms:</strong> ${matchedSymptoms.join(", ")}<br><br>`;
        resultDiv.innerHTML += `<strong>Possible Conditions:</strong> ${[...possibleConditions].join(", ")}`;
    } else {
        resultDiv.innerHTML = `<span style="color: red;">No matching symptoms found. Please check and try again.</span>`;
    }
}
