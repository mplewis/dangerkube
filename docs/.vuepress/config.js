module.exports = {
  title: "Danger Kube",
  themeConfig: {
    displayAllHeaders: true,
    navbar: [
      {
        text: "Sections",
        children: [
          "/welcome",
          "/getting-started",
          "/running-code",
          "/going-online",
          "/serving-requests",
        ],
      },
    ],
    sidebar: 'auto',
  },
};
