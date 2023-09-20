# Notes

## Merchant frontend

- Google and Apple logins

- Merchant orders view
- Merchant customers view

# Marketing website

- Privacy policy
- Terms of Service
- GDPR

## Customer frontend

- Auth

  - Register
  - Login
  - Reset password

- Catalog

  - Item detail

- Cart
- Checkout
- Orders

  - Order detail

- Account
- Push notifications

Backend Requirements:
Token Verification: Implement logic to verify the Apple ID token provided by the client app during the sign-in process. This ensures that the request actually came from Apple.

Email-Based Uniqueness: Store the Apple-provided email (either real or anonymized) as the unique identifier for users. You already mentioned you do this, so it aligns with your existing setup.

Multi-Account Handling: Build logic to handle Apple ID tokens from different Developer Accounts. Since each Developer Account will have its own set of Apple Sign-in credentials, your backend needs to know which credentials to use for verification.

User Type Handling: Include a flag or some mechanism to differentiate between Merchant and Customer accounts, especially if a Merchant can also be a Customer. This flag is important for your app's internal logic but doesn't impact the Apple sign-in process directly.

Security: Implement strong security practices to protect the Apple ID tokens and any other sensitive user information that your backend will be storing.

Audit Trails: Maintain detailed logs to troubleshoot any issues that might arise, given the complexity of handling multiple Developer Accounts and user types.

Legal Compliance: Ensure you comply with privacy laws and Apple's guidelines, particularly around how you store and use Apple-provided user data.

Developer Account Requirements:
Sign-in with Apple Capability: Enable the Sign in with Apple capability in the App IDs section for each Developer Account.

Service IDs: Create a unique Service ID for each app under each Developer Account. This Service ID will be used to configure the Sign in with Apple button and is required for generating client secrets.

Private Key Generation: Generate a private key for each Service ID. This private key will be used to create the client secret required for server-side token verification.

Consistent Configuration: Ensure that the bundle IDs, Team IDs, and other developer-specific settings are correctly set up in the Developer Accounts, so the client app can smoothly interact with your backend.

Testing and Compliance: Thoroughly test the implementation on devices and simulators to ensure it meets Apple's standards and guidelines.

Documentation: Keep detailed documentation for each Developer Account configuration to help manage the complexity of having multiple accounts.

That should cover the essential elements you need to address on both the backend and Developer Accounts for your specific setup.
