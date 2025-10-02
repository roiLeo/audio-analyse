export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://avatars.githubusercontent.com/u/9987732?s=96&v=4',
      light: 'https://avatars.githubusercontent.com/u/9987732?s=96&v=4',
      alt: 'Avatar',
    },
    name: 'Jean Michel Doe',
    title: 'Graphic Designer, Web Developer',
    meetingLink: 'https://cal.com/',
    available: true,
    links: {
      email: 'jeandoe@about.me',
      linkedin: 'https://www.linkedin.com/',
      github: 'https://github.com/roiLeo',
    },
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral',
    },
    button: {
      defaultVariants: {
        size: 'lg',
      },
    },
    select: {
      defaultVariants: {
        size: 'lg',
      },
    },
    input: {
      defaultVariants: {
        size: 'lg',
      },
    },
    textarea: {
      defaultVariants: {
        size: 'lg',
      },
    },
  },
})
