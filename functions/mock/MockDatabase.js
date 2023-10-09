
module.exports = async function (db) {
  db.collection('lots').add({
    title: "Portland Vase",
    description:
      "The Portland Vase is a Roman cameo glass vase, which is dated to between AD 1 and AD 25, though low BC dates have some scholarly support.[1] It is the best known piece of Roman cameo glass and has served as an inspiration to many glass and porcelain makers from about the beginning of the 18th century onwards. It is first recorded in Rome in 1600–1601, and since 1810 has been in the British Museum in London. It was bought by the museum in 1945 (GR 1945,0927.1) and is normally on display in Room 70. The vase measures about 25 centimetres (9.8 in) high and 18 cm (7.1 in) diameter. It is made of violet-blue glass, and surrounded with a single continuous white glass cameo making two distinct scenes, depicting seven human figures, plus a large snake, and two bearded and horned heads below the handles, marking the break between the scenes. The bottom of the vase was a cameo glass disc, also in blue and white, showing a head, presumed to be of Paris or Priam on the basis of the Phrygian cap it wears. This roundel[citation needed] clearly does not belong to the vase, and has been displayed separately since 1845. It may have been added in antiquity or later, or is the result of a conversion from an original amphora form (paralleled by a similar blue-glass cameo vessel from Pompeii). It was attached to the bottom from at least 1826.",
    preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Portland_Vase_BM_Gem4036_n1.jpg/230px-Portland_Vase_BM_Gem4036_n1.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Portland_Vase_BM_Gem4036_n3.jpg/220px-Portland_Vase_BM_Gem4036_n3.jpg",

      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Portland_Vase%2C_Wedgewood_copy_%28V%26A%2C_6th_Dec_05_228%29.jpg/220px-Portland_Vase%2C_Wedgewood_copy_%28V%26A%2C_6th_Dec_05_228%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Portland_Vase_BM_Gem4036_n8.jpg/220px-Portland_Vase_BM_Gem4036_n8.jpg",
    ],
    publishedAt: Date.now(),
    startAt: Date.now(),
    finishAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    startBid: 500,
    type: 1,
    owner: {
      id: 'gfdff',
      avatar: 'https://avatars.githubusercontent.com/u/1529621',
      name: 'John Wolf',
    },
    bid: 2000,//current bid
    players: [
      {
        id: "player#1",
        name: "Player 1",
        bid: 2000,
        avatar: "https://avatars.githubusercontent.com/u/1523",
      },
      {
        id: "player#2",
        name: "Player 2 van Got",
        bid: 1900,
        avatar: "https://avatars.githubusercontent.com/u/1526",
      },
      {
        id: "player#3",
        name: "Player 3",
        bid: 1800,
        avatar: "https://avatars.githubusercontent.com/u/1527",
      },
      {
        id: "player#4",
        name: "Player 4",
        bid: 1500,
        avatar: "https://avatars.githubusercontent.com/u/1538421",
      },
      {
        id: "player#5",
        name: "Player 5",
        bid: 500,
        avatar: "https://avatars.githubusercontent.com/u/1538423",
      },
    ],
  });

  db.collection('lots').add({
    title: "Whistler's Mother",
    description:
      "Anna Matilda (née McNeill) Whistler (September 27, 1804 – January 31, 1881) was the mother of American-born, British-based painter James McNeill Whistler, who made her the subject of his famous painting Arrangement in Grey and Black No.1, often titled Whistler's Mother.",
    preview: "https://i.etsystatic.com/20840304/r/il/f8ff4f/2612243730/il_570xN.2612243730_ng6t.jpg",
    images: [],
    publishedAt: Date.now()+1,
    startAt: Date.now()+1,
    finishAt: Date.now() + 7 * 24 * 60 * 60 * 1000+1,
    startBid: 100,
    type: 1,
    owner: {
      id: 'hgfjgfhjf',
      avatar: 'https://my.kumonglobal.com/wp-content/uploads/2022/03/Learn-from-Rowan-Atkinson_Kumon-Malaysia_530x530_NewsThumbnail.jpg',
      name: 'Mr. Bean',
    },
    bid: 500,//current bid
    players: [
      {
        id: "player#1",
        name: "Player 1",
        bid: 500,
        avatar: "https://avatars.githubusercontent.com/u/1523",
      },
      {
        id: "player#2",
        name: "Player 2 van Got",
        bid: 400,
        avatar: "https://avatars.githubusercontent.com/u/1526",
      },
      {
        id: "player#3",
        name: "Player 3",
        bid: 300,
        avatar: "https://avatars.githubusercontent.com/u/1527",
      },
      {
        id: "player#4",
        name: "Player 4",
        bid: 200,
        avatar: "https://avatars.githubusercontent.com/u/1538421",
      },
      {
        id: "player#5",
        name: "Player 5",
        bid: 100,
        avatar: "https://avatars.githubusercontent.com/u/1538423",
      },
    ],
  })

  db.collection('lots').add({
    title: "Dogs Playing Poker",
    description:
  `Dogs Playing Poker, by Cassius Marcellus Coolidge, refers collectively to an 1894 painting, a 1903 series of sixteen oil paintings commissioned by Brown & Bigelow to advertise cigars, and a 1910 painting.[1][unreliable source?] All eighteen paintings in the overall series feature anthropomorphized dogs, but the eleven in which dogs are seated around a card table have become well known in the United States as examples of kitsch art in home decoration.

  Depictions and reenactments of the series have appeared in many films, television shows, theater productions, and other popular culture art forms. Critic Annette Ferrara has described Dogs Playing Poker as "indelibly burned into ... the American collective-schlock subconscious ... through incessant reproduction on all manner of pop ephemera".[2]`,
    preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Cassius_Marcellus_Coolidge_-_Poker_Sympathy.jpg/1920px-Cassius_Marcellus_Coolidge_-_Poker_Sympathy.jpg",
    images: [],
    publishedAt: Date.now()+2,
    startAt: Date.now()+2,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+2,
    startBid: 20,
    type: 1,
    owner: {
      id: 'sjgjsknsdnfiosd',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Cassius_Coolidge.jpg/220px-Cassius_Coolidge.jpg',
      name: 'Cassius Marcellus Coolidge',
    },
    bid: 0,//current bid
    players: [
     
    ],
  })

  db.collection('lots').add({
    title: "Covid19 shelter",
    description:
  `The room is protected from the outside and has everything you need to wait it out.`,
    preview: "https://pbs.twimg.com/media/Ec-KTZbXsAEovER.jpg:large",
    images: [],
    publishedAt: Date.now()+3,
    startAt: Date.now()+3,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+3,
    startBid: 30,
    type: 1,
    owner: {
      id: 'jfshgbfduigf',
      avatar: 'https://avatars.githubusercontent.com/u/1529621',
      name: 'Lab X',
    },
    bid: 0,//current bid
    players: [
     
    ],
  })

  db.collection('lots').add({
    title: "Vintage rocking chair",
    description:
  `Vintage rocking chair, in good condition, rust polishing needed`,
    preview: "https://images2.minutemediacdn.com/image/upload/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/shape/cover/sport/83c5707593b87031c5e7f2f777a2b184de7a9fa26639cc978ad21f02ffe1b3c1.jpg",
    images: [],
    publishedAt: Date.now()+4,
    startAt: Date.now()+4,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+4,
    startBid: 50,
    type: 1,
    owner: {
      id: 'jfshgbffefeduigf',
      avatar: 'https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2016/06/82639965_game-of-thrones-season-2-jon-snow.jpg?fit=976%2C549&quality=50&strip=all&ssl=1',
      name: 'Jon Snow',
    },
    bid: 30,//current bid
    players: [
     
    ],
  })

  db.collection('lots').add({
    title: 'Book: "How to name your child"',
    description:
  `Not sure what to name your child? A great expert will help.`,
    preview: "https://lh3.googleusercontent.com/-rXzk2LW8R2c/V8k6hxV5uBI/AAAAAAAAngU/mv9uZuS6MLA/w1200-h630-p-k-no-nu/image_thumb1.png?imgmax=800",
    images: [],
    publishedAt: Date.now()+5,
    startAt: Date.now()+5,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+5,
    startBid: 2,
    type: 1,
    owner: {
      id: 'jfshgbujkspduigf',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg',
      name: 'Elon Musk',
    },
    bid: 0,//current bid
    players: [
     
    ],
  }),

  db.collection('lots').add({
    title: 'Wheatfield with Crows',
    description:
  `Wheatfield with Crows (Dutch: Korenveld met kraaien) is a July 1890 painting by Vincent van Gogh. It has been cited by several critics as one of his greatest works.[1][2]

  It is commonly stated that this was van Gogh's final painting. This association was popularized by Vincente Minnelli’s 1956 biopic Lust for Life, which depicts van Gogh painting it immediately before shooting himself. His final painting in actuality was Tree Roots.[3] The evidence of his letters suggests that Wheatfield with Crows was completed around 10 July and predates such paintings as Auvers Town Hall on 14 July 1890 and Daubigny's Garden.[4][5][6] Moreover, Jan Hulsker has written that a painting of harvested wheat, Field with Stacks of Wheat (F771), must be a later painting.[7]`,
    preview: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg",
    images: [],
    publishedAt: Date.now()+6,
    startAt: Date.now()+6,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+6,
    startBid: 200,
    type: 1,
    owner: {
      id: 'vngt',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/220px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
      name: '	Vincent van Gogh',
    },
    bid: 0,//current bid
    players: [
     
    ],
  })


  db.collection('lots').add({
    title: 'Wheatfield Under Thunderclouds',
    description:
  `Wheatfield Under Thunderclouds (in Dutch, Korenveld onder onweerslucht) (F778, JH2097) is an 1890 oil painting by Vincent van Gogh. The painting measures 50.4 cm × 101.3 cm (19.8 in × 39.9 in). It depicts a relatively flat and featureless landscape with fields of green wheat, under a foreboding dark blue sky with a few heavy white clouds. The horizon divides the work almost into two, with shades of green and yellow below and shades of blue and white above. Since 1973 it has been on permanent loan to the Van Gogh Museum in Amsterdam.`,
    preview: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Vincent_van_Gogh_-_Wheatfield_under_thunderclouds_-_Google_Art_Project.jpg/440px-Vincent_van_Gogh_-_Wheatfield_under_thunderclouds_-_Google_Art_Project.jpg",
    images: [],
    publishedAt: Date.now()+7,
    startAt: Date.now()+7,
    finishAt: Date.now() + 14 * 24 * 60 * 60 * 1000+7,
    startBid: 150,
    type: 1,
    owner: {
      id: 'vngt',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/220px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
      name: '	Vincent van Gogh',
    },
    bid: 0,//current bid
    players: [
     
    ],
  })
}

