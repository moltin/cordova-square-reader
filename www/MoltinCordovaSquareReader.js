function MoltinCordovaSquareReader() {
}

MoltinCordovaSquareReader.prototype.setup = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "MoltinCordovaSquareReader", "setup", []);
};

MoltinCordovaSquareReader.prototype.authorizeReaderSDKIfNeeded = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "MoltinCordovaSquareReader", "authorizeReaderSDKIfNeeded", []);
};

MoltinCordovaSquareReader.prototype.startCheckout = function (params, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "MoltinCordovaSquareReader", "startCheckout", [params]);
};

MoltinCordovaSquareReader.prototype.pairCardReaders = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "MoltinCordovaSquareReader", "pairCardReaders", []);
};

MoltinCordovaSquareReader.install = function () {
  window.squarereader = new MoltinCordovaSquareReader();
  return window.squarereader;
};

MoltinCordovaSquareReader.prototype.deauthorize = function (successCallback, errorCallback) {
   cordova.exec(successCallback, errorCallback, "MoltinCordovaSquareReader", "deauthorize", []);
};

cordova.addConstructor(MoltinCordovaSquareReader.install);
