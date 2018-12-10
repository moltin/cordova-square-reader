function F3CordovaSquareReader() {
}

F3CordovaSquareReader.prototype.setup = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "F3CordovaSquareReader", "setup", []);
};

F3CordovaSquareReader.prototype.authorizeReaderSDKIfNeeded = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "F3CordovaSquareReader", "authorizeReaderSDKIfNeeded", []);
};

F3CordovaSquareReader.prototype.startCheckout = function (params, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "F3CordovaSquareReader", "startCheckout", [params]);
};

F3CordovaSquareReader.prototype.pairCardReaders = function (successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "F3CordovaSquareReader", "pairCardReaders", []);
};

F3CordovaSquareReader.prototype.deauthorize = function (successCallback, errorCallback) {
   cordova.exec(successCallback, errorCallback, "F3CordovaSquareReader", "deauthorize", []);
};

F3CordovaSquareReader.install = function () {
  window.squarereader = new F3CordovaSquareReader();
  return window.squarereader;
};

cordova.addConstructor(F3CordovaSquareReader.install);
