# Email Verification System Setup Guide

## Overview
This system adds email verification functionality to the CentralComm document tracking system. When someone tries to track a document using a control number, the system will:

1. Check if the document has an associated email address
2. Send a verification email to the document owner
3. Allow the owner to approve or deny access
4. Show the document status only after approval

## Files Created/Modified

### 1. `index.html` (Modified)
- Added EmailJS integration
- Added verification logic to the search function
- Added periodic status checking
- Added verification pending message

### 2. `verify.html` (New)
- Verification page for document owners
- Approve/Deny functionality
- Expiration handling (24 hours)
- Responsive design

### 3. `emailjs-verification-template.html` (New)
- Email template for verification requests
- Professional design with action buttons

## Setup Instructions

### Step 1: EmailJS Configuration

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up for a free account

2. **Add Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Add your email service (Gmail, Outlook, etc.)
   - Note down the Service ID (e.g., `service_07b62xr`) service_ipk7qkc

3. **Create Email Template**
   - Go to "Email Templates"
   - Create a new template
   - Use the content from `emailjs-verification-template.html`
   - Set template variables:
     - `{{control_number}}`
     - `{{document_subject}}`
     - `{{timestamp}}`
     - `{{approve_url}}`
     - `{{deny_url}}`
   - Note down the Template ID (e.g., `template_verification_request`) template_49pyxjf

4. **Get User ID**
   - In EmailJS dashboard, go to "Account" → "API Keys"
   - Copy your Public Key (User ID) mr3lRz__Eu1dWmX1Z ERrA7Wuhh_M9dsVvx

### Step 2: Update Configuration

1. **Update EmailJS User ID**
   - In `index.html`, line 1586: Replace `'Tp4tK-Kp7Vr1m3Kv6'` with your EmailJS User ID
   - In `verify.html`, line 289: Replace `'Tp4tK-Kp7Vr1m3Kv6'` with your EmailJS User ID

2. **Update Service and Template IDs**
   - In `index.html`, line 1618: Replace `'service_07b62xr'` with your Service ID
   - In `index.html`, line 1618: Replace `'template_verification_request'` with your Template ID

### Step 3: Firebase Database Structure

The system will automatically create a new node in your Firebase database:

```json
{
  "verificationRequests": {
    "unique_key": {
      "controlNumber": "2024-00001",
      "clientEmail": "user@example.com",
      "token": "abc123def456",
      "timestamp": 1703123456789,
      "status": "pending",
      "documentData": {
        "controlNumber": "2024-00001",
        "subject": "Document Subject",
        "status": "Pending",
        "fromEmail": "user@example.com"
      },
      "requesterIP": "web-request",
      "requesterUserAgent": "Mozilla/5.0..."
    }
  }
}
```

### Step 4: Testing the System

1. **Test with Document Owner Email**
   - Create a document entry with a valid email address in the `fromEmail` field
   - Try to track the document using the control number
   - Check if verification email is sent

2. **Test Verification Process**
   - Click the approve/deny links in the email
   - Verify that the status updates correctly
   - Check that the document is shown/denied appropriately

## How It Works

### 1. Document Search Flow
```
User enters control number → System checks for document → 
If document has email → Send verification email → Show pending message
If no email → Show document directly
```

### 2. Verification Flow
```
Document owner receives email → Clicks approve/deny → 
System updates status → Original user sees result
```

### 3. Security Features
- **24-hour expiration**: Verification links expire after 24 hours
- **Unique tokens**: Each request gets a unique verification token
- **One-time use**: Verification requests are deleted after processing
- **IP tracking**: System logs requester information (can be enhanced)

## Customization Options

### 1. Email Template
- Modify `emailjs-verification-template.html` to customize the email design
- Add your organization's branding
- Include additional security information

### 2. Expiration Time
- Change the 24-hour expiration in `verify.html` line 350:
  ```javascript
  if (hoursDiff > 24) { // Change 24 to desired hours
  ```

### 3. Status Check Interval
- Modify the 30-second check interval in `index.html` line 1750:
  ```javascript
  setInterval(() => {
    // ... check logic
  }, 30000); // Change 30000 to desired milliseconds
  ```

### 4. Additional Security
- Add IP address validation
- Implement rate limiting
- Add CAPTCHA for verification
- Log all access attempts

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check EmailJS configuration
   - Verify service and template IDs
   - Check browser console for errors

2. **Verification links not working**
   - Ensure `verify.html` is accessible
   - Check Firebase database for verification requests
   - Verify token generation

3. **Status not updating**
   - Check Firebase connection
   - Verify periodic status checking is working
   - Check browser console for errors

### Debug Mode
Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('debug_verification', 'true');
```

## Security Considerations

1. **Email Security**
   - Use HTTPS for all verification links
   - Implement email validation
   - Consider email encryption

2. **Database Security**
   - Set up Firebase security rules
   - Implement rate limiting
   - Regular cleanup of expired requests

3. **Access Control**
   - Consider implementing user authentication
   - Add audit logging
   - Implement session management

## Support

For technical support or questions about this implementation, please refer to:
- EmailJS documentation: https://www.emailjs.com/docs/
- Firebase documentation: https://firebase.google.com/docs
- CentralComm project documentation

---

**Note**: This system is designed for the CentralComm document tracking system. Make sure to test thoroughly in your environment before deploying to production. 