// https://www.creative-flyers.com

export type DATA_ITEM_TYPE = {
  id: number;
  title: string;
  location: string;
  date: string;
  poster: string;
};

export const DATA = [
  {
    id: 1,
    title: "Festival music",
    location: "Berlin, Germany",
    date: "Apr 21th, 2021",
    poster: "https://th.bing.com/th/id/OIP.EKxkhulCPo2M5eP6LEOAHAHaLL",
  },
  {
    id: 2,
    title: "Beach House",
    location: "Liboa, Portugal",
    date: "Aug 12th, 2020",
    poster:
      "https://i.pinimg.com/736x/79/84/2f/79842f01e8b3773916823961d6650605.jpg",
  },
  {
    id: 3,
    title: "4th Of July",
    location: "New York, USA",
    date: "Oct 11th, 2020",
    poster: "https://th.bing.com/th/id/OIP.QatFnF9HviYeE96kGdCpZgHaLH",
    hashString: "LQB|d4xu4TIU_4s:D%WB%MadRkt8",
  },
  {
    id: 4,
    title: "Afro vibes",
    location: "Mumbai, India",
    date: "Nov 17th, 2020",
    poster: "https://th.bing.com/th/id/OIP.yIEB-Z7KC38rkAwXNZxv5QHaLG",
    hashString: "LJAmxKMy4.of~pM|IUs:-:WBM|ay",
  },
  {
    id: 5,
    title: "Jungle Party",
    location: "Unknown",
    date: "Sept 3rd, 2020",
    poster: "https://th.bing.com/th/id/OIP.HEWc4UQg4s-gNFlFgRxCBQHaLG",
    hashString: "L~Gm4IM{oJj[%%RkoLfkWBogjsay",
  },
  {
    id: 6,
    title: "Summer festival",
    location: "Bucharest, Romania",
    date: "Aug 17th, 2020",
    poster: "https://th.bing.com/th/id/OIP._Fxv7pChiqxvz4QLubEXJgHaLH",
  },
  {
    id: 7,
    title: "BBQ with friends",
    location: "Prague, Czech Republic",
    date: "Sept 11th, 2020",
    poster: "https://th.bing.com/th/id/OIP.lwY9KHYDat11q7yhRtNSOAHaLH",
  },
];

export const FEATURED_ROWS = [
  {
    id: 1,
    title: "Latest News",
    items: [
      {
        id: 1,
        title: "News Title",
        desc: "News Descriptions",
        image: "https://th.bing.com/th/id/OIP.EKxkhulCPo2M5eP6LEOAHAHaLL",
      },
      {
        id: 2,
        title: "News Title",
        desc: "News Descriptions",
        image:
          "https://i.pinimg.com/736x/79/84/2f/79842f01e8b3773916823961d6650605.jpg",
      },
      {
        id: 3,
        title: "News Title",
        desc: "News Descriptions",
        image: "https://th.bing.com/th/id/OIP.QatFnF9HviYeE96kGdCpZgHaLH",
      },
    ],
  },
  {
    id: 2,
    title: "Latest News",
    items: [
      {
        id: 4,
        title: "News Title",
        desc: "News Descriptions",
        image: "https://th.bing.com/th/id/OIP.QatFnF9HviYeE96kGdCpZgHaLH",
      },
      {
        id: 5,
        title: "News Title",
        desc: "News Descriptions",
        image: "https://th.bing.com/th/id/OIP.EKxkhulCPo2M5eP6LEOAHAHaLL",
      },
      {
        id: 6,
        title: "News Title",
        desc: "News Descriptions",
        image:
          "https://i.pinimg.com/736x/79/84/2f/79842f01e8b3773916823961d6650605.jpg",
      },
    ],
  },
];
