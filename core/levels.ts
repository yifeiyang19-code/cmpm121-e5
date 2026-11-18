// The level set, as data. Rows use the format described above parsePuzzle().
//
// `par` is a shortest known solution in the usual Sokoban notation: one letter
// per move (u, d, l, r), uppercase when the move pushes a crate. The replay
// check plays these routes; the designer keeps them up to date.

export interface LevelData {
  readonly name: string;
  readonly rows: readonly string[];
  readonly par: string;
}

export const LEVELS: readonly LevelData[] = [
  {
    name: "Loading Dock",
    rows: [
      "########",
      "#      #",
      "# @ $ .#",
      "#      #",
      "########",
    ],
    par: "rRR",
  },
  {
    name: "Pallet Swap",
    rows: [
      "######",
      "#    #",
      "# $$ #",
      "#.@ .#",
      "######",
    ],
    par: "luurDRurDldL",
  },
  {
    name: "Crossroads",
    rows: [
      "#######",
      "#  .  #",
      "#  $  #",
      "# $@$ #",
      "#. # .#",
      "#######",
    ],
    par: "UdLulDrrRurD",
  },
  {
    name: "Double Stack",
    rows: [
      "########",
      "#  ..  #",
      "# $$$$ #",
      "#  ..@ #",
      "########",
    ],
    par: "UdllUdlluurDldRurRdrruuLDrdL",
  },
  {
    name: "Back Room",
    rows: [
      "#######",
      "#  .  #",
      "# $#$ #",
      "#. @ .#",
      "# $#  #",
      "#  .$ #",
      "#######",
    ],
    par: "llddrUluRRRdrdLuullluurrrDrDLddrUluLLUluR",
  },
];
