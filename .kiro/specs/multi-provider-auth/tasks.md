# Implementation Plan

- [ ] 1. Set up provider configurations and environment handling
  - Create individual provider configuration files for Google, Slack, and Notion
  - Implement environment variable validation for all three providers
  - Create centralized provider registry with conditional loading
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 2. Implement Google OAuth provider
  - Configure Google OAuth provider with proper scopes and offline access
  - Write Google-specific profile normalization logic
  - Create unit tests for Google provider configuration
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 6.1, 6.2_

- [ ] 3. Implement Slack OAuth provider
  - Configure Slack OAuth provider with workspace identity scopes
  - Write Slack-specific profile normalization logic
  - Handle Slack workspace token storage
  - Create unit tests for Slack provider configuration
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1, 6.2_

- [ ] 4. Implement Notion OAuth provider
  - Create custom Notion OAuth provider implementation (not built into NextAuth)
  - Configure Notion OAuth endpoints and token handling
  - Write Notion-specific profile normalization logic
  - Handle Notion workspace permissions and token storage
  - Create unit tests for Notion provider configuration
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2_

- [ ] 5. Update NextAuth configuration
  - Replace Discord provider with new multi-provider setup
  - Implement enhanced callbacks for account linking logic
  - Add provider-specific session handling
  - Update TypeScript types for multi-provider support
  - _Requirements: 1.5, 4.2, 4.3, 6.3, 6.4_

- [ ] 6. Create account management service
  - Implement account linking functionality
  - Write account unlinking with validation (prevent removing last auth method)
  - Create service to retrieve all linked accounts for a user
  - Add duplicate account prevention logic
  - Write unit tests for account management operations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7. Implement token management system
  - Create automatic token refresh functionality
  - Implement token expiration detection
  - Add token revocation handling
  - Create retry logic for failed refresh attempts
  - Write unit tests for token management operations
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Build authentication UI components
  - Create individual provider sign-in buttons with proper branding
  - Implement loading states and error handling for OAuth flows
  - Build account linking interface for authenticated users
  - Create provider management page showing linked accounts
  - Add unlinking functionality with confirmation dialogs
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.5_

- [ ] 9. Implement user profile normalization
  - Create service to normalize user data across providers
  - Implement provider precedence logic for conflicting data
  - Handle missing profile information gracefully
  - Add provider-specific data access interface
  - Write unit tests for profile normalization logic
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Add security enhancements
  - Implement token encryption for sensitive data storage
  - Add PKCE support for OAuth flows
  - Create proper session revocation on sign-out
  - Implement suspicious activity detection
  - Add security breach response handling
  - Write security-focused unit tests
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Create integration tests
  - Write integration tests for complete OAuth flows with each provider
  - Test account linking and unlinking scenarios
  - Verify token refresh workflows
  - Test error handling for various failure scenarios
  - Create tests for user profile normalization across providers
  - _Requirements: 1.1-1.5, 2.1-2.4, 3.1-3.4, 4.1-4.5, 5.1-5.5_

- [ ] 12. Update environment configuration and documentation
  - Remove Discord environment variables
  - Add new environment variables for Google, Slack, and Notion
  - Update .env.example with new provider configurations
  - Create setup documentation for OAuth app registration
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 13. Remove Discord provider dependencies
  - Remove Discord provider import and configuration
  - Clean up any Discord-specific code or references
  - Update any existing Discord-related UI components
  - Remove Discord environment variable usage
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 14. Create end-to-end tests
  - Write E2E tests for sign-in flow with each provider
  - Test multi-provider account management workflows
  - Verify session persistence across different providers
  - Test complete sign-out and cleanup processes
  - Create tests for error scenarios and recovery
  - _Requirements: 1.1-1.5, 2.1-2.4, 3.1-3.4, 4.1-4.5_