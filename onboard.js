// Onboarding Step 1 - Business Information
console.log('===== ONBOARDING STEP 1 LOADED =====');

// Track page load ONCE
let pageTracked = false;

window.addEventListener('load', function() {
    if (!pageTracked) {
        pageTracked = true;
        console.log('Step 1: Business Information page loaded');
        
        // Track page view event
        if (window.analytics && typeof window.analytics.track === 'function') {
            try {
                analytics.track('Onboarding Step Viewed', {
                    step: 1,
                    step_name: 'Business Information',
                    timestamp: new Date().toISOString()
                });
                console.log('✓ Step 1 page view tracked');
            } catch (error) {
                console.error('✗ Error tracking Step 1 page view:', error);
            }
        } else {
            console.error('✗ Segment analytics not available');
        }
    }
});

// Form validation
const form = document.getElementById('step1Form');
const businessNameInput = document.getElementById('businessName');
const businessEmailInput = document.getElementById('businessEmail');
const countrySelect = document.getElementById('country');

    if (window.analytics && typeof window.analytics.track === 'function') {
        try {
            analytics.track('Back Button Clicked on step 1', {
                step: 2,
                step_name: 'Contact Details',
                going_to: 'Step 1',
                timestamp: new Date().toISOString()
            });
            console.log('✓ Back button click tracked in Segment');
            
            // Wait 500ms for Segment to send the event
            setTimeout(function() {
                console.log('Navigating back to Step 1...');
                window.location.href = 'onboarding-step1.html';
            }, 500);
        } catch (error) {
            console.error('✗ Error tracking back button:', error);
            // Navigate anyway even if tracking fails
            window.location.href = 'index.html';
        }
    } else {
        console.error('✗ Segment analytics not available');
        window.location.href = 'onboarding-step1.html';
    }
}

// Validation functions
function validateBusinessName(value) {
    if (!value || value.trim().length === 0) {
        return 'Business name is required';
    }
    if (value.trim().length < 2) {
        return 'Business name must be at least 2 characters';
    }
    return null;
}

function validateEmail(value) {
    if (!value || value.trim().length === 0) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateCountry(value) {
    if (!value || value === '') {
        return 'Please select a country';
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
businessNameInput.addEventListener('blur', function() {
    const error = validateBusinessName(this.value);
    showError('businessName', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 1,
            field: 'business_name',
            has_error: error !== null,
            error_message: error
        });
    }
});

businessEmailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value);
    showError('businessEmail', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 1,
            field: 'business_email',
            has_error: error !== null,
            error_message: error
        });
    }
});

countrySelect.addEventListener('change', function() {
    const error = validateCountry(this.value);
    showError('country', error);
    
    // Track field interaction
    if (window.analytics) {
        analytics.track('Form Field Completed', {
            step: 1,
            field: 'country',
            selected_country: this.value,
            has_error: error !== null
        });
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log('===== STEP 1 FORM SUBMITTED =====');
    
    // Validate all fields
    const businessNameError = validateBusinessName(businessNameInput.value);
    const emailError = validateEmail(businessEmailInput.value);
    const countryError = validateCountry(countrySelect.value);
    
    // Show errors
    showError('businessName', businessNameError);
    showError('businessEmail', emailError);
    showError('country', countryError);
    
    // Check if form is valid
    if (businessNameError || emailError || countryError) {
        console.log('✗ Validation failed');
        // Track validation failure
        if (window.analytics) {
            analytics.track('Form Validation Failed', {
                step: 1,
                step_name: 'Business Information',
                errors: {
                    business_name: businessNameError,
                    business_email: emailError,
                    country: countryError
                }
            });
        }
        return;
    }
    
    // Collect form data
    const formData = {
        businessName: businessNameInput.value.trim(),
        businessEmail: businessEmailInput.value.trim(),
        country: countrySelect.value
    };
    
    console.log('Form data:', formData);
    
    // Save to localStorage
    localStorage.setItem('onboarding_step1', JSON.stringify(formData));
    console.log('✓ Data saved to localStorage');
    
    // Track successful completion
    if (window.analytics && typeof window.analytics.track === 'function') {
        try {
            analytics.track('Onboarding Step Completed', {
                step: 1,
                step_name: 'Business Information',
                business_name: formData.businessName,
                business_email: formData.businessEmail,
                country: formData.country,
                timestamp: new Date().toISOString()
            });
            console.log('✓ Step completion tracked');
            
            // Identify user - THIS CREATES THE UNIFIED PROFILE
            analytics.identify(formData.businessEmail, {
                email: formData.businessEmail,
                business_name: formData.businessName,
                country: formData.country,
                onboarding_step: 1
            });
            console.log('✓ User identified:', formData.businessEmail);
        } catch (error) {
            console.error('✗ Error tracking:', error);
        }
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate processing and redirect
    setTimeout(function() {
        console.log('Navigating to Step 2...');
        window.location.href = 'onboarding-step2.html';
    }, 800);
});

// Track form abandonment (when user leaves without completing)
let formStarted = false;
let formTouched = false;

form.addEventListener('input', function() {
    if (!formStarted) {
        formStarted = true;
        formTouched = true;
        
        if (window.analytics) {
            analytics.track('Form Started', {
                step: 1,
                step_name: 'Business Information',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track page exit/close
window.addEventListener('beforeunload', function(e) {
    if (formTouched && !localStorage.getItem('onboarding_step1')) {
        // Track abandonment
        if (window.analytics) {
            analytics.track('Form Abandoned', {
                step: 1,
                step_name: 'Business Information',
                business_name: businessNameInput.value,
                business_email: businessEmailInput.value,
                country: countrySelect.value,
                fields_filled: {
                    business_name: !!businessNameInput.value,
                    business_email: !!businessEmailInput.value,
                    country: !!countrySelect.value
                },
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track when user navigates away (back button, close tab, etc.)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && formTouched && !localStorage.getItem('onboarding_step1')) {
        if (window.analytics) {
            analytics.track('Page Hidden - Form Not Completed', {
                step: 1,
                step_name: 'Business Information',
                business_name: businessNameInput.value,
                business_email: businessEmailInput.value,
                country: countrySelect.value,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track back button navigation
window.addEventListener('popstate', function() {
    if (formTouched && !localStorage.getItem('onboarding_step1')) {
        if (window.analytics) {
            analytics.track('Browser Back Button Clicked', {
                step: 1,
                step_name: 'Business Information',
                timestamp: new Date().toISOString()
            });
        }
    }
});

