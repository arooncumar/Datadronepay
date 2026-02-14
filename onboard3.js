// Onboarding Step 3 - Verification
// Check if user completed previous steps
let pageTracked = false;

window.addEventListener('load', function() {
    const step1Data = localStorage.getItem('onboarding_step1');
    const step2Data = localStorage.getItem('onboarding_step2');
    
    if (!step1Data || !step2Data) {
        // Redirect to appropriate step
        if (!step1Data) {
            window.location.href = 'onboarding-step1.html';
        } else {
            window.location.href = 'onboarding-step2.html';
        }
        return;
    }
    
    if (!pageTracked) {
        pageTracked = true;
        console.log('Step 3: Verification page loaded');
        
        // Track page view event
        if (window.analytics) {
            const step1 = JSON.parse(step1Data);
            analytics.track('Onboarding Step Viewed', {
                step: 3,
                step_name: 'Verification',
                previous_steps_completed: true,
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
            step: 3,
            step_name: 'Verification',
            going_to: 'Step 2',
            timestamp: new Date().toISOString()
        });
    }
    
    // Small delay to ensure tracking completes
    setTimeout(function() {
        window.location.href = 'onboarding-step2.html';
    }, 200);
}

// Form validation
const form = document.getElementById('step3Form');
const businessTypeSelect = document.getElementById('businessType');
const registrationNumberInput = document.getElementById('registrationNumber');
const monthlyVolumeSelect = document.getElementById('monthlyVolume');
const termsCheckbox = document.getElementById('termsAccepted');

// Validation functions
function validateBusinessType(value) {
    if (!value || value === '') {
        return 'Please select a business type';
    }
    return null;
}

function validateRegistrationNumber(value) {
    if (!value || value.trim().length === 0) {
        return 'Registration number is required';
    }
    if (value.trim().length < 3) {
        return 'Registration number must be at least 3 characters';
    }
    return null;
}

function validateMonthlyVolume(value) {
    if (!value || value === '') {
        return 'Please select expected monthly volume';
    }
    return null;
}

function validateTerms(checked) {
    if (!checked) {
        return 'You must accept the terms and conditions';
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
        if (inputElement) {
            inputElement.classList.add('error');
        }
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
}

// Real-time validation
businessTypeSelect.addEventListener('change', function() {
    const error = validateBusinessType(this.value);
    showError('businessType', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 3,
            field: 'business_type',
            selected_type: this.value,
            has_error: error !== null
        });
    }
});

registrationNumberInput.addEventListener('blur', function() {
    const error = validateRegistrationNumber(this.value);
    showError('registrationNumber', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 3,
            field: 'registration_number',
            has_error: error !== null,
            error_message: error
        });
    }
});

monthlyVolumeSelect.addEventListener('change', function() {
    const error = validateMonthlyVolume(this.value);
    showError('monthlyVolume', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 3,
            field: 'monthly_volume',
            selected_volume: this.value,
            has_error: error !== null
        });
    }
});

termsCheckbox.addEventListener('change', function() {
    const error = validateTerms(this.checked);
    showError('terms', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Terms Checkbox Changed', {
            step: 3,
            accepted: this.checked
        });
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const businessTypeError = validateBusinessType(businessTypeSelect.value);
    const registrationNumberError = validateRegistrationNumber(registrationNumberInput.value);
    const monthlyVolumeError = validateMonthlyVolume(monthlyVolumeSelect.value);
    const termsError = validateTerms(termsCheckbox.checked);
    
    // Show errors
    showError('businessType', businessTypeError);
    showError('registrationNumber', registrationNumberError);
    showError('monthlyVolume', monthlyVolumeError);
    showError('terms', termsError);
    
    // Check if form is valid
    if (businessTypeError || registrationNumberError || monthlyVolumeError || termsError) {
        // Track validation failure
        if (window.analytics) {
            analytics.track('Form Validation Failed', {
                step: 3,
                step_name: 'Verification',
                errors: {
                    business_type: businessTypeError,
                    registration_number: registrationNumberError,
                    monthly_volume: monthlyVolumeError,
                    terms: termsError
                }
            });
        }
        return;
    }
    
    // Collect form data
    const formData = {
        businessType: businessTypeSelect.value,
        registrationNumber: registrationNumberInput.value.trim(),
        monthlyVolume: monthlyVolumeSelect.value,
        termsAccepted: termsCheckbox.checked
    };
    
    // Save to localStorage
    localStorage.setItem('onboarding_step3', JSON.stringify(formData));
    
    // Get all previous data
    const step1Data = JSON.parse(localStorage.getItem('onboarding_step1'));
    const step2Data = JSON.parse(localStorage.getItem('onboarding_step2'));
    
    // Track successful completion
    if (window.analytics) {
        analytics.track('Onboarding Step Completed', {
            step: 3,
            step_name: 'Verification',
            business_type: formData.businessType,
            registration_number: formData.registrationNumber,
            monthly_volume: formData.monthlyVolume,
            terms_accepted: formData.termsAccepted,
            business_email: step1Data.businessEmail,
            timestamp: new Date().toISOString()
        });
        
        // Track complete onboarding
        analytics.track('Onboarding Completed', {
            business_name: step1Data.businessName,
            business_email: step1Data.businessEmail,
            country: step1Data.country,
            contact_name: step2Data.contactName,
            phone_number: step2Data.phoneNumber,
            job_title: step2Data.jobTitle,
            business_type: formData.businessType,
            monthly_volume: formData.monthlyVolume,
            registration_number: formData.registrationNumber,
            completed_at: new Date().toISOString(),
            total_steps: 3
        });
        
        // Final user identity update
        analytics.identify(step1Data.businessEmail, {
            business_type: formData.businessType,
            registration_number: formData.registrationNumber,
            monthly_volume: formData.monthlyVolume,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString()
        });
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate processing and show success modal
    setTimeout(function() {
        // Clear onboarding data from localStorage
        localStorage.removeItem('onboarding_step1');
        localStorage.removeItem('onboarding_step2');
        localStorage.removeItem('onboarding_step3');
        
        // Show success modal
        document.getElementById('successModal').classList.add('show');
        
        // Track success modal shown
        if (window.analytics) {
            analytics.track('Success Modal Shown', {
                onboarding_complete: true,
                business_email: step1Data.businessEmail
            });
        }
    }, 1000);
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
                step: 3,
                step_name: 'Verification',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track page exit/close
window.addEventListener('beforeunload', function(e) {
    if (formTouched && !localStorage.getItem('onboarding_step3')) {
        if (window.analytics) {
            analytics.track('Form Abandoned', {
                step: 3,
                step_name: 'Verification',
                business_type: businessTypeSelect.value,
                registration_number: registrationNumberInput.value,
                monthly_volume: monthlyVolumeSelect.value,
                terms_accepted: termsCheckbox.checked,
                fields_filled: {
                    business_type: !!businessTypeSelect.value,
                    registration_number: !!registrationNumberInput.value,
                    monthly_volume: !!monthlyVolumeSelect.value,
                    terms_accepted: termsCheckbox.checked
                },
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track when user navigates away
document.addEventListener('visibilitychange', function() {
    if (document.hidden && formTouched && !localStorage.getItem('onboarding_step3')) {
        if (window.analytics) {
            analytics.track('Page Hidden - Form Not Completed', {
                step: 3,
                step_name: 'Verification',
                business_type: businessTypeSelect.value,
                registration_number: registrationNumberInput.value,
                monthly_volume: monthlyVolumeSelect.value,
                terms_accepted: termsCheckbox.checked,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track back button navigation
window.addEventListener('popstate', function() {
    if (formTouched && !localStorage.getItem('onboarding_step3')) {
        if (window.analytics) {
            analytics.track('Browser Back Button Clicked', {
                step: 3,
                step_name: 'Verification',
                timestamp: new Date().toISOString()
            });
        }
    }
});
