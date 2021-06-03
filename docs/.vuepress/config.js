module.exports = {
  title: "Danger Kube",
  base: "/dangerkube/",
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
