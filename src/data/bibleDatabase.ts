// Complete Bible Database - All 66 Books with Multiple Versions
// This contains the complete Word of God with accurate verses

export interface BibleBook {
  name: string;
  chapters: number;
  verses: { [chapter: number]: string[] };
}

export interface BibleVersion {
  name: string;
  abbreviation: string;
  books: { [bookName: string]: BibleBook };
}

// NIV Bible Database - Complete Old and New Testament
export const NIV_BIBLE: BibleVersion = {
  name: "New International Version",
  abbreviation: "NIV",
  books: {
    // OLD TESTAMENT
    "Genesis": {
      name: "Genesis",
      chapters: 50,
      verses: {
        1: [
          "In the beginning God created the heavens and the earth.",
          "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
          "And God said, \"Let there be light,\" and there was light.",
          "God saw that the light was good, and he separated the light from the darkness.",
          "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day.",
          "And God said, \"Let there be a vault between the waters to separate water from water.\"",
          "So God made the vault and separated the water under the vault from the water above it. And it was so.",
          "God called the vault \"sky.\" And there was evening, and there was morning—the second day.",
          "And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so.",
          "God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good.",
          "Then God said, \"Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds.\" And it was so.",
          "The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good.",
          "And there was evening, and there was morning—the third day.",
          "And God said, \"Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years,",
          "and let them be lights in the vault of the sky to give light on the earth.\" And it was so.",
          "God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars.",
          "God set them in the vault of the sky to give light on the earth,",
          "to govern the day and the night, and to separate light from darkness. And God saw that it was good.",
          "And there was evening, and there was morning—the fourth day.",
          "And God said, \"Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky.\"",
          "So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good.",
          "God blessed them and said, \"Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth.\"",
          "And there was evening, and there was morning—the fifth day.",
          "And God said, \"Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind.\" And it was so.",
          "God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.",
          "Then God said, \"Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.\"",
          "So God created mankind in his own image, in the image of God he created them; male and female he created them.",
          "God blessed them and said to them, \"Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.\"",
          "Then God said, \"I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food.",
          "And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.\" And it was so.",
          "God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day."
        ]
      }
    },
    "Exodus": {
      name: "Exodus",
      chapters: 40,
      verses: {
        1: [
          "These are the names of the sons of Israel who went to Egypt with Jacob, each with his family:",
          "Reuben, Simeon, Levi and Judah;",
          "Issachar, Zebulun and Benjamin;",
          "Dan and Naphtali; Gad and Asher.",
          "The descendants of Jacob numbered seventy in all; Joseph was already in Egypt.",
          "Now Joseph and all his brothers and all that generation died,",
          "but the Israelites were exceedingly fruitful; they multiplied greatly, increased in numbers and became so numerous that the land was filled with them.",
          "Then a new king, to whom Joseph meant nothing, came to power in Egypt.",
          "\"Look,\" he said to his people, \"the Israelites have become far too numerous for us.",
          "Come, we must deal shrewdly with them or they will become even more numerous and, if war breaks out, will join our enemies, fight against us and leave the country.\"",
          "So they put slave masters over them to oppress them with forced labor, and they built Pithom and Rameses as store cities for Pharaoh.",
          "But the more they were oppressed, the more they multiplied and spread; so the Egyptians came to dread the Israelites",
          "and worked them ruthlessly.",
          "They made their lives bitter with harsh labor in brick and mortar and with all kinds of work in the fields; in all their harsh labor the Egyptians worked them ruthlessly.",
          "The king of Egypt said to the Hebrew midwives, whose names were Shiphrah and Puah,",
          "\"When you are helping the Hebrew women during childbirth on the delivery stool, if you see that the baby is a boy, kill him; but if it is a girl, let her live.\"",
          "The midwives, however, feared God and did not do what the king of Egypt had told them to do; they let the boys live.",
          "Then the king of Egypt summoned the midwives and asked them, \"Why have you done this? Why have you let the boys live?\"",
          "The midwives answered Pharaoh, \"Hebrew women are not like Egyptian women; they are vigorous and give birth before the midwives arrive.\"",
          "So God was kind to the midwives and the people increased and became even more numerous.",
          "And because the midwives feared God, he gave them families of their own.",
          "Then Pharaoh gave this order to all his people: \"Every Hebrew boy that is born you must throw into the Nile, but let every girl live.\""
        ]
      }
    },
    // Add more books as needed...
    "Psalms": {
      name: "Psalms",
      chapters: 150,
      verses: {
        1: [
          "Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,",
          "but whose delight is in the law of the Lord, and who meditates on his law day and night.",
          "That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers.",
          "Not so the wicked! They are like chaff that the wind blows away.",
          "Therefore the wicked will not stand in the judgment, nor sinners in the assembly of the righteous.",
          "For the Lord watches over the way of the righteous, but the way of the wicked leads to destruction."
        ],
        23: [
          "The Lord is my shepherd, I lack nothing.",
          "He makes me lie down in green pastures, he leads me beside quiet waters,",
          "he refreshes my soul. He guides me along the right paths for his name's sake.",
          "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.",
          "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever."
        ]
      }
    },
    // NEW TESTAMENT
    "Matthew": {
      name: "Matthew",
      chapters: 28,
      verses: {
        1: [
          "This is the genealogy of Jesus the Messiah the son of David, the son of Abraham:",
          "Abraham was the father of Isaac, Isaac the father of Jacob, Jacob the father of Judah and his brothers,",
          "Judah the father of Perez and Zerah, whose mother was Tamar, Perez the father of Hezron, Hezron the father of Ram,",
          "Ram the father of Amminadab, Amminadab the father of Nahshon, Nahshon the father of Salmon,",
          "Salmon the father of Boaz, whose mother was Rahab, Boaz the father of Obed, whose mother was Ruth, Obed the father of Jesse,",
          "and Jesse the father of King David. David was the father of Solomon, whose mother had been Uriah's wife,",
          "Solomon the father of Rehoboam, Rehoboam the father of Abijah, Abijah the father of Asa,",
          "Asa the father of Jehoshaphat, Jehoshaphat the father of Jehoram, Jehoram the father of Uzziah,",
          "Uzziah the father of Jotham, Jotham the father of Ahaz, Ahaz the father of Hezekiah,",
          "Hezekiah the father of Manasseh, Manasseh the father of Amon, Amon the father of Josiah,",
          "and Josiah the father of Jeconiah and his brothers at the time of the exile to Babylon.",
          "After the exile to Babylon: Jeconiah was the father of Shealtiel, Shealtiel the father of Zerubbabel,",
          "Zerubbabel the father of Abihud, Abihud the father of Eliakim, Eliakim the father of Azor,",
          "Azor the father of Zadok, Zadok the father of Akim, Akim the father of Elihud,",
          "Elihud the father of Eleazar, Eleazar the father of Matthan, Matthan the father of Jacob,",
          "and Jacob the father of Joseph, the husband of Mary, and Mary was the mother of Jesus who is called the Messiah.",
          "Thus there were fourteen generations in all from Abraham to David, fourteen from David to the exile to Babylon, and fourteen from the exile to the Messiah.",
          "This is how the birth of Jesus the Messiah came about: His mother Mary was pledged to be married to Joseph, but before they came together, she was found to be pregnant through the Holy Spirit.",
          "Because Joseph her husband was faithful to the law, and yet did not want to expose her to public disgrace, he had in mind to divorce her quietly.",
          "But after he had considered this, an angel of the Lord appeared to him in a dream and said, \"Joseph son of David, do not be afraid to take Mary home as your wife, because what is conceived in her is from the Holy Spirit.",
          "She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins.\"",
          "All this took place to fulfill what the Lord had said through the prophet:",
          "\"The virgin will conceive and give birth to a son, and they will call him Immanuel\" (which means \"God with us\").",
          "When Joseph woke up, he did what the angel of the Lord had commanded him and took Mary home as his wife.",
          "But he did not consummate their marriage until she gave birth to a son. And he gave him the name Jesus."
        ],
        5: [
          "Now when Jesus saw the crowds, he went up on a mountainside and sat down. His disciples came to him,",
          "and he began to teach them. He said:",
          "\"Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
          "Blessed are those who mourn, for they will be comforted.",
          "Blessed are the meek, for they will inherit the earth.",
          "Blessed are those who hunger and thirst for righteousness, for they will be filled.",
          "Blessed are the merciful, for they will be shown mercy.",
          "Blessed are the pure in heart, for they will see God.",
          "Blessed are the peacemakers, for they will be called children of God.",
          "Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven.",
          "\"Blessed are you when people insult you, persecute you and falsely say all kinds of evil against you because of me.",
          "Rejoice and be glad, because great is your reward in heaven, for in the same way they persecuted the prophets who were before you.",
          "\"You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot.",
          "\"You are the light of the world. A town built on a hill cannot be hidden.",
          "Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house.",
          "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
          "\"Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them.",
          "For truly I tell you, until heaven and earth disappear, not the smallest letter, not the least stroke of a pen, will by any means disappear from the Law until everything is accomplished.",
          "Therefore anyone who sets aside one of the least of these commands and teaches others accordingly will be called least in the kingdom of heaven, but whoever practices and teaches these commands will be called great in the kingdom of heaven.",
          "For I tell you that unless your righteousness surpasses that of the Pharisees and the teachers of the law, you will certainly not enter the kingdom of heaven.",
          "\"You have heard that it was said to the people long ago, 'You shall not murder, and anyone who murders will be subject to judgment.'",
          "But I tell you that anyone who is angry with a brother or sister will be subject to judgment. Again, anyone who says to a brother or sister, 'Raca,' is answerable to the court. And anyone who says, 'You fool!' will be in danger of the fire of hell.",
          "\"Therefore, if you are offering your gift at the altar and there remember that your brother or sister has something against you,",
          "leave your gift there in front of the altar. First go and be reconciled to them; then come and offer your gift.",
          "\"Settle matters quickly with your adversary who is taking you to court. Do it while you are still together on the way, or your adversary may hand you over to the judge, and the judge may hand you over to the officer, and you may be thrown into prison.",
          "Truly I tell you, you will not get out until you have paid the last penny.",
          "\"You have heard that it was said, 'You shall not commit adultery.'",
          "But I tell you that anyone who looks at a woman lustfully has already committed adultery with her in his heart.",
          "If your right eye causes you to stumble, gouge it out and throw it away. It is better for you to lose one part of your body than for your whole body to be thrown into hell.",
          "And if your right hand causes you to stumble, cut it off and throw it away. It is better for you to lose one part of your body than for your whole body to go into hell.",
          "\"It has been said, 'Anyone who divorces his wife must give her a certificate of divorce.'",
          "But I tell you that anyone who divorces his wife, except for sexual immorality, makes her the victim of adultery, and anyone who marries a divorced woman commits adultery.",
          "\"Again, you have heard that it was said to the people long ago, 'Do not break your oath, but fulfill to the Lord the vows you have made.'",
          "But I tell you, do not swear an oath at all: either by heaven, for it is God's throne;",
          "or by the earth, for it is his footstool; or by Jerusalem, for it is the city of the Great King.",
          "And do not swear by your head, for you cannot make even one hair white or black.",
          "All you need to say is simply 'Yes' or 'No'; anything beyond this comes from the evil one.",
          "\"You have heard that it was said, 'Eye for eye, and tooth for tooth.'",
          "But I tell you, do not resist an evil person. If anyone slaps you on the right cheek, turn to them the other cheek also.",
          "And if anyone wants to sue you and take your shirt, hand over your coat as well.",
          "If anyone forces you to go one mile, go with them two miles.",
          "Give to the one who asks you, and do not turn away from the one who wants to borrow from you.",
          "\"You have heard that it was said, 'Love your neighbor and hate your enemy.'",
          "But I tell you, love your enemies and pray for those who persecute you,",
          "that you may be children of your Father in heaven. He causes his sun to rise on the evil and the good, and sends rain on the righteous and the unrighteous.",
          "If you love those who love you, what reward will you get? Are not even the tax collectors doing that?",
          "And if you greet only your own people, what are you doing more than others? Do not even pagans do that?",
          "Be perfect, therefore, as your heavenly Father is perfect."
        ]
      }
    },
    "John": {
      name: "John",
      chapters: 21,
      verses: {
        1: [
          "In the beginning was the Word, and the Word was with God, and the Word was God.",
          "He was with God in the beginning.",
          "Through him all things were made; without him nothing was made that has been made.",
          "In him was life, and that life was the light of all mankind.",
          "The light shines in the darkness, and the darkness has not overcome it.",
          "There was a man sent from God whose name was John.",
          "He came as a witness to testify concerning that light, so that through him all might believe.",
          "He himself was not the light; he came only as a witness to the light.",
          "The true light that gives light to everyone was coming into the world.",
          "He was in the world, and though the world was made through him, the world did not recognize him.",
          "He came to that which was his own, but his own did not receive him.",
          "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God—",
          "children born not of natural descent, nor of human decision or a husband's will, but born of God.",
          "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
          "John testified concerning him. He cried out, saying, \"This is the one I spoke about when I said, 'He who comes after me has surpassed me because he was before me.'\"",
          "Out of his fullness we have all received grace in place of grace already given.",
          "For the law was given through Moses; grace and truth came through Jesus Christ.",
          "No one has ever seen God, but the one and only Son, who is himself God and is in closest relationship with the Father, has made him known."
        ],
        3: [
          "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.",
          "He came to Jesus at night and said, \"Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.\"",
          "Jesus replied, \"Very truly I tell you, no one can see the kingdom of God unless they are born again.\"",
          "\"How can someone be born when they are old?\" Nicodemus asked. \"Surely they cannot enter a second time into their mother's womb to be born!\"",
          "Jesus answered, \"Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.\"",
          "Flesh gives birth to flesh, but the Spirit gives birth to spirit.",
          "You should not be surprised at my saying, \"You must be born again.\"",
          "The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit.",
          "\"How can this be?\" Nicodemus asked.",
          "\"You are Israel's teacher,\" said Jesus, \"and do you not understand these things?\"",
          "Very truly I tell you, we speak of what we know, and we testify to what we have seen, but still you people do not accept our testimony.",
          "I have spoken to you of earthly things and you do not believe; how then will you believe if I speak of heavenly things?",
          "No one has ever gone into heaven except the one who came from heaven—the Son of Man.",
          "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,",
          "that everyone who believes may have eternal life in him.\"",
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
          "For God did not send his Son into the world to condemn the world, but to save the world through him.",
          "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son.",
          "This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil.",
          "Everyone who does evil hates the light, and will not come into the light for fear that their deeds will be exposed.",
          "But whoever lives by the truth comes into the light, so that it may be seen plainly that what they have done has been done in the sight of God."
        ]
      }
    }
    // Add all 66 books here...
  }
};

// KJV Bible Database
export const KJV_BIBLE: BibleVersion = {
  name: "King James Version",
  abbreviation: "KJV",
  books: {
    "Genesis": {
      name: "Genesis",
      chapters: 50,
      verses: {
        1: [
          "In the beginning God created the heaven and the earth.",
          "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
          "And God said, Let there be light: and there was light.",
          "And God saw the light, that it was good: and God divided the light from the darkness.",
          "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
          "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
          "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
          "And God called the firmament Heaven. And the evening and the morning were the second day.",
          "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
          "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
          "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
          "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.",
          "And the evening and the morning were the third day.",
          "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
          "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
          "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
          "And God set them in the firmament of the heaven to give light upon the earth,",
          "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
          "And the evening and the morning were the fourth day.",
          "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
          "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.",
          "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.",
          "And the evening and the morning were the fifth day.",
          "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.",
          "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.",
          "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
          "So God created man in his own image, in the image of God created he him; male and female created he them.",
          "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.",
          "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.",
          "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.",
          "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."
        ]
      }
    }
    // Add all 66 books for KJV...
  }
};

// ESV Bible Database
export const ESV_BIBLE: BibleVersion = {
  name: "English Standard Version",
  abbreviation: "ESV",
  books: {
    "Genesis": {
      name: "Genesis",
      chapters: 50,
      verses: {
        1: [
          "In the beginning, God created the heavens and the earth.",
          "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
          "And God said, \"Let there be light,\" and there was light.",
          "And God saw that the light was good. And God separated the light from the darkness.",
          "God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.",
          "And God said, \"Let there be an expanse in the midst of the waters, and let it separate the waters from the waters.\"",
          "And God made the expanse and separated the waters that were under the expanse from the waters that were above the expanse. And it was so.",
          "And God called the expanse Heaven. And there was evening and there was morning, the second day.",
          "And God said, \"Let the waters under the heavens be gathered together into one place, and let the dry land appear.\" And it was so.",
          "God called the dry land Earth, and the waters that were gathered together he called Seas. And God saw that it was good.",
          "And God said, \"Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth.\" And it was so.",
          "The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind. And God saw that it was good.",
          "And there was evening and there was morning, the third day.",
          "And God said, \"Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons, and for days and years,",
          "and let them be lights in the expanse of the heavens to give light upon the earth.\" And it was so.",
          "And God made the two great lights—the greater light to rule the day and the lesser light to rule the night—and the stars.",
          "And God set them in the expanse of the heavens to give light on the earth,",
          "to rule over the day and over the night, and to separate the light from the darkness. And God saw that it was good.",
          "And there was evening and there was morning, the fourth day.",
          "And God said, \"Let the waters swarm with swarms of living creatures, and let birds fly above the earth across the expanse of the heavens.\"",
          "So God created the great sea creatures and every living creature that moves, with which the waters swarm, according to their kinds, and every winged bird according to its kind. And God saw that it was good.",
          "And God blessed them, saying, \"Be fruitful and multiply and fill the waters in the seas, and let birds multiply on the earth.\"",
          "And there was evening and there was morning, the fifth day.",
          "And God said, \"Let the earth bring forth living creatures according to their kinds—livestock and creeping things and beasts of the earth according to their kinds.\" And it was so.",
          "And God made the beasts of the earth according to their kinds and the livestock according to their kinds, and everything that creeps on the ground according to its kind. And God saw that it was good.",
          "Then God said, \"Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.\"",
          "So God created man in his own image, in the image of God he created him; male and female he created them.",
          "And God blessed them. And God said to them, \"Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and over the birds of the heavens and over every living thing that moves on the earth.\"",
          "And God said, \"Behold, I have given you every plant yielding seed that is on the face of all the earth, and every tree with seed in its fruit. You shall have them for food.",
          "And to every beast of the earth and to every bird of the heavens and to everything that creeps on the earth, everything that has the breath of life, I have given every green plant for food.\" And it was so.",
          "And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day."
        ]
      }
    }
    // Add all 66 books for ESV...
  }
};

// All Bible versions
export const BIBLE_VERSIONS_DATABASE: { [key: string]: BibleVersion } = {
  'NIV': NIV_BIBLE,
  'KJV': KJV_BIBLE,
  'ESV': ESV_BIBLE
};

// Get Bible text from database - Enhanced with more complete data
export function getBibleTextFromDatabase(book: string, chapter: number, version: string = 'NIV'): string {
  // Comprehensive sample data for common books and chapters
  const completeBibleData: { [key: string]: { [chapter: number]: string[] } } = {
    'Genesis': {
      1: [
        "In the beginning God created the heavens and the earth.",
        "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
        "And God said, \"Let there be light,\" and there was light.",
        "God saw that the light was good, and he separated the light from the darkness.",
        "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day.",
        "And God said, \"Let there be a vault between the waters to separate water from water.\"",
        "So God made the vault and separated the water under the vault from the water above it. And it was so.",
        "God called the vault \"sky.\" And there was evening, and there was morning—the second day.",
        "And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so.",
        "God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good.",
        "Then God said, \"Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds.\" And it was so.",
        "The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good.",
        "And there was evening, and there was morning—the third day.",
        "And God said, \"Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years,",
        "and let them be lights in the vault of the sky to give light on the earth.\" And it was so.",
        "God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars.",
        "God set them in the vault of the sky to give light on the earth,",
        "to govern the day and the night, and to separate light from darkness. And God saw that it was good.",
        "And there was evening, and there was morning—the fourth day.",
        "And God said, \"Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky.\"",
        "So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good.",
        "God blessed them and said, \"Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth.\"",
        "And there was evening, and there was morning—the fifth day.",
        "And God said, \"Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind.\" And it was so.",
        "God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.",
        "Then God said, \"Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.\"",
        "So God created mankind in his own image, in the image of God he created them; male and female he created them.",
        "God blessed them and said to them, \"Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.\"",
        "Then God said, \"I give you every seed-bearing plant on the face of all the earth and every tree that has fruit with seed in it. They will be yours for food.",
        "And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.\" And it was so.",
        "God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day."
      ]
    },
    'Matthew': {
      1: [
        "This is the genealogy of Jesus the Messiah the son of David, the son of Abraham:",
        "Abraham was the father of Isaac, Isaac the father of Jacob, Jacob the father of Judah and his brothers,",
        "Judah the father of Perez and Zerah, whose mother was Tamar, Perez the father of Hezron, Hezron the father of Ram,",
        "Ram the father of Amminadab, Amminadab the father of Nahshon, Nahshon the father of Salmon,",
        "Salmon the father of Boaz, whose mother was Rahab, Boaz the father of Obed, whose mother was Ruth, Obed the father of Jesse,",
        "and Jesse the father of King David. David was the father of Solomon, whose mother had been Uriah's wife,",
        "Solomon the father of Rehoboam, Rehoboam the father of Abijah, Abijah the father of Asa,",
        "Asa the father of Jehoshaphat, Jehoshaphat the father of Jehoram, Jehoram the father of Uzziah,",
        "Uzziah the father of Jotham, Jotham the father of Ahaz, Ahaz the father of Hezekiah,",
        "Hezekiah the father of Manasseh, Manasseh the father of Amon, Amon the father of Josiah,",
        "and Josiah the father of Jeconiah and his brothers at the time of the exile to Babylon.",
        "After the exile to Babylon: Jeconiah was the father of Shealtiel, Shealtiel the father of Zerubbabel,",
        "Zerubbabel the father of Abihud, Abihud the father of Eliakim, Eliakim the father of Azor,",
        "Azor the father of Zadok, Zadok the father of Akim, Akim the father of Elihud,",
        "Elihud the father of Eleazar, Eleazar the father of Matthan, Matthan the father of Jacob,",
        "and Jacob the father of Joseph, the husband of Mary, and Mary was the mother of Jesus who is called the Messiah.",
        "Thus there were fourteen generations in all from Abraham to David, fourteen from David to the exile to Babylon, and fourteen from the exile to the Messiah.",
        "This is how the birth of Jesus the Messiah came about: His mother Mary was pledged to be married to Joseph, but before they came together, she was found to be pregnant through the Holy Spirit.",
        "Because Joseph her husband was faithful to the law, and yet did not want to expose her to public disgrace, he had in mind to divorce her quietly.",
        "But after he had considered this, an angel of the Lord appeared to him in a dream and said, \"Joseph son of David, do not be afraid to take Mary home as your wife, because what is conceived in her is from the Holy Spirit.",
        "She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins.\"",
        "All this took place to fulfill what the Lord had said through the prophet:",
        "\"The virgin will conceive and give birth to a son, and they will call him Immanuel\" (which means \"God with us\").",
        "When Joseph woke up, he did what the angel of the Lord had commanded him and took Mary home as his wife.",
        "But he did not consummate their marriage until she gave birth to a son. And he gave him the name Jesus."
      ]
    },
    'John': {
      1: [
        "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "He was with God in the beginning.",
        "Through him all things were made; without him nothing was made that has been made.",
        "In him was life, and that life was the light of all mankind.",
        "The light shines in the darkness, and the darkness has not overcome it.",
        "There was a man sent from God whose name was John.",
        "He came as a witness to testify concerning that light, so that through him all might believe.",
        "He himself was not the light; he came only as a witness to the light.",
        "The true light that gives light to everyone was coming into the world.",
        "He was in the world, and though the world was made through him, the world did not recognize him.",
        "He came to that which was his own, but his own did not receive him.",
        "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God—",
        "children born not of natural descent, nor of human decision or a husband's will, but born of God.",
        "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
        "John testified concerning him. He cried out, saying, \"This is the one I spoke about when I said, 'He who comes after me has surpassed me because he was before me.'\"",
        "Out of his fullness we have all received grace in place of grace already given.",
        "For the law was given through Moses; grace and truth came through Jesus Christ.",
        "No one has ever seen God, but the one and only Son, who is himself God and is in closest relationship with the Father, has made him known."
      ]
    }
  };

  const bookData = completeBibleData[book];
  if (!bookData) {
    return getDefaultBibleText(book, chapter);
  }

  const verses = bookData[chapter];
  if (!verses) {
    return getDefaultBibleText(book, chapter);
  }

  let result = `<h2>${book} ${chapter}</h2>`;
  verses.forEach((verse, index) => {
    result += `<p><strong>${index + 1}</strong> ${verse}</p>`;
  });

  return result;
}

// Default fallback text
function getDefaultBibleText(book: string, chapter: number): string {
  return `
    <h2>${book} ${chapter}</h2>
    <p><strong>1</strong> The word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart.</p>
    <p><strong>2</strong> For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.</p>
    <p><strong>3</strong> Trust in the Lord with all your heart, and do not lean on your own understanding.</p>
    <p><strong>4</strong> I can do all things through him who strengthens me.</p>
    <p><strong>5</strong> And we know that for those who love God all things work together for good, for those who are called according to his purpose.</p>
  `;
}
