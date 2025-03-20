# check-rule-mate-form-liquid

**check-rule-mate-form-liquid** is a flexible drag-and-drop form builder solution for Shopify, specifically designed to handle form validation, layout customization, and modular rule-based form logic. It's an extension of the **check-rule-mate** library and integrates seamlessly with Shopify themes using Liquid templates.

## Key Features

- **Drag-and-drop interface** to create forms directly within your Shopify theme.
- **Fully responsive** form layouts that automatically adapt to desktop, tablet, and mobile views.
- **Extensible and modular**: Built using the **check-rule-mate** library for flexible form validation and rule management.
- **Customizable validation** rules and form logic.
- **Shopify Liquid compatibility**: Easily integrates into your Shopify store’s theme.
- **Multi-language support** with customizable error messages.

## Installation

1. **Clone or Download** the repository.
2. **Place the files** in the correct locations within your Shopify theme:
   - JavaScript files in the `assets` folder.
   - Liquid files in the `sections` folder.
3. **Set up the form** by customizing your Shopify theme. You simply need to drag and drop the **check-rule-mate-form-liquid** block and its corresponding blocks where you want the form to appear.

## Usage

Once the files are installed, you need to customize your theme by setting up the form layout and rules. 

### Configuring Form Validation Rules

1. **Create Metaobjects for Form Rules:**
   
   - **Form Rules Metaobject** (Type: `form_rules`): Create rules for each form field.

     Example:
     ```json
     {
       "name": {
         "rule": "name",
         "required": true,
         "attributes": {
           "label": "First name",
           "maxLength": 32
         }
       },
       "email": {
         "rule": "email",
         "required": true
       },
       "emailConfirm": {
         "rule": "email--confirm",
         "required": true
       },
       "phone": {
         "rule": "phone",
         "required": false
       },
       "subject": {
         "rule": "hasText",
         "required": true
       },
       "message": {
         "rule": "hasText",
         "required": true
       }
     }
     ```

2. **Check-rule-mate-form Rules Metaobject** (Type: `check_rule_mate_form_rules`): Define validation rules for each field.

     Example:
     ```json
     {
       "name": {
         "validate": ["hasText"],
         "attributes": {
           "maxLength": 64
         },
         "error": {
           "hasText": "common.hasText"
         }
       },
       "email": {
         "regex": "/^[a-z0-9.]+@[a-z0-9]+\\.[a-z]+(\\.[a-z]+)?$/i",
         "validate": ["regex"],
         "error": {
           "regex": "email.regex"
         },
         "modifier": {
           "confirm": {
             "validate": ["regex", "equals"],
             "params": {
               "equals": ["$email"]
             },
             "error": {
               "regex": "email.regex",
               "equals": "email.equals"
             }
           }
         }
       }
     }
     ```

3. **Check-rule-mate-form Errors Metaobject** (Type: `check_rule_mate_form_errors`): Define custom error messages for each validation rule.

     Example:
     ```json
     {
       "common": {
         "hasText": "Please, fill the field"
       },
       "email": {
         "regex": "Please, fill the field with a valid e-mail",
         "equals": "The email and email confirm are not equals"
       },
       "phone": {
         "regex": "Please, fill the field with a valid phone"
       },
       "name": {
         "nameSpecialValidation": "Please, fill the field following fields: name, email, and cellphone"
       }
     }
     ```

## Why You’ll Love It

If you're looking for a **flexible** and **extensible** solution to manage form validation and logic in your Shopify store, **check-rule-mate-form-liquid** is perfect for you. It leverages the power of the **check-rule-mate** library, offering a modular approach to form handling. Whether you want to create simple forms or complex ones with validation rules and conditional logic, this solution helps you do it **with ease**.

By integrating **check-rule-mate-form** and **check-rule-mate** into your Shopify theme, you gain a **robust, maintainable** form validation framework that can be easily extended and customized to meet the needs of any Shopify store, large or small. 

**What makes this even better?** It's **open-source**, **free to use**, and built to help developers **save time** while enhancing the user experience. Plus, with a simple drag-and-drop interface, you don’t have to worry about complex integrations or long setup times.

## License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.
