/**
 * Feature request form configuration.
 *
 * Formspree's free plan is free forever (no card required) but caps you at
 * 50 submissions/month. If you're close to or have hit that cap, flip
 * FEATURE_REQUESTS_OPEN to false and redeploy - the page will show
 * FEATURE_REQUESTS_CLOSED_MESSAGE instead of the form, so nobody fills out
 * the whole thing just to have the submission silently fail.
 *
 * Setup:
 * 1. Create a free account at https://formspree.io
 * 2. Create a new form (any name) and copy its endpoint - it looks like
 *    https://formspree.io/f/xxxxabcd
 * 3. Paste that endpoint below as FORMSPREE_ENDPOINT
 * 4. In the Formspree dashboard, under the form's Settings, confirm your
 *    notification email - that's where submissions land
 */
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjezoaq';

export const FEATURE_REQUESTS_OPEN = false;

export const FEATURE_REQUESTS_CLOSED_MESSAGE =
  "We're not accepting new feature requests right now. Check back soon!";
