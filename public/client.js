/*
    Creators: Sebastian Jaculbe, Kaleb Richardson, Edward Rodriguez
    Created: March 24th, 2026
    Updated: March 28th, 2026
    Version 1.0
*/
const API_URL = "https://hirc-server-a3deh6hud4fnfjdh.canadacentral-01.azurewebsites.net/api"

// Populate dropdowns
const systolic = document.getElementById("systolic");
const diastolic = document.getElementById("diastolic");
const weight = document.getElementById("weight");
const feet = document.getElementById("feet");
const inches = document.getElementById("inches");
const age = document.getElementById("age");
const disease = document.getElementById("disease");

// Ranges for Systolic
for (let i=90; i<=200; i++){
  let option = document.createElement("option"); // New dynamic element
  option.value = i; //Default element value to 90
  option.text = i; //Default element text value to 90
  systolic.appendChild(option)
}

// Ranges for Diastolic
for (let i=60; i<=140; i++){
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  diastolic.appendChild(option);
}
// Ranges for Height (Feet)
for (let i=3; i<=7; i++){
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  feet.appendChild(option);
}

// Ranges for Weight (Pounds)
for (let i=80; i<=400; i++){
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  weight.appendChild(option);
}

// Ranges for Height (Inches)
for (let i=0; i<=11; i++){
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  inches.appendChild(option);
}

// Ranges for Age 
for (let i=0; i<=100; i++){
  let option = document.createElement("option");
  option.value = i;
  option.text = i;
  age.appendChild(option);
}

// Calling APIs 
function getData(){
  fetch(`${API_URL.replace('/api', '')}/ping`);
}

async function sendBPCat(){
  const response = await fetch(`${API_URL}/bp-category`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      systolic: parseInt(systolic.value),
      diastolic: parseInt(diastolic.value)
    })
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  console.log("BP Category: ", data.category);
  return data.category;
}

async function sendBMICat(){
  const response = await fetch(`${API_URL}/bmi`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      heightFeet: parseInt(feet.value),
      heightInches: parseInt(inches.value),
      weightPounds: parseInt(weight.value)
    })
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  console.log("BMI Category:", data.category);
  return data.category;
}

async function sendRiskCat(){
  try {
    const bp = await sendBPCat();
    const bmiData = await sendBMICat();

    const selectedDiseases = document.querySelectorAll(`input[name="disease"]:checked`);
    let familyHistory = [];
      selectedDiseases.forEach(d => {
        familyHistory.push(d.value);
      });

    const response = await fetch(`${API_URL}/risk-category`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        age: parseInt(age.value),
        bmiCategory: bmiData,
        bpCategory: bp,
        familyHistory: familyHistory
      })
    });

    const data = await response.json();
    document.getElementById("result").innerHTML = `Score: ${data.score} - Risk: ${data.risk}`;

  } catch (error) {
    console.error(error);
    document.getElementById("result").innerHTML = "Something went wrong";
  }
}
