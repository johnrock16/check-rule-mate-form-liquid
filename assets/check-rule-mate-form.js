document.addEventListener('DOMContentLoaded', function() {
  const formElements = document.querySelectorAll('.check-rule-mate-form');
  formElements.forEach((formElement) => {
    const formInputs = formElement.querySelectorAll('input, textarea, select');
    const FORM_RULES = JSON.parse(formElement.dataset.rulesForm);
    const RULES = JSON.parse(formElement.dataset.rulesCrmf);
    const ERRORS_MESSAGES = JSON.parse(formElement.dataset.errorsMessages);
    const BREAKPOINT_MD = formElement.dataset.breakpointMd;
    const BREAKPOINT_LG = formElement.dataset.breakpointLg;
    const breakpoints = {md: BREAKPOINT_MD, lg: BREAKPOINT_LG};
    const mask = new Mask(RULES);
    const formManaager = new FormManager(formElement, FORM_RULES, RULES, myValidator, ERRORS_MESSAGES);
    formManaager.addAttributes();
    formInputs.forEach((formInput) => {
      formInput.addEventListener('change', formManaager.handleInputChange)
      if(RULES[formInput.dataset.rule]?.mask) {
        formInput.addEventListener('keyup', mask.handleKeyUp)
      }
    });
    formElement.addEventListener('reset', formManaager.handleFormReset);
    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formValidated = await formManaager.handleFormSubmit(e);
      console.log(formValidated);
      if (formValidated.error) {
        alert('form is invalid')
      } else if (formValidated.ok) {
        alert('form is valid')
      }
    });
    window.addEventListener('resize', () => { handleFieldsResize(formInputs, breakpoints) });
    handleFieldsResize(formInputs, breakpoints);
  });
});

function handleFieldsResize(formInputs, breakpoints) {
  formInputs.forEach((formInput) => {
    const { fieldWidth, fieldWidthMd, fieldWidthLg } = formInput.dataset;
    const inputWidthBreakpoints = {
      sm: fieldWidth,
      md: fieldWidthMd,
      lg: fieldWidthLg
    }
    let currentBreakpoint = 'sm';
    Object.keys(breakpoints).forEach((key) => {
      if (window.innerWidth > breakpoints[key]) {
        currentBreakpoint = key
      }
    });
    formInput.closest('.crmf-field').style.width = inputWidthBreakpoints[currentBreakpoint] !== '100%' ? `calc(${inputWidthBreakpoints[currentBreakpoint]} - 8px)` : inputWidthBreakpoints[currentBreakpoint];
  })
}

function Mask(RULES) {
  function generateTextWithMask(value, maskArray) {
    let textMasked = value;
    maskArray.forEach((mask) => {
      textMasked = textMasked.replace(new RegExp(mask[0]), mask[1]);
    });
    return textMasked;
  }

  function handleKeyUp(e) {
    setTimeout(()=> {
      e.target.value = generateTextWithMask(e.target.value, RULES[e.target.dataset.rule].mask);
    }, 400);
  }

  return ({
    handleKeyUp: handleKeyUp
  })
}

// check-rule-mate
function dataValidate(c,{validationHelpers:f={},rules:d,dataRule:o,dataErrorMessages:y={}}){let p={};function g(e,i){if(!e||typeof i!="string")return;let n=i.split("."),t=e;for(let a of n){if(t[a]===void 0)return;t=t[a]}return t}async function s(e,i=null){let{rule:n,required:t}=o[e.key];if((n&&t||!t&&e.value!="")&&n){let a=n.split("--")[0],r=n.split("--").length>1?n.split("--")[1]:"",h=k(e.value,d[a],r,f,i),{isValid:u,errorMessage:m,errorType:v}=await h.validate();return u||(p[e.key]={name:e.key,error:!0,errorMessage:g(y,m)||m,errorType:v}),u}return!0}async function l(){let e=Object.keys(c).map(i=>({key:i,value:c[i]}));if(e&&e.length>0){if(!Object.keys(o).every(r=>c.hasOwnProperty(r)))return{error:!0,errorMessage:"Missing properties"};if((await Promise.all([...e].map(async r=>await s(r,c)))).some(r=>!r))return{error:!0,dataErrors:p};let n=Object.keys(o).map(r=>({key:r,required:o[r].required})),t=e.map(r=>r.key);if(!n.filter(r=>r.required).map(r=>r.key).every(r=>t.includes(r)))return{error:!0}}else if(!e||e.length===0)return{error:!0,errorMessage:"Missing fields for dataRules"};return{ok:!0}}return l()}function k(c,f,d=null,o=null,y=null){async function p(s){let l,e;return{isValid:!(await Promise.all(s.validate.map(async t=>{let a=!0;if(s.params&&s.params[t]&&s.params[t].length>0){let r=s.params[t].map(u=>typeof u=="string"&&u[0]==="$"?u.substring(1,u.length):u);a=await this[t](...r)}else a=await this[t]();return!a&&!l&&s?.error[t]&&(l=s.error[t],e=t),a}))).some(t=>!t),errorMessage:l,errorType:e}}async function g(){if(o&&typeof o=="function"){let l=o(c,f,d,y);Object.keys(l).forEach(e=>{this[e]=l[e]})}return d?await p.call(this,f.modifier[d]):await p.call(this,f)}return{validate:g}}

//check-rule-mate-form
function FormManager(formElement, dataRule, rules, validationHelpers, dataErrorMessages) {
  const state = {
    onceError: false
  }

  async function handleInputChange(e) {
    if (!state.onceError || !dataRule[e.target.name]) return;
    const formData = getFormData(formElement);
    const formRule = mockInputDataRules(formData);
    const inputValidated = await dataValidate({...formData, [e.target.name]:e.target.value}, {validationHelpers, rules, dataRule: {...formRule, [e.target.name]: dataRule[e.target.name]}, dataErrorMessages});
    toogleErrorMessage(e.target, inputValidated?.dataErrors?.[e.target.name]);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    return new Promise(async (resolve, reject) => {
      const formData = getFormData(formElement);
      const formValidated = await dataValidate(formData, {validationHelpers, rules, dataRule: dataRule, dataErrorMessages});
      if (formValidated.error) {
        state.onceError = true;
        formElement.querySelectorAll('input').forEach((inputElement) => {
          toogleErrorMessage(inputElement, formValidated?.dataErrors?.[inputElement.name]);
        });
        resolve({...formValidated, formData});
      } else if (formValidated.ok) {
        resolve({...formValidated, formData});
      }
      reject({error: true});
    });
  }

  function handleFormReset() {
    formElement.querySelectorAll('input').forEach((inputElement) => {
      const fieldElement = inputElement.parentElement;
      const errorElement = fieldElement.querySelector('.check-rule-mate-error');

      inputElement.value = '';
      fieldElement.classList.remove('field-error');
      if (errorElement) {
        fieldElement.removeChild(errorElement);
      }
    });
    state.onceError = false;
  }

  function getFormData(formElement) {
    const elements = formElement.querySelectorAll('input, textarea, select');
    const formData = {};

    elements.forEach(element => {
      const { name, type, value, checked } = element;
      if (name) {
        if (type === 'checkbox' || type === 'radio') {
          if (checked) {
            formData[name] = value;
          }
        } else {
          formData[name] = value;
        }
      }
    });
    return formData;
  }

  function mockInputDataRules(formData) {
    const formRule = {};
    Object.keys(formData).forEach((key) => {
      formRule[key] = {
        rule: "hasText",
        required: false
      }
    });
    return formRule;
  }

  function addAttributes() {
    Object.keys(dataRule).forEach((key) => {
      if (rules[dataRule[key].rule]?.attributes) {
        Object.keys(rules[dataRule[key].rule]?.attributes).forEach((attributeKey) => {
          if (rules[dataRule[key].rule]?.attributes?.[attributeKey]) {
            const inputElement = formElement.querySelector(`input[name=${key}]`);
            inputElement[attributeKey] = rules[dataRule[key].rule]?.attributes[attributeKey];
          }
        });
      }
      if (dataRule[key].attributes) {
        Object.keys(dataRule[key].attributes).forEach((attributeKey) => {
          if (attributeKey === 'label') {
            const labelElement = formElement.querySelector(`label[for=${key}]`);
            labelElement.textContent = dataRule[key].attributes[attributeKey];
          } else {
            const inputElement = formElement.querySelector(`input[name=${key}]`);
            inputElement[attributeKey] = dataRule[key].attributes[attributeKey];
          }
        });
      }
    });
  }

  function toogleErrorMessage(inputElement, dataError) {
    const fieldElement = inputElement.parentElement;
    const fieldErrorElement = fieldElement.querySelector('.check-rule-mate-error');
    fieldElement.classList.add('field-error');
    if (dataError) {
      if (fieldErrorElement) {
        fieldErrorElement.textContent = dataError.errorMessage;
      } else {
        const newFieldErrorElement = window.document.createElement('span');
        newFieldErrorElement.classList.add('check-rule-mate-error');
        newFieldErrorElement.innerHTML = dataError.errorMessage;
        fieldElement.appendChild(newFieldErrorElement);
      }
    } else {
      fieldElement.classList.remove('field-error');
      if (fieldErrorElement) {
        fieldElement.removeChild(fieldErrorElement);
      }
    }
  }

  return {
    handleFormSubmit,
    handleFormReset,
    handleInputChange,
    addAttributes,
    getFormData
  }
}
