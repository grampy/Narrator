var $g = {};
tree = {
  "att": {},
  "cit": {
    "1": {"src": 1,"ref": {"birt": [1]}},
    "2": {"src": 2,"ref": {"reli": [2]}}
  },
  "doc": {
    "w": {"G": "2024.07.06"}
  },
  "evt": {
    "1": {"k": "birt","pri": {"1": {"ind": 1, age: "7m"}},"w": {"G": "20001225"},"pla": 1,"cit": 1,"d": "birth & Baptism with all bells and whistles","sec": {"2": {"ind": 2}}},
    "2": {"k": "reli","pri": {"3": {"ind": 1}},"q": "Baptism","w": {"G": "20001226"},"pla": 2,"cit": 2,"sec": {"4": {"ind": 3},"5": {"ind": 4},"6": {"ind": 5}}},
    "3": {"k": "deat","pri": {"7": {"ind": 1}},"w": {"G": "20240604"}},
    "4": {"k": "occu","pri": {"8": {"ind": 6}}}
  },
  "g2gXid": {},
  "ind": {
    "#": {},
    "1": {"map": {"1": [2]},"g": "M","n": {"f": "Jesus","l": "Christ","p": "Baby"},"evt": {"birt": {"pri": 1},"reli": {"pri": 2},"deat": {"pri": 3}},"ref": {"rel": [3]}},
    "2": {"n": {"e": "Dr Zeus"},"evt": {"1": {}}},
    "3": {"n": {"e": "Rabbi"},"evt": {"2": {}}},
    "4": {"n": {"e": "Zeus"},"evt": {"2": {}}},
    "5": {"n": {"e": "Aphrodite"},"evt": {"2": {}}},
    "6": {"map": {"1": [3]},"g": "M","n": {"f": "Joseph","l": "the carpenter"},"evt": {"occu": {"pri": 4}},"ref": {"rel": [1]}},
    "7": {"map": {"1": [4]},"g": "F","n": {"f": "Mary","l": "Mother Of Christ"},"ref": {"rel": [2]}}
  },
  "fam": {
    "1": {"map": {"1": [5]},"ref": {"rel": [1,2,3]}}
  },
  "map": {
    "1": {"b": {"l": 0,"r": 161,"t": 0,"b": 188},"t": "GenoMap1","obj": {
     "2": {"data": {"ind": 1},"s": 3,"z": 105,"l": {"b": {"t": "Jesus\nChrist","w": "31","h": "28"},"t": {"t": "2000-2024","w": "60","h": "14"}},"b": {"l": 48,"t": 109,"r": 116,"b": 188},"x": 82,"y": 141},
     "3": {"data": {"ind": 6},"s": 3,"z": 105,"l": {"b": {"t": "Joseph\nthe\ncarpenter","w": "49","h": "42"}},"b": {"l": 0,"t": 0,"r": 63,"b": 87},"x": 32,"y": 26},
     "4": {"data": {"ind": 7},"s": 3,"z": 105,"l": {"b": {"t": "Mary\nMother Of\nChrist","w": "45","h": "42"}},"b": {"l": 102,"t": 0,"r": 161,"b": 87},"x": 132,"y": 26},
     "5": {"data": {"fam": 1},"s": 3,"z": 107,"x": 82,"y": 91,"l": 32,"r": 132},
     "6": {"data": {"rel": 1},"s": 3,"z": 104,"fam": 5,"ind": 3,"a": {"c": "black"}},
     "7": {"data": {"rel": 2},"s": 3,"z": 104,"fam": 5,"ind": 4,"a": {"c": "black"}},
     "8": {"data": {"rel": 3},"s": 3,"z": 104,"fam": 5,"ind": 2,"a": {"c": "black"}}},"pla": [],"evt": [1,2,3],"z": [null,null,null,null,null,6,7,8,2,3,4,5]}
  },
  "mm": {},
  "org": {},
  "pat": {
    "1": {"t": "adopted","l": [{"c": "blue","d": [5]}]},
    "2": {"t": "foster","l": [{"c": "green","d": [5]}]},
    "fDefault": {"t": "eDefault","l": [{"c": "grey"}]},
    "null": {"t": "fundefined"}
  },
  "pla": {
    "1": {"n": {"e": "Bethlehem"},"evt": {"birt": [1]}},
    "2": {"n": {"e": "Nazareth"},"evt": {"reli": [2]}}
  },
  "rel": {
    "1": {"ind": 6,"fam": 1,"map": {"1": [6]}},
    "2": {"ind": 7,"fam": 1,"map": {"1": [7]}},
    "3": {"k": "B","ind": 1,"fam": 1,"map": {"1": [8]}}
  },
  "rol": {
    "1": {"t": "","k": "birt"},
    "2": {"t": "doctor","k": "birt"},
    "3": {"t": "","k": "reli"},
    "4": {"t": "Officiator","k": "reli"},
    "5": {"t": "godfather","k": "reli"},
    "6": {"t": "godmother","k": "reli"},
    "7": {"t": "","k": "deat"},
    "8": {"t": "Carpenter","k": "occu"}
  },
  "src": {
    "1": {"t": "The Bible"},
    "2": {"t": "Genesis"}
  }
}
