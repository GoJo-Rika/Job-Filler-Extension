// 1. YOUR HARDCODED DATA
const MY_PROFILE = {
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  linkedin: "https://www.linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  portfolio: "https://johndoe.com",
  city: "Bengaluru",
  currentCompany: "Tech Corp",
  yearsOfExperience: "4",
  currentCTC: "1500000",
  expectedCTC: "2200000",
  noticePeriod: "30"
};

// 2. REACT/ANGULAR BYPASS FUNCTION
function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getPrototypeOf(prototype)?.constructor 
    ? Object.getOwnPropertyDescriptor(prototype, 'value')?.set 
    : null;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

// 3. HELPER TO FIND ASSOCIATED LABEL TEXT
function getFieldContext(element) {
  let text = "";
  
  // Check standard attributes
  text += " " + (element.name || "") + " " + (element.id || "") + " " + (element.placeholder || "") + " " + (element.getAttribute('aria-label') || "");

  // Check explicit <label for="id">
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
    if (label) text += " " + label.innerText;
  }

  // Check if wrapped inside a <label>
  const parentLabel = element.closest('label');
  if (parentLabel) text += " " + parentLabel.innerText;

  // LinkedIn / Workday specific: check the parent container's text
  const container = element.closest('div.fb-dash-form-element, div[data-automation-id], .form-group, .field');
  if (container) text += " " + container.innerText;

  return text.toLowerCase();
}

// 4. MAIN AUTOFILL LOGIC
function autoFill() {
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="file"]), textarea');

  inputs.forEach(input => {
    // Skip already filled fields (optional - remove if you want to overwrite)
    if (input.value && input.value.trim() !== "") return;

    const context = getFieldContext(input);

    // Matching Rules (Order matters: put specific rules before generic ones)
    if (context.includes("first name") || context.includes("firstname") || context.includes("fname")) {
      setNativeValue(input, MY_PROFILE.firstName);
    } 
    else if (context.includes("last name") || context.includes("lastname") || context.includes("lname") || context.includes("surname")) {
      setNativeValue(input, MY_PROFILE.lastName);
    } 
    else if (context.includes("full name") || context.includes("your name") || (context.includes("name") && !context.includes("company") && !context.includes("user"))) {
      setNativeValue(input, MY_PROFILE.fullName);
    } 
    else if (context.includes("email") || input.type === "email") {
      setNativeValue(input, MY_PROFILE.email);
    } 
    else if (context.includes("phone") || context.includes("mobile") || context.includes("contact") || input.type === "tel") {
      setNativeValue(input, MY_PROFILE.phone);
    } 
    else if (context.includes("linkedin")) {
      setNativeValue(input, MY_PROFILE.linkedin);
    } 
    else if (context.includes("github")) {
      setNativeValue(input, MY_PROFILE.github);
    } 
    else if (context.includes("portfolio") || context.includes("website")) {
      setNativeValue(input, MY_PROFILE.portfolio);
    } 
    else if (context.includes("city") || context.includes("location")) {
      setNativeValue(input, MY_PROFILE.city);
    } 
    else if (context.includes("current company") || context.includes("current organization") || context.includes("employer")) {
      setNativeValue(input, MY_PROFILE.currentCompany);
    }
    else if (context.includes("experience") || context.includes("years")) {
      setNativeValue(input, MY_PROFILE.yearsOfExperience);
    }
    else if (context.includes("current ctc") || context.includes("current salary")) {
      setNativeValue(input, MY_PROFILE.currentCTC);
    }
    else if (context.includes("expected ctc") || context.includes("expected salary")) {
      setNativeValue(input, MY_PROFILE.expectedCTC);
    }
    else if (context.includes("notice period") || context.includes("notice")) {
      setNativeValue(input, MY_PROFILE.noticePeriod);
    }
  });
}

autoFill();