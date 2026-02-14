// Onboarding Step 2 - Contact Details
// Check if user came from step 1
let pageTracked = false;

window.addEventListener('load', function() {
    const step1Data = localStorage.getItem('onboarding_step1');
    
    if (!step1Data) {
        // Redirect to step 1 if user didn't complete it
        window.location.href = 'onboarding-step1.html';
        return;
    }
    
    if (!pageTracked) {
        pageTracked = true;
        console.log('Step 2: Contact Details page loaded');
        
        // Track page view event
        if (window.analytics) {
            const step1 = JSON.parse(step1Data);
            analytics.track('Onboarding Step Viewed', {
                step: 2,
                step_name: 'Contact Details',
                previous_step_completed: true,
                business_email: step1.businessEmail,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Go back function
function goBack() {
    // Track back button click
    if (window.analytics) {
        analytics.track('Back Button Clicked', {
            step: 2,
            step_name: 'Contact Details',
            going_to: 'Step 1',
            timestamp: new Date().toISOString()
        });
    }
    
    // Small delay to ensure tracking completes
    setTimeout(function() {
        window.location.href = 'onboarding-step1.html';
    }, 200);
}

// Form validation
const form = document.getElementById('step2Form');
const contactNameInput = document.getElementById('contactName');
const phoneNumberInput = document.getElementById('phoneNumber');
const jobTitleInput = document.getElementById('jobTitle');

// Validation functions
function validateContactName(value) {
    if (!value || value.trim().length === 0) {
        return 'Full name is required';
    }
    if (value.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    return null;
}

function validatePhoneNumber(value) {
    if (!value || value.trim().length === 0) {
        return 'Phone number is required';
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
    }
    if (value.replace(/\D/g, '').length < 10) {
        return 'Phone number must be at least 10 digits';
    }
    return null;
}

function validateJobTitle(value) {
    if (!value || value.trim().length === 0) {
        return 'Job title is required';
    }
    if (value.trim().length < 2) {
        return 'Job title must be at least 2 characters';
    }
    return null;
}

// Show error message
function showError(inputId, message) {
    const errorElement = document.getElementById(inputId + 'Error');
    const inputElement = document.getElementById(inputId);
    
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
}

// Real-time validation
contactNameInput.addEventListener('blur', function() {
    const error = validateContactName(this.value);
    showError('contactName', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 2,
            field: 'contact_name',
            has_error: error !== null,
            error_message: error
        });
    }
});

phoneNumberInput.addEventListener('blur', function() {
    const error = validatePhoneNumber(this.value);
    showError('phoneNumber', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 2,
            field: 'phone_number',
            has_error: error !== null,
            error_message: error
        });
    }
});

jobTitleInput.addEventListener('blur', function() {
    const error = validateJobTitle(this.value);
    showError('jobTitle', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 2,
            field: 'job_title',
            has_error: error !== null,
            error_message: error
        });
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateContactName(contactNameInput.value);
    const phoneError = validatePhoneNumber(phoneNumberInput.value);
    const jobTitleError = validateJobTitle(jobTitleInput.value);
    
    // Show errors
    showError('contactName', nameError);
    showError('phoneNumber', phoneError);
    showError('jobTitle', jobTitleError);
    
    // Check if form is valid
    if (nameError || phoneError || jobTitleError) {
        // Track validation failure
        if (window.analytics) {
            analytics.track('Form Validation Failed', {
                step: 2,
                step_name: 'Contact Details',
                errors: {
                    contact_name: nameError,
                    phone_number: phoneError,
                    job_title: jobTitleError
                }
            });
        }
        return;
    }
    
    // Collect form data
    const formData = {
        contactName: contactNameInput.value.trim(),
        phoneNumber: phoneNumberInput.value.trim(),
        jobTitle: jobTitleInput.value.trim()
    };
    
    // Save to localStorage
    localStorage.setItem('onboarding_step2', JSON.stringify(formData));
    
    // Get step 1 data for complete tracking
    const step1Data = JSON.parse(localStorage.getItem('onboarding_step1'));
    
    // Track successful completion
    if (window.analytics) {
        analytics.track('Onboarding Step Completed', {
            step: 2,
            step_name: 'Contact Details',
            contact_name: formData.contactName,
            phone_number: formData.phoneNumber,
            job_title: formData.jobTitle,
            business_email: step1Data.businessEmail,
            timestamp: new Date().toISOString()
        });
        
        // Update user identity
        analytics.identify(step1Data.businessEmail, {
            name: formData.contactName,
            phone: formData.phoneNumber,
            title: formData.jobTitle,
            onboarding_step: 2
        });
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate processing and redirect
    setTimeout(function() {
        window.location.href = 'onboarding-step3.html';
    }, 800);
});

// Track form abandonment
let formStarted = false;
let formTouched = false;

form.addEventListener('input', function() {
    if (!formStarted) {
        formStarted = true;
        formTouched = true;
        
        if (window.analytics) {
            analytics.track('Form Started', {
                step: 2,
                step_name: 'Contact Details',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track page exit/close
window.addEventListener('beforeunload', function(e) {
    if (formTouched && !localStorage.getItem('onboarding_step2')) {
        if (window.analytics) {
            analytics.track('Form Abandoned', {
                step: 2,
                step_name: 'Contact Details',
                contact_name: contactNameInput.value,
                phone_number: phoneNumberInput.value,
                job_title: jobTitleInput.value,
                fields_filled: {
                    contact_name: !!contactNameInput.value,
                    phone_number: !!phoneNumberInput.value,
                    job_title: !!jobTitleInput.value
                },
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track when user navigates away
document.addEventListener('visibilitychange', function() {
    if (document.hidden && formTouched && !localStorage.getItem('onboarding_step2')) {
        if (window.analytics) {
            analytics.track('Page Hidden - Form Not Completed', {
                step: 2,
                step_name: 'Contact Details',
                contact_name: contactNameInput.value,
                phone_number: phoneNumberInput.value,
                job_title: jobTitleInput.value,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track back button navigation
window.addEventListener('popstate', function() {
    if (formTouched && !localStorage.getItem('onboarding_step2')) {
        if (window.analytics) {
            analytics.track('Browser Back Button Clicked', {
                step: 2,
                step_name: 'Contact Details',
                timestamp: new Date().toISOString()
            });
        }
    }
});
