function HabibAliCordovaSquareReader() {
}

HabibAliCordovaSquareReader.prototype.setup = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "HabibAliCordovaSquareReader", "setup", []);
};

HabibAliCordovaSquareReader.prototype.authorizeReaderSDKIfNeeded = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "HabibAliCordovaSquareReader", "authorizeReaderSDKIfNeeded", []);
};

HabibAliCordovaSquareReader.prototype.startCheckout = function (params, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "HabibAliCordovaSquareReader", "startCheckout", [params]);
};

HabibAliCordovaSquareReader.prototype.pairCardReaders = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "HabibAliCordovaSquareReader", "pairCardReaders", []);
};

HabibAliCordovaSquareReader.prototype.deauthorize = function (successCallback, errorCallback) {
   cordova.exec(successCallback, errorCallback, "HabibAliCordovaSquareReader", "deauthorize", []);
};

HabibAliCordovaSquareReader.install = function () {
  window.squarereader = new HabibAliCordovaSquareReader();
  return window.squarereader;
};

cordova.addConstructor(HabibAliCordovaSquareReader.install);
