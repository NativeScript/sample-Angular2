import {KeyMetadataError} from './exceptions';
import {MapWrapper,
  Map} from 'angular2/src/facade/collection';
import {int,
  isPresent} from 'angular2/src/facade/lang';
export class Key {
  constructor(token, id) {
    this.token = token;
    this.id = id;
    this.metadata = null;
  }
  static setMetadata(key, metadata) {
    if (isPresent(key.metadata) && key.metadata !== metadata) {
      throw new KeyMetadataError();
    }
    key.metadata = metadata;
    return key;
  }
  static get(token) {
    return _globalKeyRegistry.get(token);
  }
  static get numberOfKeys() {
    return _globalKeyRegistry.numberOfKeys;
  }
}
Object.defineProperty(Key, "parameters", {get: function() {
    return [[], [int]];
  }});
Object.defineProperty(Key.setMetadata, "parameters", {get: function() {
    return [[Key], []];
  }});
export class KeyRegistry {
  constructor() {
    this._allKeys = MapWrapper.create();
  }
  get(token) {
    if (token instanceof Key)
      return token;
    if (MapWrapper.contains(this._allKeys, token)) {
      return MapWrapper.get(this._allKeys, token);
    }
    var newKey = new Key(token, Key.numberOfKeys);
    MapWrapper.set(this._allKeys, token, newKey);
    return newKey;
  }
  get numberOfKeys() {
    return MapWrapper.size(this._allKeys);
  }
}
var _globalKeyRegistry = new KeyRegistry();
//# sourceMappingURL=key.js.map

//# sourceMappingURL=./key.map