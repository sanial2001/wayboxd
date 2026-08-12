export type EmailTemplateId = 'welcome-signup';

export type EmailTemplateVars = {
  'welcome-signup': {
    name: string;
    ctaUrl: string;
    preheader: string;
  };
};

export interface RenderedEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
}

export interface WelcomeSignupEmailInput {
  name: string;
  ctaUrl: string;
}
