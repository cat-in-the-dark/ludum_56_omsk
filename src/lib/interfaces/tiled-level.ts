export interface ITiledLevel {
  backgroundcolor:  string;
  compressionlevel: number;
  height:           number;
  infinite:         boolean;
  layers:           Layer[];
  nextlayerid:      number;
  nextobjectid:     number;
  orientation:      string;
  renderorder:      string;
  tiledversion:     string;
  tileheight:       number;
  tilesets:         Tileset[];
  tilewidth:        number;
  type:             string;
  version:          string;
  width:            number;
}

export interface Layer {
  data?:      number[];
  height?:    number;
  id:         number;
  name:       string;
  opacity:    number;
  type:       string;
  visible:    boolean;
  width?:     number;
  x:          number;
  y:          number;
  draworder?: string;
  objects?:   Object[];
}

export interface Object {
  height:   number;
  id:       number;
  name:     string;
  rotation: number;
  type:     string;
  visible:  boolean;
  width:    number;
  x:        number;
  y:        number;
}

export interface Tileset {
  firstgid: number;
  source:   string;
}