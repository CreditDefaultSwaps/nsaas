# Pilot Customer Templates

## Feature Shipped Notification

**Subject:** ✅ Your feature "{{feature_title}}" is live!

**Body:**
```
Hi there,

Great news! The feature you requested — "{{feature_title}}" — has been built and deployed.

🚀 Live URL: {{deployed_url}}

What was built:
• Complete implementation based on your requirements
• Fully tested and production-ready
• Quality gates passed (TypeScript, ESLint, Build)

Next steps:
1. Try it out at the link above
2. Let us know if you need any adjustments
3. Consider what you'd like built next

Questions? Just reply to this email.

— The Night Shift Team
```

## Feature Ready for Review

**Subject:** 👀 "{{feature_title}}" is ready for your review

**Body:**
```
Hi there,

Your feature "{{feature_title}}" is built and ready for review.

📋 Pull Request: {{pr_url}}

Review checklist:
□ Code meets your standards
□ Feature works as expected
□ Ready to deploy to production

Once you approve, we'll deploy it immediately.

— The Night Shift Team
```

## Variables
- `{{feature_title}}` — Name of the feature
- `{{deployed_url}}` — Production URL
- `{{pr_url}}` — GitHub pull request link

## Usage
Call `notificationTemplates.shipped()` or `notificationTemplates.review()` in the admin panel.
