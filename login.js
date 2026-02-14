// Track Login Page View
window.addEventListener('load', function() {
    console.log('Login page loaded');
    
    // Track page view
    if (window.analytics) {
        analytics.track('Login Page Viewed', {
            page: 'Login',
            timestamp: new Date().toISOString()
        });
    }
});

// Form elements
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const togglePasswordBtn = document.getElementById('togglePassword');

// Toggle password visibility
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Track password toggle
        if (window.analytics) {
            analytics.track('Password Visibility Toggled', {
                visible: type === 'text'
            });
        }
    });
}

// Validation functions
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

function validatePassword(value) {
    if (!value || value.trim().length === 0) {
        return 'Password is required';
    }
    if (value.length < 6) {
        return 'Password must be at least 6 characters';
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
emailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value);
    showError('email', error);
    
    // Track email field interaction
    if (window.analytics) {
        analytics.track('Login Email Field Completed', {
            has_error: error !== null,
            error_message: error,
            email_domain: this.value.split('@')[1] || ''
        });
    }
});

passwordInput.addEventListener('blur', function() {
    const error = validatePassword(this.value);
    showError('password', error);
    
    // Track password field interaction
    if (window.analytics) {
        analytics.track('Login Password Field Completed', {
            has_error: error !== null,
            password_length: this.value.length
        });
    }
});

// Track Remember Me checkbox
rememberMeCheckbox.addEventListener('change', function() {
    if (window.analytics) {
        analytics.track('Remember Me Toggled', {
            checked: this.checked
        });
    }
});

// Form submission
let loginAttempts = 0;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    loginAttempts++;
    
    // Validate all fields
    const emailError = validateEmail(emailInput.value);
    const passwordError = validatePassword(passwordInput.value);
    
    // Show errors
    showError('email', emailError);
    showError('password', passwordError);
    
    // Check if form is valid
    if (emailError || passwordError) {
        // Track validation failure
        if (window.analytics) {
            analytics.track('Login Validation Failed', {
                errors: {
                    email: emailError,
                    password: passwordError
                },
                attempt_number: loginAttempts
            });
        }
        return;
    }
    
    // Collect form data
    const email = emailInput.value.trim().toLowerCase();
    const rememberMe = rememberMeCheckbox.checked;
    
    // Track login attempt
    if (window.analytics) {
        analytics.track('Login Attempt', {
            email: email,
            email_domain: email.split('@')[1],
            remember_me: rememberMe,
            attempt_number: loginAttempts,
            timestamp: new Date().toISOString()
        });
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate authentication (replace with actual API call)
    setTimeout(function() {
        // Simulate successful login
        const userData = {
            email: email,
            name: email.split('@')[0], // Extract name from email
            logged_in: true,
            login_timestamp: new Date().toISOString(),
            remember_me: rememberMe
        };
        
        // Save to localStorage FIRST
        localStorage.setItem('tazapay_user', JSON.stringify(userData));
        localStorage.setItem('tazapay_previous_login', 'true');
        
        // IDENTIFY USER IN SEGMENT
        // This is the key part for unifying the user
        if (window.analytics) {
            // Identify the user with their email as unique ID
            analytics.identify(email, {
                email: email,
                name: userData.name,
                logged_in: true,
                login_method: 'email_password',
                remember_me: rememberMe,
                first_login: !localStorage.getItem('tazapay_previous_login'),
                last_login: new Date().toISOString(),
                email_domain: email.split('@')[1]
            }, function() {
                console.log('Segment identify callback completed');
            });
            
            // Track successful login event
            analytics.track('User Logged In', {
                email: email,
                login_method: 'email_password',
                remember_me: rememberMe,
                attempt_number: loginAttempts,
                success: true,
                timestamp: new Date().toISOString()
            }, function() {
                console.log('Login event tracked');
                
                // ONLY redirect after Segment has processed the events
                setTimeout(function() {
                    console.log('Redirecting to homepage...');
                    window.location.href = 'index.html';
                }, 500);
            });
        } else {
            // If Segment isn't loaded, still redirect
            console.log('Segment not loaded, redirecting anyway');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 500);
        }
        
    }, 1000); // Reduced delay
});

// Track social login clicks
document.querySelectorAll('.btn-social').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'google' : 'other';
        
        if (window.analytics) {
            analytics.track('Social Login Clicked', {
                provider: provider,
                page: 'Login'
            });
        }
        
        // You would integrate actual OAuth here
        alert('Social login integration would go here');
    });
});

// Track forgot password click
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (window.analytics) {
            analytics.track('Forgot Password Clicked', {
                email_entered: !!emailInput.value,
                email: emailInput.value || null
            });
        }
        
        alert('Password reset functionality would go here');
    });
}

// Track signup link click
const signupLink = document.querySelector('.signup-link a');
if (signupLink) {
    signupLink.addEventListener('click', function() {
        if (window.analytics) {
            analytics.track('Signup Link Clicked', {
                source: 'login_page'
            });
        }
    });
}

// Track form abandonment
let formStarted = false;

form.addEventListener('input', function() {
    if (!formStarted) {
        formStarted = true;
        
        if (window.analytics) {
            analytics.track('Login Form Started', {
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track when user leaves without logging in
window.addEventListener('beforeunload', function() {
    if (formStarted && !localStorage.getItem('tazapay_user')) {
        if (window.analytics) {
            analytics.track('Login Form Abandoned', {
                email_entered: !!emailInput.value,
                password_entered: !!passwordInput.value,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Track page visibility
document.addEventListener('visibilitychange', function() {
    if (document.hidden && formStarted && !localStorage.getItem('tazapay_user')) {
        if (window.analytics) {
            analytics.track('Login Page Hidden - Not Completed', {
                email_entered: !!emailInput.value,
                timestamp: new Date().toISOString()
            });
        }
    }
});
